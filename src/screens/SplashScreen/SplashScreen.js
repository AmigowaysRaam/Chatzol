import React, { useEffect } from "react";
import { View, StyleSheet, Alert, Linking, Platform } from "react-native";
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

  const fnAssignUserData = async () => {
    const userData = await AsyncStorage.getItem("user_data");
    const obj = JSON.parse(userData);
    Alert.alert("", JSON.stringify(obj))
    if (obj) {
      dispatch({ type: "UPDATE_PROFILE_USER_SUCCESS", payload: obj });
      dispatch({ type: "LOGIN_USER_SUCCESS", payload: obj });
    }
  };

  const navigateAfterCheck = async () => {
    const userData = await getUserData();
    if (userData || isAuthenticated) {
      navigation.replace("HomeScreen");
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  const checkVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion();
      const currentVersion = VersionCheck.getCurrentVersion();
      console.log("Latest Version:", latestVersion);
      console.log("Current Version:", currentVersion);

      const updateNeeded = await VersionCheck.needUpdate({
        currentVersion,
        latestVersion,
      });

      if (updateNeeded?.isNeeded) {
        Alert.alert(
          "Update Required",
          "A new version of the app is available. Please update to continue.",
          [
            {
              text: "Update Now",
              onPress: async () => {
                try {
                  const storeUrl = await VersionCheck.getStoreUrl();
                  if (storeUrl && typeof storeUrl === "string") {
                    const supported = await Linking.canOpenURL(storeUrl);
                    if (supported) {
                      await Linking.openURL(storeUrl);
                    } else {
                      Alert.alert("Error", "Unable to open the store URL.");
                    }
                  } else {
                    Alert.alert("Error", "Store URL is invalid or not available.");
                  }
                } catch (error) {
                  console.error("Error opening store URL:", error);
                  Alert.alert(
                    "Error",
                    "An error occurred while trying to open the app store."
                  );
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.log("App is up to date.");
        navigateAfterCheck(); // Navigate only if app is up to date
      }
    } catch (error) {
      console.error("Error checking version:", error);
      navigateAfterCheck(); // Navigate if version check fails (optional fallback)
    }
  };

  useEffect(() => {
    fnAssignUserData();
    const timer = setTimeout(() => {
      checkVersion();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <LottieView
        source={require("../../assets/animations/spalshScreen.json")}
        style={{ width: wp(80), height: hp(55) }}
        autoPlay
        loop={false}
      />
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
});

export default Splash;
