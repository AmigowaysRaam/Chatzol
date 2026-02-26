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
          ? "Authenticate with Face ID"
          : type === "TouchID"
          ? "Authenticate with Touch ID"
          : "Authenticate with Biometrics";

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




// import React, { useEffect, useState } from "react";
// import { View, Text, Platform, TouchableOpacity, Image } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import ReactNativeBiometrics from "react-native-biometrics";
// import { useNavigation } from "@react-navigation/native";
// import { useDispatch } from "react-redux";
// import { logout } from "../redux/authActions";
// import Icon from "react-native-vector-icons/Ionicons";
// import { hp, wp } from "../resources/dimensions";
// import { COLORS } from "../resources/Colors";
// import { Louis_George_Cafe } from "../resources/fonts";

// const BiometricScreen = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const rnBiometrics = new ReactNativeBiometrics();

//   const [biometrySensors, setBiometrySensors] = useState([]);

//   useEffect(() => {
//     checkBiometricSensors();
//   }, []);

//   // Check available biometrics
//   const checkBiometricSensors = async () => {
//     try {
//       const { available, biometryType } = await rnBiometrics.isSensorAvailable();

//       if (!available) {
//         navigation.replace("LoginScreen");
//         return;
//       }

//       const sensors = [];

//       if (Platform.OS === "ios") {
//         if (biometryType === "FaceID") sensors.push("FaceID");
//         if (biometryType === "TouchID") sensors.push("TouchID");
//       } else {
//         // Android: "Biometrics" could mean fingerprint or face
//         // We'll check for enrolled biometrics
//         sensors.push("Fingerprint"); // Most Android devices support fingerprint
//         sensors.push("Face");        // Add Face if device supports it
//       }

//       setBiometrySensors(sensors);
//     } catch (error) {
//       console.log("Biometric check error:", error);
//       navigation.replace("LoginScreen");
//     }
//   };

//   const handleCancelButton = async () => {
//     await AsyncStorage.clear();
//     dispatch(logout());
//     navigation.replace("LoginScreen");
//   };

//   const authenticate = async (sensor) => {
//     try {
//       let promptMessage = "Authenticate with Biometrics";

//       if (sensor === "FaceID" || sensor === "Face") promptMessage = "Authenticate with Face ID";
//       if (sensor === "TouchID" || sensor === "Fingerprint") promptMessage = "Authenticate with Fingerprint";

//       const result = await rnBiometrics.simplePrompt({
//         promptMessage,
//         cancelButtonText: Platform.OS === "ios" ? "Cancel" : undefined,
//       });

//       if (result.success) {
//         navigation.replace("HomeScreen");
//       } else {
//         await handleCancelButton();
//       }
//     } catch (error) {
//       console.log("Biometric error:", error);
//       await handleCancelButton();
//     }
//   };

//   const getIconName = (sensor) => {
//     if (sensor === "FaceID" || sensor === "Face") return "face";
//     return "finger-print";
//   };

//   const getButtonText = (sensor) => {
//     if (sensor === "FaceID" || sensor === "Face") return "Login with Face ID";
//     return "Login with Fingerprint";
//   };
           


//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Image
//         resizeMode="contain"
//         source={require("../assets/animations/chatZol_logo.png")}
//         style={[
//           Louis_George_Cafe.bold.h2,
//           {
//             color: COLORS.white,
//             height: hp(40),
//           },
//         ]}
//       />

//       {biometrySensors.map((sensor) => (
//         <TouchableOpacity
//           key={sensor}
//           onPress={() => authenticate(sensor)}
//           style={{ marginTop: hp(2), alignItems: "center" }}
//         >
//           <Icon name={getIconName(sensor)} size={35} color={COLORS.white} />
//           <Text style={{ color: COLORS.white, marginTop: 5 }}>
//             {getButtonText(sensor)}
//           </Text>
//         </TouchableOpacity>
//       ))}

//       <TouchableOpacity
//         onPress={handleCancelButton}
//         style={{ marginTop: wp(15) }}
//       >
//         <Text style={{ color: COLORS.button_bg_color }}>
//           Login with Username Password
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default BiometricScreen;