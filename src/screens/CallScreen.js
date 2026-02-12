import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { hp, wp } from '../resources/dimensions';
import firestore from '@react-native-firebase/firestore';
import InCallManager from 'react-native-incall-manager';
import { Louis_George_Cafe } from '../resources/fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { userEndCallApi } from '../redux/authActions';

const CallScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { callId, username, userProfileImage, apiCallId } = route.params;
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [isCallAnswered, setIsCallAnswered] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const callTimerRef = useRef(null);
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleSpeaker = () => {
        const newSpeakerState = !isSpeakerOn;
        setIsSpeakerOn(newSpeakerState);
        InCallManager.setForceSpeakerphoneOn(newSpeakerState);
    };

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('calls')
            .doc(callId)
            .onSnapshot(snapshot => {
                const data = snapshot.data();
                // Assume call is considered "answered" once both streams are active or peerConnection is ready
                if (!isCallAnswered && data?.answer) {
                    setIsCallAnswered(true);
                    startCallTimer();
                }

                if (data?.callEnded) {
                    ToastAndroid.show('Call Declined', ToastAndroid.SHORT);
                    endCall(true); // Clean up
                }
            });
        return () => unsubscribe();
    }, [callId]);

    const startCallTimer = () => {
        if (!callTimerRef.current) {
            callTimerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
    };

    useEffect(() => {
        const callTimeoutRef = setTimeout(() => {
            if (!isCallAnswered) {
                ToastAndroid.show('Call not answered. Disconnecting…', ToastAndroid.SHORT);
                endCall(true); // true to indicate it's remote-triggered (no update to Firestore)
            }
        }, 30000); // 30 seconds

        const unsubscribe = firestore()
            .collection('calls')
            .doc(callId)
            .onSnapshot(snapshot => {
                const data = snapshot.data();
                if (!isCallAnswered && data?.answer) {
                    setIsCallAnswered(true);
                    startCallTimer();
                    clearTimeout(callTimeoutRef); // ✅ Clear if answered
                }
                if (data?.callEnded) {
                    ToastAndroid.show('Call Ended by the other party', ToastAndroid.SHORT);
                    clearTimeout(callTimeoutRef); // ✅ Prevent disconnect on end
                    endCall(true);
                }
            });
        return () => {
            unsubscribe();
            clearTimeout(callTimeoutRef); // ✅ Cleanup
        };
    }, [callId]);

    const formatDuration = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const endCall = async (remoteEnded = false) => {
        const endCallPayload = {
            userid: userId,
            callid: apiCallId,
        };

        try {
            // Notify backend that the user ended the call
            dispatch(userEndCallApi(endCallPayload, (response) => {
                if (!response.success) {
                    console.warn('Failed to notify backend of call end');
                }
            }));

            // Stop any ongoing ringtone
            InCallManager.stopRingtone();

            // Stop call timer
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current);
                callTimerRef.current = null;
            }

            // Close peer connection
            if (peerConnection) {
                peerConnection.close();
                setPeerConnection(null);
            }

            // Stop local media tracks
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
                setLocalStream(null);
            }

            // Stop remote media tracks
            if (remoteStream) {
                remoteStream.getTracks().forEach((track) => track.stop());
                setRemoteStream(null);
            }
            // Update Firestore only if the call was not already ended by the remote user
            if (!remoteEnded) {
                await firestore().collection('calls').doc(callId).update({
                    callEnded: true,
                    status: 'declined',
                });
            }

            // Show toast and navigate back
            ToastAndroid.show('Call Ended', ToastAndroid.SHORT);
            navigation.goBack();

        } catch (error) {
            console.error('Error ending call:', error);
            ToastAndroid.show('Error ending call', ToastAndroid.SHORT);
        }
    };

    return (
        <ImageBackground
            source={{}}
            style={styles.container}
        >
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: userProfileImage }}
                    style={styles.avatar}
                />
                <Text style={[Louis_George_Cafe.regular.h4, { color: "#FFF", textTransform: "capitalize", marginVertical: wp(6) }]}>
                    {username}
                </Text>

                {!isCallAnswered ? (
                    <Text style={[Louis_George_Cafe.regular.h6, { color: "#FFF", textTransform: "capitalize" }]}>Calling…</Text>
                ) : (
                    <Text style={[Louis_George_Cafe.bold.h6, { color: "#FFF", marginTop: hp(1) }]}>
                        {formatDuration(callDuration)}
                    </Text>
                )}
            </View>

            <View style={styles.controlsContainer}>
                {isCallAnswered ? (
                    <>
                        <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                            <Icon name={isMuted ? 'mic-off' : 'mic'} size={wp(7)} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={endCall} style={styles.endCallButton}>
                            <Icon name="call" size={wp(9)} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleSpeaker} style={styles.controlButton}>
                            <Icon
                                name={isSpeakerOn ? 'volume-high' : 'volume-mute'}
                                size={wp(7)}
                                color="white"
                            />
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity onPress={endCall} style={styles.endCallButton}>
                        <MaterialCommunityIcons name={"phone-hangup"} size={28} color={"#FFF"} />
                    </TouchableOpacity>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('8%'),
        backgroundColor: '#a020cb',
    },
    profileContainer: {
        alignItems: 'center',
    },
    avatar: {
        width: wp('30%'),
        height: wp('30%'),
        borderRadius: wp('15%'),
        marginBottom: hp('2%'),
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('10%'),
    },
    controlButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: wp('5%'),
        borderRadius: wp('12%'),
    },
    endCallButton: {
        backgroundColor: 'red',
        padding: wp('5%'),
        borderRadius: wp('12%'),
    },
});

export default CallScreen;
