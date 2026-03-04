import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { useDispatch, useSelector } from "react-redux";
import {
  blockUser,
  deleteeChatUsers,
  muteChatUsers,
  reportUser,
  getListMessages,startCallApi
} from "../../redux/authActions";
import Toast from "react-native-toast-message";

const PublicProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const { userItem,username } = route.params;
  const userId = useSelector((state) => state.auth.user?._id);
 const luserName = useSelector((state) => state.auth.user.username);
  const [loader, setLoader] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [mediaItems, setMediaItems] = useState([]);
  const [starredMessages, setStarredMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(userItem.muted == "1");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (userId && userItem?.username) {
      fetchChatData();

    }
  }, [userId]);

  const fetchChatData = () => {
    setLoadingMedia(true);

    dispatch(
      getListMessages(userId, userItem.username, (response) => {
        if (response?.data) {
          const onlyImages = response.data.filter(
            (item) => item.image && item.image !== ""
          );

          const onlyStarred = response.data.filter(
            (item) => item.starred === "1"
          );

          setMediaItems(onlyImages);
          setStarredMessages(onlyStarred);
        }
        setLoadingMedia(false);
      })
    );
  };

  const handleAction = (type) => {
    let title = "";
    let action;

    if (type === "block") {
      title = `Block ${userItem.fullname}?`;
      action = blockUser;
    } else if (type === "report") {
      title = `Report ${userItem.fullname}?`;
      action = reportUser;
    } else {
      title = `Delete chat with ${userItem.fullname}?`;
      action = deleteeChatUsers;
    }

    Alert.alert("Confirm", title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          setLoader(true);
          dispatch(
            action(userId, userItem.touserId, (response) => {
              Toast.show({
                text1: response.message,
                type: response.success ? "success" : "error",
              });

              if (response.success) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "HomeScreen" }],
                });
              }

              setLoader(false);
            })
          );
        },
      },
    ]);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);

    dispatch(
      muteChatUsers(userId, userItem.username, (response) => {
        Toast.show({
          text1: response.message,
          type: "success",
        });
      })
    );
  };
   

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
          </TouchableOpacity>

          <Text numberOfLines={1} style={styles.headerTitle}>
            {userItem.fullname}
          </Text>

          <View style={{ width: 28 }} />
        </LinearGradient>

        {/* PROFILE INFO */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri:userItem.image} }
            style={styles.profileImage}
          />

          <Text style={styles.profileName}>{userItem.fullname}</Text>

          <Text style={styles.statusText}>
            {userItem.status || "Hey there! I am using ChatZol!"}
          </Text>

          {/* ACTION BOX */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionItem} onPress={()=> handleVoiceCall()}>
              <Ionicons
                name="call-outline"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.actionLabel}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() =>
                navigation.navigate("ChatScreen", {
                  username: userItem.username,
                  userId: userItem.touserId,
                  firstname: userItem.fullname,
                  userProfileImage: userItem.image,
                })
              }
            >
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.actionLabel}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* MUTE */}
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.white}
            />
            <Text style={styles.optionText}>Mute</Text>
          </View>

          <Switch
            value={isMuted}
            onValueChange={handleMute}
            trackColor={{ true: COLORS.primary }}
            thumbColor={isMuted ? COLORS.button_bg_color : "#555"}
          />
        </View>

        {/* STARRED */}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() =>
            navigation.navigate("StarredMessagesScreen", {
              starredMessages: starredMessages,
              chatUser: {
                username: userItem.username,
                firstname: userItem.fullname,
                userId: userId,
              },
            })
          }
        >
          <View style={styles.optionLeft}>
            <Ionicons name="star-outline" size={24} color={COLORS.white} />
            <Text style={styles.optionText}>
              Starred Messages ({starredMessages.length})
            </Text>
          </View>
        </TouchableOpacity>
        {/* MEDIA */}
        <View style={{ padding: wp(4) }}>
          <Text style={styles.mediaHeader}>
            Media ({mediaItems.length})
          </Text>

          {loadingMedia ? (
            <ActivityIndicator color={COLORS.white} />
          ) : mediaItems.length > 0 ? (
            <FlatList
              data={mediaItems}
              numColumns={3}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedImage(item.image)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.mediaImage}
                  />
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={{ color: COLORS.white }}>
              No media shared yet
            </Text>
          )}
        </View>

        {/* REPORT / BLOCK / DELETE */}
        <View style={styles.dangerContainer}>
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={() => handleAction("report")}
          >
            <Ionicons
              name="alert-circle-outline"
              size={22}
              color="orange"
            />
            <Text style={[styles.dangerText, { color: "orange" }]}>
              Report {userItem.fullname}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerRow}
            onPress={() => handleAction("block")}
          >
            <Ionicons
              name="ban-sharp"
              size={22}
              color="red"
            />
            <Text style={[styles.dangerText, { color: "red" }]}>
              Block {userItem.fullname}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerRow}
            onPress={() => handleAction("delete")}
          >
            <Ionicons name="trash" size={22} color="red" />
            <Text style={[styles.dangerText, { color: "red" }]}>
              Delete Chat
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* IMAGE MODAL */}
      <Modal visible={!!selectedImage} transparent>
        <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
};

export default PublicProfile;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp(4),
    alignItems: "center",
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },

  profileContainer: {
    alignItems: "center",
    marginVertical: hp(2),
  },

  profileImage: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    borderWidth: 2,
    borderColor: COLORS.button_bg_color,
    marginBottom: hp(1),
  },

  profileName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "600",
  },

  statusText: {
    color: "#aaa",
    marginTop: hp(1),
  },

  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginHorizontal: wp(8),
    marginTop: hp(2),
    paddingVertical: hp(2),
    borderRadius: wp(3),
    width: "80%",
  },

  actionItem: {
    alignItems: "center",
  },

  actionLabel: {
    color: COLORS.white,
    fontSize: 13,
    marginTop: hp(0.5),
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    alignItems: "center",
    marginVertical: hp(1.5),
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionText: {
    color: COLORS.white,
    marginLeft: wp(2),
    fontSize: 16,
  },

  mediaHeader: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: wp(3),
  },

  mediaImage: {
    width: wp(30),
    height: wp(30),
    margin: wp(1),
    borderRadius: wp(2),
  },

  dangerContainer: {
    marginTop: hp(3),
    paddingHorizontal: wp(4),
    paddingBottom: hp(5),
  },

  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    borderBottomWidth: 0.1,
    borderBottomColor: "#333",
  },

  dangerText: {
    marginLeft: wp(3),
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: "100%",
  },
});