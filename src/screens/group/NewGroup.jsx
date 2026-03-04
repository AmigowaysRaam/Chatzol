import React, { useState, useEffect } from "react";
import {  StyleSheet,  Text,  View,  TextInput,  FlatList,  TouchableOpacity,  KeyboardAvoidingView,  Platform,  Image,  Switch,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Avatar, Checkbox } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import { getListConversation, getSearchUser } from "../../redux/authActions";
import { wp, hp } from "../../resources/dimensions";
import HeaderBar from "../../ScreenComponents/HeaderComponent/HeaderComponent";

const NewChatGroup = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [canSendMessages, setCanSendMessages] = useState(true);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- SEARCH USERS ---------------- */

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setUsers([]);
      return;
    }

    setIsLoading(true);

    dispatch(
      getSearchUser(userId, searchTerm, 1, "", (res) => {
        if (res?.success) {
          setUsers(res.data || []);
        }
        setIsLoading(false);
      })
    );
  }, [searchTerm]);

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response?.assets?.length > 0) {
        setGroupImage(response.assets[0].uri);
      }
    });
  };

  /* ---------------- TOGGLE USER ---------------- */

  const toggleSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ---------------- CREATE GROUP ---------------- */

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Toast.show({ type: "error", text1: "Group name required" });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("userid", userId);
    formData.append("membersid", JSON.stringify(selectedUsers));
    formData.append("allow_send_message", canSendMessages ? 1 : 0);

    if (groupImage) {
      formData.append("image", {
        uri: groupImage,
        type: "image/jpeg",
        name: "group.jpg",
      });
    }

    try {
      const response = await fetch(
        "https://chatzol.scriptzol.in/api/?url=app-create-group",
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.success) {
        dispatch(getListConversation(userId));
        Toast.show({ type: "success", text1: data.message });
        navigation.goBack();
      } else {
        Toast.show({ type: "error", text1: data.message });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Something went wrong" });
    }

    setIsLoading(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <HeaderBar title='New Group' showBackArrow/>

      {/* Group Card */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.image} />
          ) : (
            <Feather name="camera" size={wp(6)} color="#777" />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            Allow members to send messages
          </Text>
          <Switch
            value={canSendMessages}
            onValueChange={setCanSendMessages}
            thumbColor={canSendMessages ? '#a020cb' : "#555"}
          />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={wp(5)} color="#999" />
        <TextInput
          placeholder="Search members..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      {/* Users */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: hp(3) }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={() =>
            searchTerm.length >= 3 && (
              <Text style={styles.emptyText}>No users found</Text>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => toggleSelection(item._id)}
            >
              <Checkbox
                status={
                  selectedUsers.includes(item._id)
                    ? "checked"
                    : "unchecked"
                }
                color="#a020cb"
              />
              <Avatar.Image
                size={wp(12)}
                source={{ uri: item.image }}
              />
              <View style={{ marginLeft: wp(3) }}>
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

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateGroup}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>
            Create Group
          </Text>
        )}
      </TouchableOpacity>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default NewChatGroup;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: wp(4),
    marginTop: hp(2),
    padding: wp(4),
    borderRadius: wp(4),
    elevation: 2,
  },

  imagePicker: {
    alignSelf: "center",
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "#f1f3f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
  },

  image: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: hp(1),
    fontSize: wp(4),
    marginBottom: hp(2),
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchText: {
    fontSize: wp(3.5),
    color: "#555",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: wp(4),
    paddingHorizontal: wp(4),
    borderRadius: wp(10),
    height: hp(6),
    marginTop: hp(2),
  },

  searchInput: {
    marginLeft: wp(3),
    flex: 1,
    fontSize: wp(3.8),
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  userName: {
    fontSize: wp(4),
    fontWeight: "600",
  },

  userUsername: {
    fontSize: wp(3.2),
    color: "#777",
    marginTop: hp(0.3),
  },

  emptyText: {
    textAlign: "center",
    marginTop: hp(4),
    color: "#999",
    fontSize: wp(4),
  },

  createButton: {
    position: "absolute",
    bottom: hp(3),
    left: wp(4),
    right: wp(4),
    height: hp(6),
    backgroundColor: "#a020cb",
    borderRadius: wp(10),
    justifyContent: "center",
    alignItems: "center",
  },

  createButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
  },
});