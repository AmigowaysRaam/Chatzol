import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../resources/dimensions";
import { useSelector } from "react-redux";
import { getStickerArray, sendCommunityMessage, getListCommunityMessages } from "../redux/authActions";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useWallpaper } from "../context/WallpaperContext";
import { Modal } from "react-native-paper";
import { sendMessage } from "@react-native-firebase/messaging";
import { COLORS } from "../resources/Colors";

const CommunitChat = () => {

  const navigation = useNavigation();
  const flatListRef = useRef(null); // Reference for FlatList

  const route = useRoute();
  const { communitydata } = route.params;
  // alert(JSON.stringify(communitydata._id))
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { wallpaper, changeWallpaper } = useWallpaper()
  const stickersArray = useSelector((state) => state.auth.stickersList);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);
  const groupMessageList = useSelector((state) =>
    state.auth?.getCommunityMessageList[`${communitydata._id}`] ||
    []
  );
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [message, chatMessages]); // This effect will run every time messages change


  const [isModalVisible, setIsModalVisible] = useState(false);


  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOpenDialogBox = () => {
    setIsModalVisible(true);
  }


  const handleSendSticker = (stickerUrl) => {

    if (stickerUrl) {
      const sendtStickerUrl = stickerUrl.value
      const newMessage = {
        id: new Date().getTime().toString(),
        text: sendtStickerUrl,
        stickerUrl: sendtStickerUrl,
        sender: "me",
        timestamp: new Date().toISOString(),
        position: "right",
        image: 1
      };

      // Add the sticker message to chat
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      // dispatch(sendMessage(userId, username, stickerUrl.key)); // Sending an empty text and sticker URL
      closeModal()
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(getListCommunityMessages(userId, communitydata._id));
      dispatch(getStickerArray(userId));
    }
  }, [userId, communitydata]);



  useEffect(() => {
    console.log(JSON.stringify(groupMessageList))
    if (groupMessageList && groupMessageList.length) {
      const formattedMessages = groupMessageList
        .map((item) => {
          if (item.message?.length > 0) {
            return {
              id: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
              text: item.message,
              position: item.position,
              username: item.username,
              userimage: item.userimage,
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
              username: item.username,
              userimage: item.userimage,
              timestamp: moment(item.createddatetime, "MMMM DD, YYYY h:mm A")
                .toDate()
                .toISOString(),
            };
          }
          return null;
        })
        .filter(Boolean);
      setChatMessages(formattedMessages);
    }
  }, [groupMessageList]);

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

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket('ws://your-websocket-url');
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      const newMessage = {
        id: incomingMessage.id,
        text: incomingMessage.text,
        sender: "other",
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);


  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: new Date().getTime().toString(),
        text: message,
        sender: "me",
        timestamp: new Date().toISOString(),
        position: "right", // Set the position for sent messages
      };
      // Update chat messages to include the new message at the end
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      // Clear the input field
      setMessage("");
      // Send message via WebSocket
      socket.send(JSON.stringify(newMessage));
      dispatch(sendCommunityMessage(userId, communitydata._id, message));
      dispatch(getListCommunityMessages(userId, communitydata._id));
    }
  };
  // handleNaviagteGroupDetails
  const handleNaviagteGroupDetails = () => {
    navigation.navigate("CommunityDetails", { communitydata });
  };

  const renderMessage = ({ item }) => (
    <View
      style={
        item.position === "right"
          ? styles.myMessageContainer
          : styles.otherMessageContainer
      }
    >
      <View
        style={item.position === "right" ? styles.myMessage : styles.otherMessage}
      >
        {
          item.position !== "right" ? (
            <View style={styles.userInfo}>
              {/* Profile picture with the user's image */}
              <Image source={item.userimage ? { uri: item.userimage } : ""} style={styles.profilePic} />
              {/* User's name with the default styling */}
              <Text style={styles.userName}>{item.username}</Text>
            </View>
          )
            :
            <View style={styles.userInfo}>
              {/* Profile picture with the user's image */}
              <Image source={item.userimage ? { uri: item.userimage } : ""} style={styles.profilePic} />
              {/* User's name with white color overriding default styling */}
              <Text style={[styles.userName, { color: "#fff" }]}>{item.username}</Text>
            </View>
        }

        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={wallpaper ? { uri: wallpaper } : ""}
      style={styles.imageBackground}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, {
          backgroundColor: wallpaper === null && "#FFF",
        }]}>
          <LinearGradient
            colors={["#F0F0F0", "#FFF"]}
            style={styles.headContainer}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconContainer}
            >
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileContainer}
              onPress={() => handleNaviagteGroupDetails()}>
              <Image
                source={communitydata?.image ? {
                  uri: communitydata?.image,
                } : ""}
                style={styles.profileImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{communitydata?.name}</Text>
                <Text style={styles.about}>Groups</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <FlatList
            ref={flatListRef}
            // data={[...chatMessages].sort((a, b) => {
            //   const aDate = new Date(a.timestamp);
            //   const bDate = new Date(b.timestamp);
            //   return aDate - bDate;
            // })}
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            contentContainerStyle={[styles.messagesContainer, { flexGrow: 1 }]}
            keyboardShouldPersistTaps="handled"
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.noContainer}>
              {/* <TouchableOpacity
                onPress={() => handleOpenDialogBox()} style={{ backgroundColor: "green", borderRadius: wp(10), height: wp(8), width: wp(8) }}>
                <MaterialIcons name="emoji-emotions" size={26} style={[styles.noIcon, { position: "relative", top: 3, right: 1 }]} color={"#fff"} />
              </TouchableOpacity> */}
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type Your message" />
              <TouchableOpacity onPress={handleSend}>
                <MaterialIcons name="telegram" size={32} style={[styles.noIcon,]} color={COLORS.button_bg_color} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          {/* Modal Box */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* Close Button at the Top-Right */}
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Icon name="close" size={30} color="#fff" />
                </TouchableOpacity>
                <FlatList
                  data={stickersArray}
                  keyExtractor={(item) => item.value}
                  numColumns={3}
                  contentContainerStyle={styles.stickerList}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSendSticker(item)} style={styles.stickerItem}>
                      <Image source={{ uri: item.value }} style={[styles.stickerImage, {
                        width: wp(25), // Size of each sticker
                        height: wp(25),
                        resizeMode: 'contain',
                      }]} />
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  noContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: wp(1),
    marginBottom: wp(2),
    backgroundColor: "#fff",
    borderRadius: wp(5),
    paddingHorizontal: 10,
    width: wp(90),
    borderColor: "#838383",
    borderWidth: wp(0.5)

  },

  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    height: hp(100),
  },

  closeButton: {
    position: 'absolute', // Absolutely position the button inside the modalContent
    top: 10, // 10px from the top
    right: 10, // 10px from the right
    zIndex: 1, // Ensure it's above other elements if needed
  },
  stickerList: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(7),
    margin: wp(6),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 30, // Adjust size as needed
    height: 30,
    borderRadius: 15, // Make the image circular
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14, // Adjust size as needed
  },
  stickerItem: {
    alignItems: 'center',
    paddingBottom: wp(5),
    margin: wp(1)
  },
  stickerImage: {
    width: wp(40), // Size of each sticker
    height: wp(40),
    resizeMode: 'contain',
  },
  noIcon: {
    // backgroundColor: "rgb(8, 134, 4)",
    borderRadius: wp(4),
    marginHorizontal: 5,
  },

  container: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: wp(5),
    // backgroundColor: "red", maxHeight: hp(90)
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  iconContainer: {
    marginRight: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {

    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginHorizontal: wp(1),
    borderWidth: wp(0.5),
    borderColor: COLORS.button_bg_color
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: 'absolute',
    bottom: 10, // Distance from the bottom
    left: 20, // Distance from the left
    right: 20, // Distance from the right
    backgroundColor: '#555555',
    borderRadius: 10,
    alignItems: 'center',
    width: wp(90),
    height: wp(75),
    borderWidth: 2,
    borderColor: "#888888",
    padding: wp(1)
  },

  modalText: {
    fontSize: 18,
    marginBottom: wp(5),
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  about: {
    fontSize: 14,
    color: "#000",
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
    backgroundColor: COLORS.button_bg_color,
    borderRadius: 10,
    padding: wp(3),
    maxWidth: wp(80),
  },
  otherMessage: {
    backgroundColor: "#f1f0f0",
    borderRadius: 10,
    padding: wp(3),
    maxWidth: wp(80),
  },
  messageText: {
    fontSize: 16,
    color: "#fff"
  },

  timestamp: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: wp(2),
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 10,
  },
});

export default CommunitChat;
