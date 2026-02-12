import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, Image, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback,
  Keyboard, Modal, ImageBackground,
  Alert, ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../resources/dimensions";
import { Avatar, Checkbox } from 'react-native-paper';
import { useSelector, useDispatch } from "react-redux";
import { deleteMessages, fnForwardMessageCallApi, getConnectivity, getListConversation, getListMessages, getSearchUser, getSiteSettings, getStickerArray, reactMessageApi, startCallApi, startMessageApi, updateUserStatus } from "../redux/authActions";
import { sendMessage } from "../redux/authActions";
import moment from "moment";
import { useWallpaper } from "../context/WallpaperContext";
import { Louis_George_Cafe } from "../resources/fonts";
import { COLORS } from "../resources/Colors";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ImageCropPicker from "react-native-image-crop-picker";
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { makeCall } from '../services/webrtc';


const audioRecorderPlayer = new AudioRecorderPlayer();

const ChatScreen = () => {

  const navigation = useNavigation();
  const profile = useSelector((state) => state.auth.profile);

  const route = useRoute();
  const { username, firstname, touserId, userProfileImage, muted } = route.params;
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);  // State for pull-to-refresh
  const [isLoading, setisLoading] = useState(true);
  const { wallpaper } = useWallpaper()

  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [isUserModalVisible, setuserIsModalVisible] = useState(false); // State for modal visibility
  const [userConnectStatus, userStatus] = useState('');
  const [allowMessage, setAllowMessage] = useState(0);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [messageSelected, setMessageSelected] = useState(null);
  const [messageSelectedArr, setMessageSelectedArr] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [imgUrlu, setImageUrl] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });


  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);
  const luserName = useSelector((state) => state.auth.user.username);
  const messageList = useSelector(
    (state) => state.auth.messageList[`${username}`]
  );
  const [layout, setLayout] = useState(null);
  const flatListRef = useRef(); // Reference for FlatList
  const [wsMessage, setWsMessage] = useState('');  // WebSocket message state

  const onFocusHandler = () => {
    dispatch(updateUserStatus(userId, "online"));
  };

  const onBlurHandler = () => {
    // console.log("Component is unfocused");
    dispatch(updateUserStatus(userId, "offline"));
  };

  useFocusEffect(
    React.useCallback(() => {
      // Component is focused
      onFocusHandler();
      // Cleanup function when unfocused
      return () => {
        // Component is unfocused
        onBlurHandler();
      };
    }, [])
  );

  // Fetch messages when component mounts
  useEffect(() => {
    if (userId) {
      dispatch(getListMessages(userId, username));
      dispatch(
        getListMessages(userId, username, (response) => {
          const group = response.data;
          setAllowMessage(response.allow_send_message)
          // console.log(response.allow_send_message, 'group')
        })
      );
      dispatch(getStickerArray(userId));
      dispatch(getSiteSettings(userId));

      dispatch(
        getConnectivity(touserId, (response) => {
          if (response.success) {
            // alert(JSON.stringify(response))
            userStatus(response.data.connectivity)
          }
        })
      );
    }
  }, [userId]);

  // When the message list changes, format it and set it to chatMessages
  useEffect(() => {

    setisLoading(true)
    if (messageList && messageList.length) {

      const formattedMessages = messageList
        .map((item, index) => {
          if (item.message?.length > 0) {
            return {
              id: index,
              messageid: item.messageid,
              reaction: item.reaction,
              text: item.message,
              position: item.position,
              starred: item.starred,
              forwarded: item?.forwarded,
              image: item.image,
              sender: "me",
              timestamp: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
            };
          } else if (item.receivedmessage) {
            return {
              id: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
              text: item.receivedmessage,
              sender: "other",
              image: item.image,
              timestamp: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
            };
          }
          return null;
        })
        .filter(Boolean);
      setChatMessages(formattedMessages);
      setisLoading(false)
    }
    else {
      setChatMessages([]);
      setisLoading(false)
    }
  }, [messageList]);

  const handleOnPressItem = (item) => {
    setSelectedStatus(item);
    setShowModal(!showModal);
  };

  const onGestureEvent = (event) => {
    const { translationY } = event.nativeEvent;
    // If the swipe down exceeds a threshold, close the modal
    if (translationY > 80) {
      // setModalVisible(false);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [apiCallId, setapiCallId] = useState('');


  useEffect(() => {
    if (messageList && messageList?.length === 0) {
      setChatMessages([]);
    }
  }, [messageList]);
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);  // Track the current page
  const [hasMore, setHasMore] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [audioFile, setAudioFile] = useState('');
  const [storedAudioFiles, setStoredAudioFiles] = useState([]); // To store list of recorded files
  const [imageUri, setImageUri] = useState(null);


  const toggleSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  useEffect(() => {

    if (!searchTerm) return;
    const lettersOnly = searchTerm.replace(/[^a-zA-Z]/g, '');
    // setLetterCount(lettersOnly.length);
    // alert(searchTerm);
    if (lettersOnly.length >= 3) {
      dispatch(getSearchUser(userId, searchTerm, 1, '', (response) => {
        if (response.success) {
          const flag = response?.data
          setUsers(flag);
        }
      })
      );
    }
    else {
      // setIsLoading(false)
      // setusersList([]);

    }
  }, [searchTerm]);


  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);

    const isToday = now.toDateString() === messageDate.toDateString();

    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      messageDate.toDateString();

    if (isToday) {
      return (
        "Today " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else if (isYesterday) {
      return (
        "Yesterday " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return (
        messageDate.toLocaleDateString() +
        " " +
        messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };
  const [imageSelected, setSelectedPic] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getListMessages(userId, username));
    }, 1000);
    return () => clearInterval(intervalId); // Make sure to clear the interval on cleanup
  }, [userId, username]); // Now this `useEffect` will run only when `userId` or `username` changes.


  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: new Date().getTime().toString(),
        text: message,
        sender: "me",
        timestamp: new Date().toISOString(),
        position: "right",
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      dispatch(sendMessage(userId, username, message));
      dispatch(getListConversation(userId));
      var data = {
        userId: userId, msg: message, receiver_userid: touserId
      };
      // socket.send(JSON.stringify(data));
      if (flatListRef) {
        flatListRef?.current.scrollToEnd({ animated: true });
      }
    }
  };

  const onHandlerStateChange = (event) => {
    const { state, translationY, velocityY } = event.nativeEvent;
    // Handle the state change event: if the gesture is completed, check if we reached the threshold
    // if (state === 5) { // 5 means gesture has ended
    if (translationY > 50 || velocityY > 5) { // A swipe up threshold (adjust as necessary)
      setShowModal(false); // Close the modal if swipe is large enough
      // }
    }
  };


  useEffect(() => {
    // alert(userId)

    if (flatListRef) {
      // console.log((flatListRef))
      flatListRef?.current.scrollToEnd({ animated: true });
    }
  }, [userId])


  // Pull-to-refresh handler
  const onRefresh = () => {

    setRefreshing(true);
    dispatch(getListMessages(userId, username));
    dispatch(getListConversation(userId));
    setRefreshing(false);
  };

  const closeModal = () => {

    setIsModalVisible(false);

  };

  const handleOpenDialogBox = () => {
    setIsModalVisible(true);
  }
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          // console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          ImageCropPicker.openCropper({
            path: response.assets[0].uri,
            width: 800,
            height: 1200,
          }).then((image) => {
            setImageUri(image?.path);
            handleCreateStory(image?.path);
            // alert(image?.path)

          });
        }
      }
    );
  };

  const handleCreateStory = async (image) => {

    // const userId = "user123";
    const apiUrl = "https://chatzol.scriptzol.in/api/?url=app-send-message";
    if (!image) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    const formData = new FormData();

    formData.append("userid", userId);
    formData.append("message", "image");
    formData.append("tousername", username);

    const imageData = {
      uri: image,
      type: "image/jpeg",
      name: "story-image.jpg",
    };

    formData.append("image", imageData);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      // console.log(response,"result")
      const result = await response.json();
      if (result.success) {
        console.log(result, "result")
        console.log("Success", "Message Sent to Group successfully.");
        onRefresh();
        setImageUri(null);
        // setCaption("");
        // navigation.goBack();
        if (flatListRef) {
          // console.log((flatListRef))
          flatListRef?.current.scrollToEnd({ animated: true });
        }
      } else {
        // Alert.alert("Error", "Failed to upload story. Please try again.");
      }
    } catch (error) {
      console.log("Error uploading story:", error);
      // Alert.alert("Error", "Failed to upload story. Please try again.");
    }
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          ImageCropPicker.openCropper({
            path: response.assets[0].uri,
            width: 300,
            height: 400,
          }).then((image) => {
            setImageUri(image.path);
          });
        }
      }
    );
  };

  const handleOpenImage = (uril) => {
    setImageUrl(uril)
    setShowModal(true)
  }


  const renderMessage = ({ item, handleAlertDelete, handleShowEmoji, handleLayout, handleSelectMessages, handleOpenImage }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => messageSelectedArr.length !== 0 &&
            handleSelectMessages(item)
          }
          onLayout={handleLayout}
          onLongPress={() => handleSelectMessages(item)}
          style={{ backgroundColor: messageSelectedArr.includes(item.messageid) ? "#cf8fe5" : COLORS.black }}>
          <TouchableOpacity
            onPress={() => messageSelectedArr.length !== 0 &&
              handleSelectMessages(item)
            }
            onLayout={handleLayout}
            onLongPress={() => handleSelectMessages(item)}
            style={
              item.position === "right" || luserName === username
                ? styles.myMessageContainer
                : styles.otherMessageContainer
            }
          >

            <TouchableOpacity
              onLongPress={() => messageSelectedArr.length !== 0 ? handleSelectMessages(item) : item.position == "right" ? handleAlertDelete(item) : handleSelectMessages(item)}
              onPress={(e) => messageSelectedArr.length !== 0 ? handleSelectMessages(item) : item.position != "right" && handleShowEmoji(item, e)}
              style={
                item.position === "right" || luserName === username
                  ? !item.image && styles.myMessage
                  : !item.image && styles.otherMessage
              }
            >
              {
                item?.forwarded == '1' &&
                <View style={{ flexDirection: "row", position: "relative", top: wp(-2) }}>
                  <MaterialCommunityIcons name="share" size={20} color={"#ddd"} />
                  <Text
                    style={[Louis_George_Cafe.regular.h9, {
                      color: '#ddd',
                      fontStyle: 'italic'
                    }]}
                  >
                    Forwarded
                  </Text>
                </View>
              }
              {
                messageSelectedArr.length !== 0 && messageSelectedArr.includes(item.messageid) &&
                <MaterialIcons name={"check-circle"} size={22} style={[styles.nocon,]} color={item.position === "right" ? COLORS.black : COLORS.button_bg_color} />
              }

              {item?.image != '' ? (

                <View style={{
                  backgroundColor: COLORS.button_bg_color,
                  borderWidth: wp(0.4),
                  borderRadius: wp(2),
                  borderColor: COLORS.button_bg_color,
                }}>
                  <TouchableWithoutFeedback onLongPress={(e) => handleShowEmoji(item, e)} onPress={() => handleOpenImage(item?.image)}>
                    <Image
                      source={item?.image ? { uri: item?.image } : ""}
                      style={styles.stickerImage}
                    />
                  </TouchableWithoutFeedback>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: 'space-between'
                  }}>
                    <Text style={{ fontSize: wp(2), margin: wp(2), color: "#FFF" }}>
                      {formatTimestamp(item.timestamp)}
                    </Text>
                    {
                      item.position == 'right' &&
                      <Text style={{ position: "relative", top: wp(2), left: hp(0), color: "#000", fontSize: wp(1), marginHorizontal: wp(2) }}>
                        <MaterialIcons name={"check"} size={14} style={[styles.nocon,]} color={COLORS.black} />
                      </Text>
                    }
                  </View>
                </View>
              ) : (
                <>
                  <Text style={
                    [{
                      color:
                        item.position === "right" || luserName === username
                          ? "#FFF"
                          : "#000",
                    }, ImageBackground || luserName === username
                      ? styles.messageText
                      : styles.othermessageText]
                  }
                  >
                    {item?.text}
                  </Text>
                  {/* Timestamp */}
                  <View style={[{
                    flexDirection: "row"
                  }]}>
                    <Text
                      style={[
                        styles.timestamp,
                        // Louis_George_Cafe.regular.h9,
                        {
                          fontSize: wp(2),
                          color:
                            item.position === "right" || luserName === username
                              ? "#FFF"
                              : "#000",
                        },
                      ]}
                    >
                      {formatTimestamp(item.timestamp)}
                    </Text>
                    {
                      item.position == "right" &&
                      <Text style={{ position: "relative", top: wp(2), left: wp(2), color: "#FFF" }}>
                        <MaterialIcons name={"check"} size={12} style={[styles.nocon,]} color={item.position === "right" ?? COLORS.black} />
                      </Text>
                    }

                    {
                      item?.starred == "1" &&
                      <MaterialCommunityIcons name={"star"} size={14} style={[{
                        marginTop: wp(1.5),
                        marginLeft: wp(2),
                        justifyContent: 'flex-end',
                      }]} color={item.position === "right" ? COLORS.black : "#777"} />
                    }
                  </View>
                </>
              )}
              {
                item.position !== "right" &&
                item.reaction !== ""
                &&
                //  item?.text == 'Hii' &&
                <View style={{ alignSelf: "flex-end", position: "absolute", left: wp(0), top: hp(6), marginVertical: wp(1), backgroundColor: "#a8a8a8", borderRadius: wp(3), padding: wp(0.5) }}>
                  <Text style={{ fontSize: wp(2.5) }}>{item?.reaction}</Text>
                </View>
              }
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity >
      </>
    );
  };

  const handleAlertDelete = (item) => {
    // Show confirmation alert
    Alert.alert(
      "Are you sure?",
      "Do you want to delete this message?",
      [
        {
          text: "No", // No button
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes", // Yes button
          onPress: () => fnHandleDeleteMessage(item),
        },
      ],
      { cancelable: false } // Prevent closing the alert by clicking outside
    );
  };



  function fnHandleDeleteMessage(item) {
    // alert(JSON.stringify(item))

    dispatch(
      deleteMessages(userId, item.messageid, (response) => {
        console.log(response.message, 'deleteMessage')
        Toast.show({
          text1: response.message,
          type: 'success',
          position: 'top',
        });
        dispatch(getListMessages(userId, username));
        // dispatch(getListConversation(userId));
      })
    );
  }

  //  useEffect(() => {
  //     Toast.show({
  //       text1: "Error",
  //       type: 'success', // 'success' will make it green by default, but you can override styles
  //       position: 'top',
  //       visibilityTime: 82000, // Duration for how long the toast is visible
  //       props: {
  //         // Custom props for styling
  //         style: {
  //           backgroundColor: 'green', // Set custom background color to green
  //         },
  //         text1Style: {
  //           color: 'white', // Set text color to white for better contrast
  //         }
  //       },
  //     });
  //   }, []);

  // 

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAudioPermission(); // Request permission for Android
    }
  }, []);

  // Request permission to record audio on Android
  const requestAudioPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission Denied', 'You need to allow the microphone permission');
    }
  };

  // Start Recording
  const startRecording = async () => {

    if (!isRecording) {
      const path = `${RNFS.DocumentDirectoryPath}/Aud_${new Date().getTime()}.mp4`; // Unique filename based on timestamp
      try {
        await audioRecorderPlayer.startRecorder(path);
        audioRecorderPlayer.addRecordBackListener((e) => {
          setRecordingTime(audioRecorderPlayer.mmssss(e.current_position));
        });

        setIsRecording(true);
        setAudioFile(path); // Store the path of the audio file
      } catch (error) {
        console.error("Error starting recorder: ", error);
        Alert.alert('Error', JSON.stringify(error));
      }
    }
    else {
      stopRecording();
    }
  };

  // Stop Recording
  const stopRecording = async () => {
    if (isRecording) {
      try {
        await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false);
        // Store the audio file path in your stored files list for later access
        setStoredAudioFiles((prevFiles) => [...prevFiles, audioFile]);
        // Alert.alert('Recording Stopped', `Audio file saved at ${audioFile}`);
        ToastAndroid.show('Recording Stopped', ToastAndroid.SHORT);
      } catch (error) {
        console.error("Error stopping recorder: ", error);
        Alert.alert('Error', 'Failed to stop recording');
      }
    }
    else {
      startRecording();
    }
  };
  const emojiList = ['👍', '❤️', '😂', '😢', '😲'];

  const fnForwardMessage = () => {

    console.log(selectedUsers, "selectedUsers")
    console.log(messageSelectedArr, "selectedUsers")

    dispatch(
      fnForwardMessageCallApi(userId, selectedUsers, messageSelectedArr, (response) => {
        if (response.success) {
          console.log(response, "response")
          // userStatus(response.data.allow_send_message)
          onRefresh();
          setSearchTerm('')
          setuserIsModalVisible(false),
            setSelectedUsers([])
          setMessageSelectedArr([])
        }
      })
    );

  }

  const startPlaying = async () => {
    try {
      // Path to the audio file in your assets folder (this is just an example)
      const assetPath = require('../assets/test.mp3'); // Static path for testing

      // Create a path in the DocumentDirectoryPath to copy the file
      const destinationPath = `${RNFS.DocumentDirectoryPath}/test.mp3`;

      // Copy the file to the device's storage
      await RNFS.copyFile(assetPath, destinationPath);

      // Check if the file was copied successfully
      const fileExists = await RNFS.exists(destinationPath);
      if (!fileExists) {
        throw new Error('File does not exist at path: ' + destinationPath);
      }

      // Now you can play the copied file using the correct path
      console.log("Playing audio from path:", destinationPath);
      await audioRecorderPlayer.startPlayer(destinationPath);

      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position === e.duration) {
          audioRecorderPlayer.stopPlayer();
          Alert.alert('Playback Finished', 'Test audio has finished playing');
        }
      });
    } catch (error) {
      console.error("Error playing audio: ", error);
      Alert.alert('Error', 'Failed to start playing: ' + error.message);
    }
  };

  // Stop Playing
  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
    } catch (error) {
      console.error("Error stopping player: ", error);
      Alert.alert('Error', 'Failed to stop playing');
    }
  };
  // 

  const handleLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setLayout({ x, y, width, height });
  };

  const handleSelectMessages = (item) => {
    // Check if the messageId is already in the selected array
    if (messageSelectedArr.includes(item.messageid)) {
      // Remove the messageId if it already exists
      setMessageSelectedArr(messageSelectedArr.filter(id => id !== item.messageid));
    } else {
      // Add the messageId if it doesn't exist
      setMessageSelectedArr([...messageSelectedArr, item.messageid]);
    }
  };

  function handleShowEmoji(item, e) {
    // alert(item)
    const { pageX, pageY } = e.nativeEvent;
    setShowReactionModal(true);
    setMessageSelected(item)
    setModalPosition({ x: pageX, y: pageY });
  }

  const handleStarMessage = () => {
    // alert(JSON.stringify(messageSelectedArr))
    dispatch(
      startMessageApi(userId, messageSelectedArr, (response) => {
        // console.log(response.message, 'messageSelectedArr')
        dispatch(getListMessages(userId, username));
        setMessageSelectedArr([])
      })
    );
  }

  const handleEmojiSelect = (item, type) => {
    // alert(item);
    // alert(JSON.stringify(messageSelected?.messageid))
    let reactEmj = type != "remove" ? item : '';
    dispatch(
      reactMessageApi(userId, messageSelected.messageid, reactEmj, (response) => {
        dispatch(getListMessages(userId, username));
      })
    );
    setShowReactionModal(false);
    setMessageSelected(null);
  }

  const handleVoiceCall = async () => {
    let startCallPayload = {
      userid: userId,
      fromusername: luserName,
      tousername: username
    };

    try {
      dispatch(
        startCallApi(startCallPayload, async (response) => {  // Make this callback async
          if (response.success && response?.data?.callid !== '') {
            try {
              const { callId, peerConnection, localStream, } = await makeCall(
                username,
                luserName,
                profile.profilepicture, response?.data?.callid
              );
              navigation.navigate('CallScreen', {
                callId,
                peerConnection,
                localStream,
                username,
                userProfileImage, apiCallId: response?.data?.callid
              });
            } catch (error) {
              console.error('Error during makeCall:', error);
            }
          }
        })
      );
    } catch (error) {
      console.error('Error making the call:', error);
    }
  };



  return (
    <ImageBackground
      source={wallpaper ? { uri: wallpaper ? wallpaper : "" } : ""}
      style={styles.imageBackground}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {
          backgroundColor: wallpaper === null && COLORS.black,
        }]}>
          <LinearGradient
            colors={["#F0F0F0", "#FFF"]
            }
            style={{
              marginTop: wp(1), padding: wp(1), paddingTop: wp(2),
              paddingHorizontal: wp(1)
            }}
          >
            <View style={{
              flexDirection: "row", alignItems: "center",
            }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.iconContainer}
              >
                <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', width: wp(62) }}
                onPress={() => {
                  allowMessage == 1 &&
                    navigation.navigate("PublicProfile", {
                      userItem: {
                        image: userProfileImage,
                        fullname: firstname,
                        touserId: touserId,
                        userConnectStatus: userConnectStatus,
                        username: username,
                        muted

                      }
                    })
                }}
              >
                <Image
                  source={userProfileImage ? { uri: userProfileImage } : ""}
                  style={styles.profileImage}
                />
                <View style={styles.textContainer}>
                  <Text
                    numberOfLines={1}
                    style={styles.name}
                  >
                    {firstname}
                  </Text>
                  <Text style={styles.about}>
                    {userConnectStatus}
                  </Text>
                </View>
              </TouchableOpacity>
              {
                messageSelectedArr.length != 0 ?
                  <View style={{ flexDirection: "row", }}>
                    <TouchableOpacity
                      onPress={() => handleStarMessage()}
                      style={[{ margin: wp(2), marginHorizontal: wp(1) }]}
                    >
                      <MaterialIcons name="star-outline" size={28} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setuserIsModalVisible(!isUserModalVisible)}
                      style={[{ margin: wp(2), marginHorizontal: wp(1) }]}
                    >
                      <MaterialCommunityIcons name="share" size={28} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setMessageSelectedArr([])}
                      style={[{ margin: wp(2), marginHorizontal: wp(1) }]}
                    >
                      <MaterialIcons name="close" size={28} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                  :
                  <TouchableOpacity
                    onPress={() => handleVoiceCall()}
                    style={{ position: "absolute", right: hp(3) }}
                  >
                    <MaterialIcons name="call" size={wp(6)} color={COLORS.white} />
                  </TouchableOpacity>
              }

            </View>
            <View style={{ height: 1, backgroundColor: "#9999", marginTop: wp(1) }} />

          </LinearGradient>

          <FlatList
            ref={flatListRef}
            data={chatMessages}
            // renderItem={}
            renderItem={({ item }) => renderMessage({
              item, handleAlertDelete, handleShowEmoji, handleLayout,
              handleSelectMessages,
              handleOpenImage
            })}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
            onRefresh={onRefresh} // Trigger refresh when user pulls down
            refreshing={refreshing} // Show the loading indicator during refresh
          />

          <Toast zIndex={1} />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            {
              allowMessage == 1 &&
              <View style={{ flexDirection: "row", backgroundColor: "#F0F0F0", paddingTop: wp(2) }}>
                <View style={styles.noContainer}>
                  {
                    isRecording ?
                      <LottieView
                        speed={3}
                        source={require("../assets/animations/recording.json")}
                        style={{ width: wp(72), height: hp(4) }}
                        autoPlay
                        loop={true}
                      />
                      :
                      <TextInput
                        style={styles.textInput}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type Your Message" />
                  }


                  <TouchableOpacity onPress={openGallery}
                    style={{ borderRadius: wp(8) / 2, height: wp(8), width: wp(8), }}
                  >
                    <MaterialIcons name="attachment" size={30} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                  </TouchableOpacity>

                  {/* <TouchableOpacity onPress={openCamera}
                    style={{ borderRadius: wp(8) / 2, height: wp(8), width: wp(8), }}
                  >
                    <MaterialIcons name="camera-enhance" size={28} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                  </TouchableOpacity> */}
                </View>
                {
                  message == '' ?
                    <>
                      {/* <TouchableOpacity onPressIn={startRecording}
                        onPressOut={stopRecording}
                        style={{ borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1) }}
                      >
                        <MaterialIcons name={isRecording ? "stop-circle" : 'mic'} size={24} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                      </TouchableOpacity> */}

                      {
                        isRecording ?
                          <TouchableOpacity
                            onPress={() => stopRecording()}
                            style={{
                              borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1), marginBottom: wp(1),
                              marginHorizontal: wp(1.5)
                            }}
                          >
                            <MaterialIcons name={isRecording ? "stop-circle" : 'mic'} size={34} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={() => startRecording()}
                            style={{
                              borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1),
                              marginBottom: wp(1),
                              marginHorizontal: wp(1.5)
                            }}
                          >
                            <MaterialIcons name="mic" size={34} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                          </TouchableOpacity>
                      }
                    </>
                    :
                    <TouchableOpacity onPress={handleSend}
                      style={{ borderRadius: wp(9) / 2, height: wp(9), width: wp(9), margin: wp(1) }}
                    >
                      <MaterialIcons name="telegram" size={36} style={[styles.nocon,]} color={COLORS.button_bg_color} />
                    </TouchableOpacity>
                }
              </View>
            }
          </KeyboardAvoidingView>
          {/*  */}
          {/* UserList Modal */}
          <Modal
            visible={isUserModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={() => {
              setuserIsModalVisible(false)
              setSelectedUsers([])
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'row', width: wp(100) }}>
                  <TouchableOpacity onPress={() => {
                    setuserIsModalVisible(false),
                      setSelectedUsers([])
                  }} style={[{
                    margin: wp(2)
                  }]}>
                    <MaterialIcons name="arrow-back" size={30} color="#000" />
                  </TouchableOpacity>
                  <TextInput
                    style={[{
                      marginHorizontal: wp(1),
                      marginVertical: wp(1),
                      width: wp(85),
                      height: wp(10),
                      borderRadius: wp(2),
                      backgroundColor: COLORS.search_bg_color,
                      borderColor: COLORS.white,
                      borderWidth: wp(0.3),
                      paddingHorizontal: wp(2)
                    }]}
                    value={searchTerm}
                    // onChange={() => { setPage(1) }}
                    onChangeText={setSearchTerm}
                    placeholder="Search..."
                    placeholderTextColor={COLORS.white}
                    color={COLORS.white}
                  />
                </View>
                {/* Render a flat List with User Pic and user name with checkbox on Select */}
                {/* User List with Checkbox */}
                <FlatList
                  data={users}
                  onEndReached={() => {
                    if (!isLoading && hasMore) {
                      setPage(prevPage => prevPage + 1);
                    }
                  }}

                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() => {
                    <View style={{ marginVertical: hp(20) }}>
                    </View>
                  }}
                  ListEmptyComponent={() => {
                    <Text
                      style={[
                        styles.eadingName,
                        Louis_George_Cafe.bold.h7,
                        { color: COLORS.white, textAlign: "center" },
                      ]}
                    >
                      {"No Users Found"}
                    </Text>
                  }}
                  keyExtractor={(item) => item._id.toString()} // Use unique IDs directly
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleSelection(item._id)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: wp(1), width: wp(85) }}>
                        <Checkbox
                          color={COLORS.button_bg_color}
                          status={selectedUsers?.includes(item._id) ? 'checked' : 'unchecked'}
                        />
                        <Avatar.Image
                          size={48}
                          style={{ marginStart: wp(2) }}
                          source={{ uri: item.image }}
                        />
                        <View style={{ flexDirection: "column" }}>
                          <Text
                            style={[styles.headingName, Louis_George_Cafe.medium.h7, { color: COLORS.white, marginStart: wp(4) }]}
                          >
                            {item?.fullname}
                          </Text>
                          <Text
                            style={[styles.headingName, Louis_George_Cafe.medium.h8, { color: COLORS.white, marginStart: wp(4) }]}
                          >
                            {item?.username}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
                {selectedUsers.length != 0 &&
                  <TouchableOpacity
                    onPress={() => fnForwardMessage()}
                    style={{ backgroundColor: COLORS.button_bg_color, width: wp(80), height: wp(10), borderRadius: wp(5), alignItems: 'center', justifyContent: "center" }}>
                    <Text
                      style={[styles.headingName, Louis_George_Cafe.bold.h5, { color: COLORS.black, marginStart: wp(4) }]}
                    >
                      {'Forward'}
                    </Text>
                  </TouchableOpacity>}
              </View>
            </View>
          </Modal>

          {/*  */}

          {/* Modal Box */}
          <Modal
            visible={showReactionModal}
            transparent={true}
            animationType="none"
            onRequestClose={() => setShowReactionModal(!showReactionModal)}
          >
            <TouchableOpacity
              style={[{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }]}
              onPress={() => setShowReactionModal(false)} // Close modal when clicking outside
            >
              <View
                style={[
                  {
                    backgroundColor: '#FFF',
                    borderRadius: wp(10),
                    width: wp(66),
                    height: wp(13),
                    borderWidth: 2,
                    borderColor: "#666",
                    padding: wp(2),
                    top: modalPosition.y - 50,
                    marginHorizontal: wp(3)

                    // left: modalPosition.x - hp(1)
                  },
                ]}
              >
                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setShowReactionModal(false)}
                  style={{
                    position: 'absolute',
                    bottom: wp(9),
                    left: hp(28),
                    zIndex: 1,
                    marginHorizontal: wp(2)
                  }}
                >
                  <Icon name="close-circle" size={34} color="#FFF" />
                </TouchableOpacity>
                {/* Emoji List */}
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={emojiList.includes(messageSelected?.reaction) ? emojiList : [...emojiList, messageSelected?.reaction]}
                  keyExtractor={(item) => item}
                  horizontal={true}
                  style={{ paddingLeft: wp(2), flex: 1, marginHorizontal: wp(2) }}  // Adds padding to the left of the list
                  renderItem={({ item }) => (
                    <>
                      <TouchableOpacity
                        style={[{
                          backgroundColor: messageSelected?.reaction === item ? "#ddd" : "transparent",
                          borderRadius: wp(1),
                          marginRight: wp(2)
                        }]}
                        onPress={() => handleEmojiSelect(item, messageSelected?.reaction === item ? 'remove' : 'add')}
                      >
                        <Text style={styles.emoji}>{item}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
          {/* Modal for viewing status details */}
          <Modal
            visible={showModal}
            transparent={true}
            animationType="none"
          >

            <GestureHandlerRootView style={styles.modalContainer}>
              <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                <View style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 1)",
                }}>
                  <TouchableWithoutFeedback>
                    <View style={{
                      width: wp(90),
                      height: hp(90),
                      borderRadius: wp(4),
                      padding: wp(4),
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {/* <TouchableOpacity
                          // onPress={() => { setShowModal(false), setSelectedStatus(null) }}
                          style={styles.closeButton}
                        >
                          <MaterialIcons name="close" size={34} color={COLORS.black} />
                        </TouchableOpacity> */}
                      {imgUrlu && (
                        <View style={styles.modalBody}>
                          <Image
                            resizeMode='contain'
                            source={{ uri: imgUrlu }}
                            style={{
                              width: wp(90),
                              height: hp(80),
                              marginBottom: wp(4),
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </PanGestureHandler>
            </GestureHandlerRootView >
          </Modal>
        </View >
      </TouchableWithoutFeedback >
    </ImageBackground >

  );
};

const styles = StyleSheet.create({

  noContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: wp(1),
    borderRadius: wp(5),
    paddingHorizontal: 10,
    width: wp(86),

    borderColor: '#838383',
    borderWidth: wp(0.5),
    marginBottom: wp(2),
    marginVertical: wp(0.5)
  },
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    height: hp(100),
  },
  emoji: {
    fontSize: wp(4),
    marginBottom: wp(2),
    marginHorizontal: wp(1),
  },

  closeButton: {
    position: 'absolute', // Absolutely position the button inside the modalContent
    top: 8, // 10px from the top
    right: 10, // 10px from the right
    zIndex: 1,

  },
  stickerList: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(7),
    margin: wp(6),
  },

  stickerItem: {
    width: wp(40),
    height: wp(40),
    alignItems: 'center',
    margin: wp(1)
  },
  stickerImage: {
    width: wp(40),
    height: wp(40),
    resizeMode: 'contain',
    // borderWidth: wp(0.4),
    // borderRadius: wp(2),
    // borderColor: COLORS.button_bg_color
  },
  noIcon: {
    backgroundColor: "#a020cb",
    borderRadius: wp(4),
    marginHorizontal: 5,
  },

  messagesContainer: {
    paddingBottom: wp(10),
  },

  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(2),
  },

  iconContainer: {
    paddingHorizontal: wp(2)
  },

  profileContainer: {
    flexDirection: 'column',
    padding: wp(2),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',  // Ensures vertical alignment of items in the row
    justifyContent: 'space-between',  // Distributes space evenly between items
  },

  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10 / 2),  // Makes the profile image circular
    marginRight: wp(4),
    marginHorizontal: wp(4),
    borderColor: COLORS.button_bg_color,
    borderWidth: wp(0.3)
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    width: wp(45)
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: "capitalize"
  },
  about: {
    fontSize: 10,
    color: COLORS.white,

  },
  slamIcon: {
    width: wp(10),
    height: wp(10),
  },
  about: {
    fontSize: 14,
    color: COLORS.white,
  },

  myMessageContainer: {
    alignItems: "flex-end",
    margin: wp(2),
  },

  otherMessageContainer: {
    alignItems: "flex-start",
    margin: wp(2),
  },

  myMessage: {
    backgroundColor: "#a020cb",
    borderTopEndRadius: wp(2),
    borderTopLeftRadius: wp(2),
    borderBottomLeftRadius: wp(2),
    padding: wp(3),
    maxWidth: wp(80),
  },
  otherMessage: {
    backgroundColor: "#f1f0f0",
    borderTopEndRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    padding: wp(3),
    maxWidth: wp(80),
  },
  othermessageText: {
    fontSize: wp(3),
  },
  messageText: {
    fontSize: wp(3),
  },
  timestamp: {
    // fontSize: 12,
    marginTop: wp(2),
  },

  textInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: wp(2),
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    marginRight: wp(8),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  modalContent: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    padding: wp(1)
  },

  modalText: {
    fontSize: 18,
    marginBottom: wp(5),
  },

});

export default ChatScreen;
