import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { getStaredMessage, unStarMessages } from "../../redux/authActions";
import moment from "moment";
import Toast from "react-native-toast-message";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";

const StarredMessagesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  const [starredMessages, setStarredMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStarredMessages();
  }, []);

  const fetchStarredMessages = () => {
    setRefreshing(true);
    dispatch(
      getStaredMessage(userId, (response) => {
        setStarredMessages(response?.data || []);
        setRefreshing(false);
      })
    );
  };

  const unstarAllMessages = () => {
    Alert.alert(
      "Unstar All Messages",
      "Are you sure you want to remove starred status for all messages?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            dispatch(
              unStarMessages(userId, (response) => {
                fetchStarredMessages();
                Toast.show({
                  text1: response?.message || "All messages unstarred",
                  type: "success",
                });
              })
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openChatMessage = (message) => {
    navigation.navigate("ChatScreen", {
      touserId: message.senderId ?? message.fromuserid,
      username: message.senderUsername ?? message.fromusername,
      firstname: message.name,
      userProfileImage: message.profilepicture,
      muted: message.muted ?? 0,
      unreadcount: message.unreadcount ?? 0,
      messageToHighlight: message.messageid ?? message.id,
      fromStarred: true,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.messageContainer}
        activeOpacity={0.8}
        onPress={() => openChatMessage(item)}
      >
        {/* Green Star Icon */}
        <MaterialIcons
          name="star"
          size={18}
          color="#555"
          style={styles.starIcon}
        />

        {/* Profile + Name */}
        <View style={styles.profileContainer}>
          <Image
            source={item.profilepicture}
            style={[styles.profilepicture,{borderColor:COLORS.button_bg_color,borderWidth:wp(0.5)}]}
          />
          <Text style={styles.userName}>{item.name}</Text>
        </View>

        {/* Message */}
        <Text numberOfLines={3} style={styles.messageText}>
          {item?.message}
        </Text>

        {/* Timestamp */}
        <Text style={styles.timestampText}>
          {item?.createddatetime}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require("../../assets/chatbg.jpg")} style={styles.imageBackground}>
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header,{backgroundColor:"#F0F0F0"}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Starred Messages</Text>

        <TouchableOpacity onPress={unstarAllMessages}>
          <MaterialIcons name="star" size={26}  color="#000" />
        </TouchableOpacity>
      </View>

      {/* EMPTY STATE */}
      {starredMessages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="star-border" size={60} color="#bbb" />
          <Text style={styles.emptyText}>
            No starred messages available.
          </Text>
        </View>
      ) : (
        <FlatList
          data={starredMessages}
          keyExtractor={(item, index) =>
            item.id?.toString() ?? index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          refreshing={refreshing}
          onRefresh={fetchStarredMessages}
          ItemSeparatorComponent={() => <View style={{ height: hp(1.5) }} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Toast />
    </SafeAreaView>
    </ImageBackground>
  );
};

export default StarredMessagesScreen;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#ECE5DD", // WhatsApp chat background
  // },
  imageBackground: {
    flex: 1,
    height: hp(100),
  },

  header: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: "center",
    justifyContent: "space-between",

  },

  headerTitle: {
    color: "#000",
    fontSize: wp(5),
    fontWeight: "600",
  },

  messageList: {
    padding: wp(3),
  },

  messageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: wp(4),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  starIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },

  profilepicture: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(7),
    marginRight: wp(3),
    
  },

  userName: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#111",
  },

  messageText: {
    fontSize: wp(4),
    color: "#222",
    marginBottom: hp(0.5),
  },

  timestampText: {
    fontSize: wp(3),
    color: "#666",
    textAlign: "right",
  },

  emptyContainer: {
    marginTop: hp(20),
    alignItems: "center",
  },

  emptyText: {
    marginTop: hp(2),
    fontSize: wp(4),
    color: "#666",
    textAlign: "center",
  },
});