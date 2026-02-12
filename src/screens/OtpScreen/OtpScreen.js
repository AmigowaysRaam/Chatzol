import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
// import { verifyOtp } from "../redux/actions/authActions";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";

const OtpScreen = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      dispatch(verifyOtp(otp))
        .then(() => {
          Alert.alert("Success", "OTP Verified!");
        })
        .catch((error) => {
          Alert.alert("Error", "Invalid OTP.");
        });
    } else {
      Alert.alert("Error", "OTP must be 6 digits.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[Louis_George_Cafe.bold.h2, styles.header]}>Enter OTP</Text>
      <Text style={styles.infoText}>
        We have sent an OTP to your registered email. Please enter it below.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.black,
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    color: COLORS.white,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: COLORS.input_background,
    paddingHorizontal: 10,
    borderRadius: 8,
    textAlign: "center",
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.button_bg_color,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default OtpScreen;
