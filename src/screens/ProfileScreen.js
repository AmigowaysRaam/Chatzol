import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { wp, hp } from "../resources/dimensions";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../resources/Colors";
import { Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Louis_George_Cafe } from "../resources/fonts";
import {
  getUserProfile,
  logout,
} from "../redux/authActions";
import { useNavigationFocusHooks } from "../utils/NavigationListenerHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const userId = useSelector((state) => state.auth.user?._id);
  const profile = useSelector((state) => state.auth.profile);

  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    profile?.profilepicture
  );

  // useEffect(() => {
  //   if (!userId) {
  //     navigation.replace("LoginScreen");
  //   }
  // }, [userId]);

  function onNavigationFocused() {
    if (userId) {
      fetchUserProfile();
    }
  }

  useEffect(() => {
    setProfileImage(profile?.profilepicture)
  }, [profile?.profilepicture]);



  function onNavigationExit() { }

  const navListener = useNavigationFocusHooks({
    onNavigationFocused,
    onNavigationExit,
  });

  // Handle Profile Update
  const fetchUserProfile = async () => {

    if (userId) {
      dispatch(getUserProfile(userId));
    } else {
      console.log("No userId found, user might not be logged in.");
    }

  };

  const handleLogout = () => {

    setIsLogoutLoading(true);
    dispatch(logout());
    AsyncStorage.clear();
    setTimeout(() => {
      navigation.replace("LoginScreen");
    }, 1000);
  };


  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.black
    }]}>
      <>
        <LinearGradient colors={["#f0f0f0", "#FFF"]} style={styles.headContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconContainer}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View  >
            {/* <Text
              style={[Louis_George_Cafe.bold.h4, { color: COLORS.white, textAlign: "center" }]}>{"Profile"}</Text> */}
          </View>
        </LinearGradient>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
          >
            <View
              style={styles.profileImageContainer}
            >
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
              <Ionicons
                name="pencil"
                size={22}
                color={COLORS.black}
                style={[styles.cameraIcon, {
                  backgroundColor: COLORS.button_bg_color
                }]}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[Louis_George_Cafe.bold.h4, { color: COLORS.white }]}>
            {profile?.fullname}
          </Text>
          <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.white }]}>
            {profile?.email}
          </Text>
        </View>
        <Divider style={{ marginVertical: hp(2) }} />
      </>

      <View style={{ paddingHorizontal: wp(5), marginVertical: hp(1) }}>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: hp(2),
          }}
          onPress={() => navigation.navigate("ChangePasswordScreen")
          }
        >
          <Ionicons name="lock-closed-outline" size={24} color={COLORS.white} />
          <Text
            style={[
              styles.questionsText,
              Louis_George_Cafe.regular.h6,
            ]}
          >
            Change Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: hp(2),
          }}
          onPress={() => navigation.navigate("WallpaperScreen")
          }
        >
          <Ionicons name="image" size={24} color={COLORS.white} />
          <Text
            style={[
              styles.questionsText,
              Louis_George_Cafe.regular.h6,
              {
              },
            ]}
          >
            Wallpaper
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: hp(1),
          }}
          onPress={() => navigation.navigate("BlcokedUserList")}
        >
          <Ionicons name="alert-circle-outline" size={24} color={COLORS.white} />
          <Text
            style={[
              styles.announcementText,
              Louis_George_Cafe.regular.h6,
              {
              },
            ]}
          >
            Blocked Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLogout()}
          style={{
            marginTop: wp(20),
            backgroundColor: COLORS.button_bg_color,
            width: wp(50),
            justifyContent: "center",
            alignSelf: "center",
            padding: wp(2),
            borderRadius: wp(10),
            alignItems: "center",
          }}
        >
          <Text
            style={[
              Louis_George_Cafe.bold.h6,
              {

                color: "white",
                textAlign: "center", // Centers text horizontally
                justifyContent: "center", // Aligns text vertically
                alignItems: "center", // Aligns text vertically
                width: "100%", // Ensures the text uses the full width
              },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000",
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  iconContainer: {
    padding: wp(2)
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(2),
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    borderColor: COLORS.button_bg_color,
    borderWidth: wp(0.6),
  },
  cameraIcon: {
    position: "absolute",
    top: hp(8),
    right: hp(0),
    padding: wp(1),
    borderRadius: wp(10),
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 10,
  },

  announcementText: {
    color: COLORS.white,
    fontSize: hp(2),
    marginLeft: wp(2),
  },

  questionsText: {
    color: COLORS.white,
    fontSize: hp(2),
    marginLeft: wp(2),
  },
});

export default ProfileScreen;
