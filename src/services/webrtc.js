import firestore from '@react-native-firebase/firestore';
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream
} from 'react-native-webrtc';

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const makeCall = async (targetUserId, firstname, propic,callId) => {

  
  const pc = new RTCPeerConnection(configuration);
  const localStream = await mediaDevices.getUserMedia({ audio: true, video: false });

  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  const callDoc = firestore().collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  pc.onicecandidate = event => {
    if (event.candidate) offerCandidates.add(event.candidate.toJSON());
  };

  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offer = {
    type: offerDescription.type,
    sdp: offerDescription.sdp,
  };

  await callDoc.set({
    offer,
    targetUserId,
    callEnded: false,
    callerName: firstname,
    callerPic: propic, status: "",
    apiCallId:callId,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  callDoc.onSnapshot(snapshot => {
    const data = snapshot.data();
    if (data?.answer && !pc.currentRemoteDescription) {
      pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  });

  answerCandidates.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });

  return { callId: callDoc.id, peerConnection: pc, localStream };
};

export const answerCall = async (callId, setLocalStream, setRemoteStream) => {
  const pc = new RTCPeerConnection(configuration);
  const localStream = await mediaDevices.getUserMedia({ audio: true });

  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  setLocalStream(localStream);

  const callDoc = firestore().collection('calls').doc(callId);
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  pc.onicecandidate = event => {
    if (event.candidate) answerCandidates.add(event.candidate.toJSON());
  };

  const remoteStream = new MediaStream();
  pc.ontrack = event => {
    const [stream] = event.streams;
    if (stream) {
      setRemoteStream(stream);
      if (stream.getAudioTracks().length > 0) {
        console.log('✅ Remote audio track received.');
      } else {
        console.warn('⚠️ Remote stream received but no audio tracks found.');
      }
    }
  };

  const callData = (await callDoc.get()).data();
  if (!callData?.offer) throw new Error('Offer not found');

  await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await callDoc.update({ answer });

  offerCandidates.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
      }
    });
  });

  return pc;
};
