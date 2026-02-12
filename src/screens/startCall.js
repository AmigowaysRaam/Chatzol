import firestore from '@react-native-firebase/firestore';
import {
    RTCPeerConnection,
    mediaDevices,
    RTCSessionDescription,
    RTCIceCandidate,
    MediaStream,
} from 'react-native-webrtc';

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const startCall = async (callId, setLocalStream, setRemoteStream, onCallEnded) => {
    const pc = new RTCPeerConnection(configuration);

    // Step 1: Get local audio stream
    const localStream = await mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    setLocalStream(localStream);

    // Step 2: Set up Firestore references
    const callDoc = firestore().collection('calls').doc(callId);
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    // Step 3: ICE candidate sending
    pc.onicecandidate = event => {
        if (event.candidate) {
            offerCandidates.add(event.candidate.toJSON());
        }
    };

    // Step 4: Handle remote stream
    const remoteStream = new MediaStream();
    pc.ontrack = event => {
        remoteStream.addTrack(event.track);
        setRemoteStream(remoteStream);
    };

    // Step 5: Create and set offer
    const offerDesc = await pc.createOffer();
    await pc.setLocalDescription(offerDesc);

    const offer = {
        sdp: offerDesc.sdp,
        type: offerDesc.type,
    };

    // Step 6: Save offer and call metadata
    await callDoc.set({
        offer,
        callEnded: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // Step 7: Listen for answer + callEnded flag
    callDoc.onSnapshot(snapshot => {
        const data = snapshot.data();
        if (!data) return;

        if (data.answer && !pc.currentRemoteDescription) {
            const answerDesc = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(answerDesc);
        }

        if (data.callEnded) {
            console.log('Call ended by callee.');
            // Stop media tracks
            localStream.getTracks().forEach(track => track.stop());
            remoteStream.getTracks().forEach(track => track.stop());
            pc.close();
            // Optional: Trigger a callback or UI update
            if (typeof onCallEnded === 'function') {
                onCallEnded();
            }
        }
    });

    // Step 8: Listen for callee's ICE candidates
    answerCandidates.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });

    return {
        callId,
        peerConnection: pc,
        localStream,
    };
};
