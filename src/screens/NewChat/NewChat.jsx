import {  StyleSheet, Text,  View,  TouchableOpacity,  ActivityIndicator,  TextInput,  FlatList,} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../../resources/Colors";
import { hp, wp } from "../../resources/dimensions";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  allowGroupCommunity,
  getSearchUser,
  createConversation,
} from "../../redux/authActions";
import HeaderBar from "../../ScreenComponents/HeaderComponent/HeaderComponent";

const NewChat = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.user?._id);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsersList] = useState([]);
  const [allowCommunity, setAllowCommunity] = useState(0);

  /* ---------------- SEARCH USERS ---------------- */

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm) {
        setUsersList([]);
        return;
      }

      const lettersOnly = searchTerm.replace(/[^a-zA-Z]/g, "");

      if (lettersOnly.length < 3) {
        setUsersList([]);
        return;
      }

      setIsLoading(true);

      dispatch(
        getSearchUser(userId, searchTerm, 1, "", (response) => {
          if (response?.success) {
            setUsersList(response?.data || []);
          }
          setIsLoading(false);
        })
      );
    };

    fetchUsers();
  }, [searchTerm]);

  /* ---------------- CHECK COMMUNITY PERMISSION ---------------- */

  useEffect(() => {
    dispatch(
      allowGroupCommunity(userId, (response) => {
        if (response?.success) {
          setAllowCommunity(response?.data?.allowaddCommunity);
        }
      })
    );
  }, [userId]);

  /* ---------------- HANDLERS ---------------- */

  const handleUserPress = async (item) => {
    try {
      await dispatch(
        createConversation(userId, item._id, "Initial message")
      );

      navigation.navigate("ChatScreen", {
        username: item.username,
        userId: item._id,
        toUserId: item._id,
        firstname: item.fullname,
        userProfileImage: item.image,
      });
    } catch (error) {
      console.log("Conversation Error:", error);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderBar title="New Chat" showClose/>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("NewChatGroup")}
        >
          <AntDesign name="addusergroup" size={22} color="#fff" />
          <Text style={styles.actionText}>New Group</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.actionButton}
  onPress={() => navigation.navigate("PhoneContacts")}
>
  <FontAwesome name="address-book" size={22} color="#fff" />
  <Text style={styles.actionText}>Phone Contacts</Text>
</TouchableOpacity>

        {(allowCommunity == 1 || allowCommunity == "1") && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("NewCommunity")}
          >
            <FontAwesome name="group" size={22} color="#fff" />
            <Text style={styles.actionText}>New Community</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contacts Title */}
      <Text style={styles.contactTitle}>Global Users</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search users..."
          placeholderTextColor="#999"
        />
      </View>

      {/* User List */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#a020cb"
          style={{ marginTop: hp(3) }}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() =>
            searchTerm.length >= 3 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No users found
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => handleUserPress(item)}
            >
              <Avatar.Image
                size={55}
                source={{ uri: item.image }}
              />
              <View style={{ marginLeft: wp(4) }}>
                <Text style={styles.userName}>
                  {item.fullname}
                </Text>
                <Text style={styles.userUsername}>
                  @{item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
export default NewChat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  actionContainer: {
    marginHorizontal: wp(4),
    marginVertical: hp(1),
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a020cb",
    padding: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(1.2),
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: wp(3),
    fontWeight: "500",
  },

  contactTitle: {
    marginLeft: wp(5),
    marginTop: hp(1),
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f6",
    marginHorizontal: wp(4),
    paddingHorizontal: wp(4),
    borderRadius: wp(10),
    height: hp(6),
    marginVertical: hp(1.5),
  },

  searchInput: {
    marginLeft: wp(3),
    flex: 1,
    fontSize: 15,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  userUsername: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: hp(5),
  },

  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});