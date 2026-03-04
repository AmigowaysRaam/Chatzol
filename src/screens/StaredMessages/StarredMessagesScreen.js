import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import HeaderBar from "../../ScreenComponents/HeaderComponent/HeaderComponent";

const StarredMessagesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { starredMessages, chatUser } = route.params || {};

  const openChatMessage = (message) => {
  navigation.navigate("ChatScreen", {
    touserId: message.touserId || message.senderId,          // actual user ID
    username: message.username || message.senderUsername,   // actual username
    firstname: message.name || message.senderName,          // name for header
    userProfileImage: message.profilepicture,                // image
    muted: message.muted ?? 0,                               // mute flag
    unreadcount: message.unreadcount ?? 0,                   // unread count
    messageToHighlight: message.messageid ?? message.id,     // message id to scroll
    fromStarred: true,
  });
};

  return (
    <View>
    <HeaderBar title="Starred Messages" showBackArrow/>
    <View style={styles.container}>
   <FlatList
  data={starredMessages}
  keyExtractor={(item, index) =>
    item?.id?.toString() ?? index.toString()
  }
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => openChatMessage(item)}
    >
      <Text style={styles.messageText}>
        {item.text || item.message}
      </Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  )}
  ListEmptyComponent={
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No starred messages found</Text>
    </View>
  }
/>
    </View>
    </View>
  );
};

export default StarredMessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    padding: 16,
  },
  header: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    color: COLORS.white,
    fontSize: 16,
  },
  timestamp: {
    color: COLORS.timestamp,
    fontSize: 12,
    marginTop: 4,
  },
  empty: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    color: "gray",
    fontSize: 16,
  },
});