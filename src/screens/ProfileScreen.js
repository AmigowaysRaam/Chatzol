import React, { useEffect, useState, useCallback } from "react";
import { View,  Text,  Image,  StyleSheet,  TouchableOpacity,  SafeAreaView,  StatusBar,  ScrollView,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Divider } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { wp, hp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import { Louis_George_Cafe } from "../resources/fonts";
import { getUserProfile, logout } from "../redux/authActions";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userId = useSelector((state) => state.auth.user?._id);
  const profile = useSelector((state) => state.auth.profile);

  const [profileImage, setProfileImage] = useState(
    profile?.profilepicture
  );

  // Refresh profile when screen focuses
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(getUserProfile(userId));
      }
    }, [userId])
  );

  useEffect(() => {
    setProfileImage(profile?.profilepicture);
  }, [profile?.profilepicture]);

  const handleLogout = async () => {
    dispatch(logout());
    await AsyncStorage.clear();
    navigation.replace("LoginScreen");
  };

  const menuItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color="#243B55" />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient
          colors={["#F0F0F0", "#FFF"]}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>

          <View style={{ width: 26 }} />
        </LinearGradient>

        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri:
                  profileImage ||
                  "https://i.imgur.com/6VBx3io.png",
              }}
              style={[styles.avatar,{borderColor:COLORS.button_bg_color}]}
            />

            <TouchableOpacity
              style={[styles.editIcon,{backgroundColor: COLORS.button_bg_color}]}
              onPress={() => navigation.navigate("Profile")}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.name, Louis_George_Cafe.bold.h4]}>
            {profile?.fullname}
          </Text>

          <Text style={[styles.email, Louis_George_Cafe.regular.h7]}>
            {profile?.email}
          </Text>
        </View>

        <Divider style={{ marginVertical: hp(3) }} />

        {/* MENU */}
        <View style={styles.menuContainer}>
          {menuItem("lock-closed-outline", "Change Password", () =>
            navigation.navigate("ChangePasswordScreen")
          )}

          {menuItem("image-outline", "Wallpaper", () =>
            navigation.navigate("WallpaperScreen")
          )}

          {menuItem("alert-circle-outline", "Blocked Users", () =>
            navigation.navigate("BlcokedUserList")
          )}
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={[styles.logoutBtn,{backgroundColor:COLORS.button_bg_color}]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, Louis_George_Cafe.bold.h6]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  headerTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },

  profileSection: {
    alignItems: "center",
    marginTop: 30,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    borderWidth: 3,
  },

  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    padding: 6,
    borderRadius: 20,
  },

  name: {
    marginTop: 15,
    fontSize: 20,
    color: "#222",
  },

  email: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },

  menuContainer: {
    paddingHorizontal: 20,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 15,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  logoutBtn: {
    marginTop: 40,
    marginBottom: 40,
    marginHorizontal: 60,
  
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
});
