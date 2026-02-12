import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
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
import ButtonComponent from "../../components/Button/Button";
import { launchImageLibrary } from "react-native-image-picker";
import { getCommiunityList, getGroupList, getListConversation } from "../../redux/authActions";
import Toast from "react-native-toast-message";

const NewCommunity = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const groupList = useSelector((state) => state.auth.groupList || []);
  const [selectedGroup, setselectedGroup] = useState([]);

  const [communityName, setCommunityName] = useState("");
  const [bio, setBio] = useState(""); // State for bio
  const [groupImage, setGroupImage] = useState(null); // State for group image
  const userId = useSelector((state) => state.auth.user?._id);
  const [isLoading, setIsLoading] = useState(false);

  // Filter users based on search term
  const filteredUsers = groupList.data ? groupList?.data.filter(user =>
    user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  useEffect(() => {
    // alert(JSON.stringify(groupList))
    fetchConversations();
  }, [userId]);

  const fetchConversations = () => {
    // alert(JSON.stringify(groupList))
    dispatch(getGroupList(userId));
  };


  const toggleSelection = (userId) => {
    setselectedGroup((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleCreateCommunity = async () => {
    setIsLoading(true);

    if (!communityName.trim()) {
      alert("Please enter a community name.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', communityName);
    formData.append('userid', userId);
    formData.append('groupsid', selectedGroup);
    formData.append('bio', bio);

    const response = await fetch('https://chatzol.scriptzol.in/api/?url=app-create-community', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();


    if (data.success) {
      // Dispatch actions for success
      Toast.show({
        text1: 'Success!',
        text2: data?.message,
        type: 'success',
        position: 'top',
      });

      // Update state and navigate
      setIsLoading(false);
      dispatch(getCommiunityList(userId));
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } else {
      // Handle error from response
      Toast.show({
        text1: 'Error!',
        text2: data.message,
        type: 'error',
        position: 'top',
      });
      setIsLoading(false);
    }
  };


  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setGroupImage(response.assets[0].uri);
      }
    });

  };

  const HeaderComponent = ({ onBackPress }) => (
    <LinearGradient colors={["#f0f0f0", "#FFF"]} style={styles.headContainer}>
      <TouchableOpacity onPress={onBackPress}>
        <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.headingName, Louis_George_Cafe.bold.h2, { color: COLORS.white }]}>
          New Community
        </Text>
      </View>

    </LinearGradient>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <HeaderComponent onBackPress={() => navigation.goBack()} />

      <View style={[styles.header, { backgroundColor: "#ebecf1" }]}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: wp(4),
          }}
        >
          <Feather
            name="camera"
            onPress={pickImage}
            size={24}
            style={{
              backgroundColor: COLORS.search_bg_color,
              padding: wp(3),
              marginHorizontal: wp(4),
              borderRadius: wp(7),
            }}
            color={COLORS.button_bg_color}
          />
          <TextInput
            style={{
              backgroundColor: COLORS.black,
              width: wp(75),
              paddingVertical: wp(2),
              paddingHorizontal: wp(5),
              borderRadius: wp(2),
              color: COLORS.white,
            }}
            placeholder="Community Name"
            placeholderTextColor={COLORS.white}
            value={communityName}
            onChangeText={setCommunityName}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: wp(4),
          }}
        >
          <TextInput
            style={{
              backgroundColor: COLORS.black,
              width: wp(75),
              paddingVertical: wp(2),
              paddingHorizontal: wp(5),
              borderRadius: wp(2),
              color: COLORS.white,
              marginLeft: wp(20)
            }}
            placeholder="Bio"
            placeholderTextColor={COLORS.white}
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </TouchableOpacity>

        {groupImage && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp(2) }}>
            <Image
              source={{ uri: groupImage }}
              style={{ width: wp(20), height: wp(20), borderRadius: 8 }}
              accessibilityLabel="Community Image"
              onError={() => console.log("Image failed to load")}
            />
            <TouchableOpacity
              onPress={() => setGroupImage(null)}
              accessibilityLabel="Remove community image"
              style={{ marginLeft: wp(1) }}
            >
              <MaterialIcons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Toast />

      {/* FlatList goes here without wrapping in KeyboardAvoidingView */}
      <FlatList
        data={filteredUsers || []}
        ListHeaderComponent={
          <View style={[styles.searchContainer, { backgroundColor: "#ebecf1" }]}>
            <TouchableOpacity style={styles.iconContainer}>
              <MaterialIcons name="search" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search..."
              placeholderTextColor={COLORS.white}
              color={COLORS.white}
            />
          </View>
        }
        keyExtractor={(item) => Math.random() + item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleSelection(item._id)}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: wp(1) }}>
              <Checkbox
                color={COLORS.button_bg_color}
                status={selectedGroup.includes(item._id) ? "checked" : "unchecked"}
              />
              <Avatar.Image
                size={48}
                style={{ marginStart: wp(2) }}
                source={{ uri: item.image }}
              />
              <Text style={[styles.headingName, Louis_George_Cafe.medium.h7, { color: COLORS.white, marginStart: wp(4) }]}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {
        selectedGroup.length !== 0 ?
          // <ButtonComponent title={"Create Community"}  isLoading={isLoading} />
          <TouchableOpacity
            onPress={handleCreateCommunity}
            style={{
              backgroundColor: COLORS.button_bg_color, padding: wp(2), width: wp(60), height: hp(5), borderRadius: wp(10), marginVertical: wp(5), marginTop: wp(2), justifyContent: "center",
              alignItems: "center",
            }}>
            {/* <ActivityIndicator color="#FFF" /> */}
            <Text style={[styles.headingName, Louis_George_Cafe.bold.h8, { color: COLORS.black, alignItems: "center", textAlign: "center" }]}>
              {"Create Community"}
            </Text>
          </TouchableOpacity>

          : <View style={{
            backgroundColor: "#ebecf1", padding: wp(2), width: wp(60), height: hp(5), borderRadius: wp(10), marginVertical: wp(5), marginTop: wp(2), justifyContent: "center",
            alignItems: "center",
          }}>
            {/* <ActivityIndicator color="#FFF" /> */}
            <Text style={[styles.headingName, Louis_George_Cafe.bold.h8, { color: COLORS.white, alignItems: "center", textAlign: "center" }]}>
              {"Choose Group"}
            </Text>
          </View>

      }


    </KeyboardAvoidingView>
  );
};

export default NewCommunity;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.black,
    padding: wp(1),
  },
  header: {
    width: "100%",
    marginHorizontal: wp(4),
    paddingVertical: wp(2),
    borderRadius: wp(2),
    marginVertical: wp(2),
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(2),
    width: wp(100)
  },
  textContainer: {
    marginLeft: wp(5),
  },

  textInput: {
    flex: 1,
  },
  iconContainer: {
    marginRight: wp(4),
  },
  searchContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: wp(98),
    height: hp(5),
    borderRadius: wp(50),
    paddingHorizontal: wp(2),
    marginVertical: wp(1),
    marginBottom: wp(4),
  },
  headingName: {
    maxWidth: wp(70)
    // Define your text styles here
  },
});
