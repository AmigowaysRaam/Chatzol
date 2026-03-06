import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Modal,
  Text,
  TouchableOpacity,Platform
} from "react-native";
import LottieView from "lottie-react-native";
import VersionCheck from "react-native-version-check";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [updateRequired, setUpdateRequired] = useState(false);
  const [storeUrl, setStoreUrl] = useState(null);

  // Assign stored user data to redux
  const fnAssignUserData = async () => {
    const userData = await AsyncStorage.getItem("user_data");
    const obj = JSON.parse(userData);
    if (obj) {
      dispatch({ type: "UPDATE_PROFILE_USER_SUCCESS", payload: obj });
      dispatch({ type: "LOGIN_USER_SUCCESS", payload: obj });
    }
  };

  // Navigate after checks
const navigateAfterCheck = async () => {
  const userData = await getUserData();
  const fingerprintEnabled = await AsyncStorage.getItem("fingerprintEnabled");

  if (userData || isAuthenticated) {
    // Skip biometric for iOS
    if (Platform.OS === "ios") {
      navigation.replace("HomeScreen");
      return;
    }

    if (fingerprintEnabled === "true") {
      navigation.replace("BiometricScreen");
    } else {
      navigation.replace("HomeScreen");
    }
  } else {
    navigation.replace("LoginScreen");
  }
};

  // Version check logic
  const checkVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion();
      const currentVersion = VersionCheck.getCurrentVersion();

      const updateNeeded = await VersionCheck.needUpdate({
        currentVersion,
        latestVersion,
      });

      if (updateNeeded?.isNeeded) {
        const url = await VersionCheck.getStoreUrl();
        setStoreUrl(url);
        setUpdateRequired(true); // Show modal
      } else {
        navigateAfterCheck();
      }
    } catch (error) {
      console.log("Version check failed:", error);
      navigateAfterCheck(); // fallback if version check fails
    }
  };

  useEffect(() => {
    fnAssignUserData();
    const timer = setTimeout(() => {
      checkVersion();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdatePress = async () => {
    if (!storeUrl) return;

    const supported = await Linking.canOpenURL(storeUrl);
    if (supported) {
      await Linking.openURL(storeUrl);
    }
  };

  return (
    <View style={styles.splashContainer}>
      <LottieView
        source={require("../../assets/animations/spalshScreen.json")}
        style={{ width: wp(80), height: hp(55) }}
        autoPlay
        loop={false}
      />

      {/* Update Modal */}
      <Modal visible={updateRequired} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Required</Text>
            <Text style={styles.modalMessage}>
              A new version of the app is available. Please update to continue.
            </Text>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdatePress}
            >
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    width: wp(100),
    alignItems: "center",
    backgroundColor: "#ebecf1",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: wp(85),
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },

  modalMessage: {
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
    fontSize: 15,
    lineHeight: 20,
  },

  updateButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  updateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Splash;