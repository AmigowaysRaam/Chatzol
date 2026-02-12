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

export const answerCall = async (callId, setLocalStream, setRemoteStream) => {
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
            answerCandidates.add(event.candidate.toJSON());
        }
    };

    // Step 4: Handle remote stream
    const remoteStream = new MediaStream();
    pc.ontrack = event => {
        remoteStream.addTrack(event.track);
        setRemoteStream(remoteStream);
    };

    // Step 5: Get offer and set as remote description
    const callData = (await callDoc.get()).data();
    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    // Step 6: Create answer and set local description
    const answerDesc = await pc.createAnswer();
    await pc.setLocalDescription(answerDesc);

    const answer = {
        type: answerDesc.type,
        sdp: answerDesc.sdp,
    };

    await callDoc.update({ answer });

    // Step 7: Listen for caller's ICE candidates
    offerCandidates.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });

    return pc;
};
