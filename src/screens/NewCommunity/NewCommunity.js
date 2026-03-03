import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../resources/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { Avatar, Checkbox } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import { getCommiunityList, getGroupList } from "../../redux/authActions";
import Toast from "react-native-toast-message";
import HeaderBar from "../../ScreenComponents/HeaderComponent/HeaderComponent";

const NewCommunity = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const groupList = useSelector((state) => state.auth.groupList || []);
  const [selectedGroup, setselectedGroup] = useState([]);
  const [communityName, setCommunityName] = useState("");
  const [bio, setBio] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const userId = useSelector((state) => state.auth.user?._id);
  const [isLoading, setIsLoading] = useState(false);

  // Filter users based on search term
  const filteredUsers = groupList.data
    ? groupList.data.filter((user) =>
        user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    dispatch(getGroupList(userId));
  }, [userId]);

  const toggleSelection = (userId) => {
    setselectedGroup((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleCreateCommunity = async () => {
    if (!communityName.trim()) {
      alert("Please enter a community name.");
      return;
    }
    if (selectedGroup.length === 0) {
      alert("Please select at least one group.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", communityName);
    formData.append("userid", userId);
    formData.append("groupsid", selectedGroup);
    formData.append("bio", bio);
    if (groupImage) {
      const filename = groupImage.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      formData.append("image", { uri: groupImage, name: filename, type });
    }

    try {
      const response = await fetch(
        "https://chatzol.scriptzol.in/api/?url=app-create-community",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.success) {
        Toast.show({
          text1: "Success!",
          text2: data?.message,
          type: "success",
          position: "top",
        });
        dispatch(getCommiunityList(userId));
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        Toast.show({
          text1: "Error!",
          text2: data.message,
          type: "error",
          position: "top",
        });
      }
    } catch (error) {
      Toast.show({
        text1: "Error!",
        text2: "Something went wrong.",
        type: "error",
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = () => {
    const options = { mediaType: "photo", includeBase64: false };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.error) return console.log("ImagePicker Error: ", response.error);
      setGroupImage(response.assets[0].uri);
    });
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <HeaderBar title="New Community" showBackArrow/>

      {/* Community Info Card */}
      <View style={styles.infoCard}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.image} />
          ) : (
            <Feather name="camera" size={28} color={COLORS.white} />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.communityNameInput}
          placeholder="Community Name"
          placeholderTextColor={COLORS.gray}
          value={communityName}
          onChangeText={setCommunityName}
        />

        <TextInput
          style={styles.bioInput}
          placeholder="Bio"
          placeholderTextColor={COLORS.gray}
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </View>

      {/* Search Users */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search users..."
          placeholderTextColor={COLORS.gray}
        />
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: hp(15) }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleSelection(item._id)}
            style={[
              styles.userItem,
              selectedGroup.includes(item._id) && styles.userSelected,
            ]}
          >
            <Avatar.Image size={48} source={{ uri: item.image }} />
            <Text style={styles.userName}>{item.name}</Text>
            <Checkbox
              color={COLORS.button_bg_color}
              status={selectedGroup.includes(item._id) ? "checked" : "unchecked"}
            />
          </TouchableOpacity>
        )}
      />

      {/* Create Community Button */}
      <TouchableOpacity
        onPress={handleCreateCommunity}
        style={[
          styles.createButton,
          (!communityName || selectedGroup.length === 0 || isLoading) && styles.buttonDisabled,
        ]}
        disabled={!communityName || selectedGroup.length === 0 || isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? "Creating..." : "Create Community"}</Text>
      </TouchableOpacity>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default NewCommunity;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(2),
    width: wp(100),
  },
  textContainer: { marginLeft: wp(5) },
  headingName: { maxWidth: wp(70) },
  infoCard: {
    margin: wp(4),
    padding: wp(4),
    borderRadius: wp(3),
    backgroundColor: "#f1f3f6",
    alignItems: "center",
  },
  imagePicker: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: wp(3),
  },
  image: { width: "100%", height: "100%", borderRadius: wp(10) },
  communityNameInput: {
    width: "100%",
    backgroundColor: "#fff",
    color: COLORS.white,
    padding: wp(3),
    borderRadius: wp(2),
    marginBottom: wp(2),
  },
  bioInput: {
    width: "100%",
    backgroundColor: "#fff",
    color: COLORS.white,
    padding: wp(3),
    borderRadius: wp(2),
    minHeight: hp(10),
    textAlignVertical: "top",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: wp(50),
    paddingHorizontal: wp(4),
    marginHorizontal: wp(4),
    marginVertical: wp(2),
  },
  searchInput: { flex: 1, color: COLORS.white, paddingVertical: wp(2) },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3),
    marginHorizontal: wp(4),
    marginVertical: wp(1),
    borderRadius: wp(2),
    backgroundColor: "#f1f3f6",
  },
  userSelected: { backgroundColor: "#e7caf0" },
  userName: { flex: 1, marginLeft: wp(3), color: COLORS.white },
  createButton: {
    position: "absolute",
    bottom: hp(2),
    alignSelf: "center",
    backgroundColor: COLORS.button_bg_color,
    paddingVertical: wp(3),
    paddingHorizontal: wp(10),
    borderRadius: wp(10),
  },
  buttonText: { color: COLORS.black, fontWeight: "bold" },
  buttonDisabled: { backgroundColor: COLORS.button_bg_color },
});