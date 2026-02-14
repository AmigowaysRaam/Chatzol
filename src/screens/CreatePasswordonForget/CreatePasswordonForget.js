import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message'; // Import Toast
import { useDispatch } from "react-redux";
import { createPasswordOnForget } from "../../redux/authActions";
import ButtonComponent from "../../components/Button/Button";
import { COLORS } from "../../resources/Colors";
import { wp } from "../../resources/dimensions";

const CreatePasswordonForget = ({ navigation, route }) => {
  const dispatch = useDispatch();
  // const { emailParams } = route.params;

  const [otp, setOtp] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleNewPassword = () => {
    setShowNewPassword(prevState => !prevState);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(prevState => !prevState);
  };

  const setErrorAndLoading = (errorMessage) => {
    setPasscodeError(errorMessage);
    setLoading(false);
  };

  const handleChangePasscode = () => {
    setErrorAndLoading('')
    setLoading(true);
    // if (!otp) return setErrorAndLoading("OTP is required");
    if (!newPasscode) return setErrorAndLoading("New password is required");
    // if (newPasscode.length < ) return setErrorAndLoading("New password must be at least 4 characters long");
    if (!confirmPasscode) return setErrorAndLoading("Please confirm your password");
    if (newPasscode !== confirmPasscode) return setErrorAndLoading("New password does not match");

    setPasscodeError("");
    const payload = {
      emailParams,
      otp,
      password: newPasscode,
    };

    dispatch(
      createPasswordOnForget(payload, (response) => {
        setLoading(false);
        if (response.success) {
          Toast.show({
            text1: 'Success',
            text2: response.message,
            type: 'success',
          });

          setTimeout(() => {
            navigation.navigate("LoginScreen");
          }, 1000);
        } else {
          setErrorAndLoading(response.message);
          Toast.show({
            text1: 'Error',
            text2: response.message,
            type: 'error',
          });
        }
      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.black }]}>
      <Text style={[styles.title, { color: COLORS.white }]}>
        Create Password
      </Text>
      <Text style={[styles.description, { color: COLORS.white }]}>
        Please enter your OTP, and new password below.
      </Text>

      {/* <TextInput
        style={[styles.input, { color: COLORS.black, backgroundColor: COLORS.input_background }]}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholderTextColor={COLORS.placeholder}
        maxLength={6} // Assuming OTP length is 6
      /> */}

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { color: COLORS.black, backgroundColor: COLORS.input_background }]}
          placeholder="New Password"
          value={newPasscode}
          onChangeText={setNewPasscode}
          secureTextEntry={!showNewPassword}
          placeholderTextColor={COLORS.placeholder}
        />
        <TouchableOpacity onPress={handleToggleNewPassword} style={styles.eyeIcon}>
          <MaterialIcons
            name={showNewPassword ? "visibility-off" : "visibility"}
            size={24}
            color={COLORS.placeholder}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { color: COLORS.black, backgroundColor: COLORS.input_background }]}
          placeholder="Confirm Password"
          value={confirmPasscode}
          onChangeText={setConfirmPasscode}
          secureTextEntry={!showConfirmPassword}
          placeholderTextColor={COLORS.placeholder}
        />
        <TouchableOpacity onPress={handleToggleConfirmPassword} style={styles.eyeIcon}>
          <MaterialIcons
            name={showConfirmPassword ? "visibility-off" : "visibility"}
            size={24}
            color={COLORS.placeholder}
          />
        </TouchableOpacity>
      </View>

      {passcodeError ? (
        <Text style={{ color: COLORS.validation, marginHorizontal: wp(5) }}>
          {passcodeError}
        </Text>
      ) : null}

      <View style={{ alignItems: "center" }}>
        <ButtonComponent
          title={"Create Password"}
          isLoading={isLoading}
          onPress={handleChangePasscode}
        />
      </View>
      <Text>
        <Toast ref={(ref) => Toast.setRef(ref)} /> {/* Initialize Toast */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 24,
  },
  description: {
    marginBottom: wp(10),
    textAlign: "center",
    fontSize: 16,
  },
  input: {
    height: wp(10),
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp(5),
    marginBottom: wp(5)
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});

export default CreatePasswordonForget;
