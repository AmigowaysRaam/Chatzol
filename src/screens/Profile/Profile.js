import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { useDispatch, useSelector } from "react-redux";
import { Louis_George_Cafe } from "../../resources/fonts";
import { editProfileUserSuccess, getUserProfile, updateUserProfile } from "../../redux/authActions";
import { useNavigation } from "@react-navigation/native";
import ButtonComponent from "../../components/Button/Button";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../redux/authActions";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../resources/Colors";

const Profile = () => {

  const dispatch = useDispatch();

  const profile = useSelector((state) => state.auth.profile);
  const isLoading = useSelector((state) => state.isLoading);

  const navigation = useNavigation();

  const [name, setName] = useState(profile?.fullname);
  const [email, setEmail] = useState(profile?.email);
  const [phoneNumber, setPhoneNumber] = useState(profile?.phonenumber);

  const [imageSelected, setSelectedPic] = useState({});
  const [profileImage, setProfileImage] = useState(profile?.profilepicture);

  // Request Permission for Android
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Photo Gallery Permission",
            message: "We need access to your photo gallery to upload your profile picture.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    } else {
      return true;
    }
  };

  // Handle Image Picker

  const handleImagePicker = async () => {
    // const permissionGranted = await requestPermission();
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("Image Picker Error: ", response.errorMessage);
        Alert.alert("Error", "Could not pick the image");
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setProfileImage(selectedImageUri);
        setSelectedPic(response.assets[0]);

      } else {
        Alert.alert("Error", "No image selected");
      }
    });

  };


  const handleUpdateProfile = async () => {

    const formData = new FormData();

    const payload = {
      userid: profile?._id,
      // fullname: name,
      // phonenumber: phoneNumber,
      // email: email,
    };

    // Append user details
    formData.append('userid', profile?._id);
    formData.append('fullname', name);  // Use updated state `name`
    formData.append('phonenumber', phoneNumber);
    formData.append('email', email);
    // Check if a new image is selected
    if (imageSelected?.uri) {
      formData.append('profilepicture', {
        uri: imageSelected.uri,  // URI of the selected image
        type: imageSelected.type || 'image/jpeg',  // MIME type (e.g. 'image/jpeg')
        name: imageSelected.fileName,  // The image file name (e.g. 'profile.jpg')
      });
    } else {
      formData.append('profilepicture', {
        uri: profileImage,
        type: 'image/jpeg',
        name: `${profile?.fullname}-profile`,
      });
    }

    // URL to which the request is sent
    const url = 'https://chatzol.scriptzol.in/api/?url=app-update-profile-user';

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',  // Ensure the correct content type for file uploads
      },
    })
      .then(response => response.json())  // Parse JSON response
      .then(responseJson => {
        if (responseJson.success) {
          // dispatch(updateUserProfile(payload))
          Toast.show({
            text1: 'Success',
            text2: responseJson.message,
            type: 'success',
          });
          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        } else {
          Toast.show({
            text1: 'Error',
            text2: responseJson.message,
            type: 'error',
          });
        }
      })
      .catch(error => {
        console.error("Error in updating profile: ", error);
        Toast.show({
          text1: 'Error',
          text2: 'There was an error updating your profile. Please try again later.',
          type: 'error',
        });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: COLORS.black }]}
    >
      {/* <HeaderComponent /> */}

      <LinearGradient colors={["#f0f0f0", "#FFF"]} style={styles.headContainer}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={[styles.headingName, Louis_George_Cafe.bold.h3, { color: COLORS.white }]}>
            Profile
          </Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ alignSelf: "center" }}>
          <Toast /> {/* Initialize Toast */}
        </Text>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleImagePicker}
          >
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <Ionicons
              name="camera"
              size={24}
              color="#fff"
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
          <Text style={styles.nameText}>{name}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                Louis_George_Cafe.regular.h7,
                {
                  // color: "white",
                },
              ]}
            >
              Name
            </Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                Louis_George_Cafe.regular.h7,
                {
                  // color: "white",
                },
              ]}
            >
              Phone Number
            </Text>
            <TextInput
              maxLength={10}
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                Louis_George_Cafe.regular.h7,
                {
                  // color: "white",
                },
              ]}
            >
              Email
            </Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.saveButton}>
            <ButtonComponent
              title={"Save Changes"}
              onPress={handleUpdateProfile}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: "#000",
  },
  contentContainer: {
    paddingBottom: wp(10),
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    borderColor: "#fff",
    borderWidth: wp(0.6),
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    padding: 5,
    borderRadius: wp(10),
    backgroundColor: COLORS.button_bg_color
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#fff",
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    gap: hp(1),
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: "#ebecf1",
    color: "#000",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    marginTop: hp(3),
    alignItems: 'center'
  },
});

export default Profile;
