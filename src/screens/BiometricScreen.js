import React, { useEffect, useState } from "react";
import { View, Text, Platform, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBiometrics from "react-native-biometrics";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authActions";
import Icon from "react-native-vector-icons/Ionicons";
import { hp, wp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import { Louis_George_Cafe } from "../resources/fonts";

const BiometricScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const rnBiometrics = new ReactNativeBiometrics();

  const [biometryType, setBiometryType] = useState(null);

  useEffect(() => {
    checkBiometricType();
  }, []);

  const checkBiometricType = async () => {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();

      if (!available) {
        navigation.replace("LoginScreen");
        return;
      }

      setBiometryType(biometryType);
      authenticate(biometryType);
    } catch (error) {
      console.log("Biometric check error:", error);
      navigation.replace("LoginScreen");
    }
  };

  const handleCancelButton = async () => {
    await AsyncStorage.clear();
    dispatch(logout());
    navigation.replace("LoginScreen");
  };

  const authenticate = async (type) => {
    try {
      const promptMessage =
        type === "FaceID"
          ? "Unlock with Face ID"
          : type === "TouchID"
          ? "Unlock with Touch ID"
          : "Unlock Chatzol with fingerprint";

      const result = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: Platform.OS === "ios" ? "Cancel" : undefined,
      });

      if (result.success) {
        navigation.replace("HomeScreen");
      } else {
        if (Platform.OS === "ios") {
          await handleCancelButton();
        }
      }
    } catch (error) {
      console.log("Biometric error:", error);

      const isUserCancel =
        Platform.OS === "ios" &&
        error?.message?.includes("User canceled");

      if (isUserCancel) {
        await handleCancelButton();
      }
    }
  };

  

  const getIconName = () => {
    if (biometryType === "FaceID") return "face";
    if (biometryType === "TouchID") return "finger-print";
    return "finger-print"; 
  };

  const getButtonText = () => {
    if (biometryType === "FaceID") return "Login with Face ID";
    if (biometryType === "TouchID") return "Login with Touch ID";
    return "Login with Biometrics";
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        resizeMode="contain"
        source={require("../assets/animations/chatZol_logo.png")}
        style={[
          Louis_George_Cafe.bold.h2,
          {
            color: COLORS.white,
            height: hp(40),
          },
        ]}
      />

      {biometryType && (
        <TouchableOpacity
          onPress={() => authenticate(biometryType)}
          style={{ marginTop: hp(2), alignItems: "center" }}
        >
          <Icon name={getIconName()} size={35} color={COLORS.white} />
          <Text style={{ color: COLORS.white, marginTop: 5 }}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleCancelButton}
        style={{ marginTop: wp(15) }}
      >
        <Text style={{ color: COLORS.button_bg_color }}>
          Login with Username Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BiometricScreen;
