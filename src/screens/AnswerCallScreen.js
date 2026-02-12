import { MaterialCommunityIcons } from "@expo/vector-icons";
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import { useDispatch, useSelector } from 'react-redux';
import { userAnswerCallApi, userEndCallApi } from '../redux/authActions';
import { hp, wp } from '../resources/dimensions';
import { Louis_George_Cafe } from '../resources/fonts';
import { answerCall as answerCallService } from '../services/webrtc';
const AnswerCallScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { callId, profileName, callerPic,callApiId } = route.params;
    const userId = useSelector((state) => state.auth.user?._id);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [isCallAnswered, setIsCallAnswered] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const callTimerRef = useRef(null);
    const unsubscribeRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        unsubscribeRef.current = firestore()
            .collection('calls')
            .doc(callId)
            .onSnapshot(snapshot => {
                const data = snapshot.data();
                if (!data) return;
                if ((data.status === 'declined' || data?.callEnded) && !isCallAnswered) {
                    ToastAndroid.show('Call was declined or ended by the other user', ToastAndroid.SHORT);
                    navigation.goBack();
                }
            });

        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current();
        };
    }, [callId, isCallAnswered]);

    const handleAnswerCall = async () => {
        try {
          // Stop any incoming ringtone
          InCallManager.stopRingtone();
          // Start call audio and enable speakerphone
          InCallManager.start({ media: 'audio' });
          InCallManager.setForceSpeakerphoneOn(true);
          setIsSpeakerOn(true);
      
          // Notify backend that the call has been answered
          const answerCallPayload = {
            userid: userId,
            callid: callApiId,
            // status: 'answered',
          };
      
          dispatch(userAnswerCallApi(answerCallPayload, (response) => {
            if (!response.success) {
              console.warn('Failed to notify backend that call was answered');
            }
            else{
                // alert(JSON.stringify(response))
            }
          }));
      
          // Set up peer connection and media streams
          const pc = await answerCallService(callId, setLocalStream, setRemoteStream);
          setPeerConnection(pc);
          setIsCallAnswered(true);
      
          // Start call duration timer
          callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
          }, 1000);
      
        } catch (err) {
          ToastAndroid.show('Error answering call', ToastAndroid.SHORT);
          console.error('Answer Call Error:', err);
        }
      };
      

    const toggleSpeaker = () => {
        const newState = !isSpeakerOn;
        setIsSpeakerOn(newState);
        InCallManager.setForceSpeakerphoneOn(newState);
    };

    const toggleMic = () => {
        const newState = !isMicOn;
        setIsMicOn(newState);
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = newState;
            });
        }
    };

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const endCall = async () => {
        InCallManager.stopRingtone();
        try {
          // Notify backend that user ended the call
          const endCallPayload = {
            userid: userId,
            callid: callApiId,
          };
          dispatch(userEndCallApi(endCallPayload, (response) => {
            if (!response.success) {
              console.warn('Failed to notify backend of call end');
            }
          }));
      
          // Clean up media connections
          peerConnection?.close();
          setPeerConnection(null);
      
          localStream?.getTracks().forEach(track => track.stop());
          setLocalStream(null);
      
          remoteStream?.getTracks().forEach(track => track.stop());
          setRemoteStream(null);
      
          // Update Firestore
          await firestore().collection('calls').doc(callId).update({ callEnded: true });
          // Stop timer
          if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
          }
      
          // Notify user and navigate back
          ToastAndroid.show('Call Ended', ToastAndroid.SHORT);
      
        } catch (err) {
          console.warn('Error ending call:', err);
          ToastAndroid.show('Error ending call', ToastAndroid.SHORT);
        }
      
        // Final cleanup
        InCallManager.stop();
        navigation.goBack();
      };
      

    return (
        <View style={styles.container}>
            <Text numberOfLines={1} style={[
                Louis_George_Cafe.bold.h4,
                styles.title,
                { textTransform: "capitalize", marginHorizontal: hp(5) }
            ]}>
                {profileName}
            </Text>

            <Text style={{
                color: '#fff',
                fontSize: wp(4),
                position: "absolute", top: hp(20)
            }}>
                {isCallAnswered ? `Call in progress` : `Incoming Call`}
            </Text>
            {isCallAnswered && (
                <Text style={styles.callDuration}>
                    {formatDuration(callDuration)}
                </Text>
            )}
            <View>
                <Image
                    resizeMode="contain"
                    source={callerPic ? { uri: callerPic } : require('../../src/assets/animations/user-at-phone.png')}
                    style={{
                        width: hp(60),
                        height: hp(45),
                        backgroundColor: "#a020cb",
                        opacity: 1
                    }}
                />

            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={endCall} style={styles.endCallButton}>
                    <MaterialCommunityIcons name={"phone-hangup"} size={28} color={"#FFF"} />
                </TouchableOpacity>

                {!isCallAnswered ? (
                    <TouchableOpacity onPress={handleAnswerCall} style={styles.answerCall}>
                        <MaterialCommunityIcons name={"phone"} size={28} color={"#FFF"} />
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity onPress={toggleSpeaker} style={styles.controlButton}>
                            <MaterialCommunityIcons
                                name={!isSpeakerOn ? "volume-high" : "volume-variant-off"}
                                size={28}
                                color={"#FFF"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleMic} style={styles.controlButton}>
                            <MaterialCommunityIcons
                                name={isMicOn ? "microphone" : "microphone-off"}
                                size={28}
                                color={"#FFF"}
                            />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a020cb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    callDuration: {
        color: '#FFF',
        fontSize: 18,
        marginTop: 10,
    },

    title: {
        color: '#fff',
        fontSize: 24,
        position: "absolute",
        top: hp(15)
    },

    controls: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-around",
        alignItems: 'center',
        gap: wp(4),
        width: wp(100),
        position: 'absolute',
        bottom: hp(10),
    },

    endCallButton: {
        backgroundColor: 'red',
        padding: wp(5),
        borderRadius: 50,
        margin: 2,
    },
    answerCall: {
        backgroundColor: 'green',
        padding: wp(5),
        borderRadius: 50,
        margin: 2,
    },
    controlButton: {
        backgroundColor: '#555',
        padding: 15,
        borderRadius: 10,
        margin: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AnswerCallScreen;
