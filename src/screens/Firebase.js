import firestore from '@react-native-firebase/firestore';
import {
    RTCPeerConnection,
    mediaDevices,
    RTCSessionDescription,
    RTCIceCandidate,
} from 'react-native-webrtc';

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};


export const startCall = async (callId, setLocalStream, setRemoteStream) => {
    const pc = new RTCPeerConnection(configuration);
    // Step 1: Get the local stream (audio only in this case)
    const localStream = await mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
    });
    setLocalStream(localStream);  // Update state with local stream

    // Step 2: Reference Firestore collection for this callId
    const callDoc = firestore().collection('calls').doc(callId);
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    // Step 3: Handle ICE candidates
    pc.onicecandidate = event => {
        if (event.candidate) {
            // Send ICE candidates to Firestore
            offerCandidates.add(event.candidate.toJSON());
        }
    };

    // Step 4: Handle remote stream
    const remoteStream = new MediaStream();
    pc.ontrack = event => {
        remoteStream.addTrack(event.track);
        setRemoteStream(remoteStream);  // Update state with remote stream
    };

    // Step 5: Create an offer
    const offerDesc = await pc.createOffer();
    await pc.setLocalDescription(offerDesc);

    const offer = {
        sdp: offerDesc.sdp,
        type: offerDesc.type,
    };

    // Step 6: Save the offer in Firestore
    await callDoc.set({ offer });

    // Step 7: Listen for the answer from the callee (callee will update Firestore with their answer)
    callDoc.onSnapshot(snapshot => {
        const data = snapshot.data();
        if (data?.answer && !pc.currentRemoteDescription) {
            const answerDesc = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(answerDesc);
        }
    });

    // Step 8: Listen for callee's ICE candidates (from Firestore)
    answerCandidates.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });

    return pc;  // Return peer connection object
};
