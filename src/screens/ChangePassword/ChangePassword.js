import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Louis_George_Cafe } from "../../resources/fonts";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../redux/authActions";
import { useNavigation } from "@react-navigation/native";
import ButtonComponent from "../../components/Button/Button";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message'; // Import Toast

const ChangePasscode = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [oldPasscode, setOldPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const profile = useSelector((state) => state.auth.profile);

  const setErrorAndLoading = (errorMessage) => {
    setPasscodeError(errorMessage);
    setLoading(false);
  };

  const handleChangePasscode = () => {
    setLoading(true);

    if (!oldPasscode) return setErrorAndLoading("Old password is required");
    if (!newPasscode) return setErrorAndLoading("New password is required");
    if (!confirmPasscode) return setErrorAndLoading("Please confirm your password");
    if (newPasscode !== confirmPasscode) return setErrorAndLoading("New password does not match");

    setPasscodeError("");
    const payload = {
      currentpassword: oldPasscode,
      password: newPasscode,
      userid: profile._id,
    };
    dispatch(
      changePassword(payload, (response) => {
        setLoading(false);
        if (response.success) {

          Toast.show({
            text1: 'Success',
            text2: response.message || "Your passcode has been changed successfully!",
            type: 'success',
          });

          // Set a timeout before navigating back
          setTimeout(() => {
            navigation.goBack();
          }, 1000); // Adjust the timeout duration (in milliseconds) as needed

        } else {
          setErrorAndLoading(response.message || "Failed to change passcode.");
          Toast.show({
            text1: 'Error',
            text2: response.message || "Failed to change passcode.",
            type: 'error',
          });
        }

      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.black }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <Text style={[Louis_George_Cafe.bold.h3, styles.title, { color: COLORS.white }]}>
        Change Password
      </Text>
      <Text style={[Louis_George_Cafe.medium.h7, styles.description, { color: COLORS.white }]}>
        Please enter your old passcode and your new passcode below.
      </Text>
      <TextInput
        style={[styles.input, { color: COLORS.white, backgroundColor: COLORS.input_background }]}
        placeholder="Old Password"
        value={oldPasscode}
        onChangeText={setOldPasscode}
        secureTextEntry
        placeholderTextColor={COLORS.placeholder}
        accessibilityLabel="Old passcode input"
      />
      <TextInput
        style={[styles.input, { color: COLORS.white, backgroundColor: COLORS.input_background }]}
        placeholder="New Password"
        value={newPasscode}
        onChangeText={setNewPasscode}
        secureTextEntry
        placeholderTextColor={COLORS.placeholder}
        accessibilityLabel="New passcode input"
        maxLength={16} // Set maximum length to 4
      />
      <TextInput
        style={[styles.input, { color: COLORS.white, backgroundColor: COLORS.input_background }]}
        placeholder="Confirm Password"
        value={confirmPasscode}
        onChangeText={setConfirmPasscode}
        secureTextEntry
        placeholderTextColor={COLORS.placeholder}
        accessibilityLabel="Confirm passcode input"
        maxLength={16} // Set maximum length to 4
      />
      {passcodeError ? (
        <Text style={{ color: COLORS.validation, marginHorizontal: hp(3) }}>
          {passcodeError}
        </Text>
      ) : null}

      <View style={{ alignItems: "center" }}>
        <ButtonComponent
          title={"Change Password"}
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
  },
  title: {
    textAlign: "center",
  },
  description: {
    marginBottom: "15%",
    textAlign: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  input: {
    height: hp(6),
    width: wp(80),
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: hp(1),
    marginBottom: hp(1),
  },
});

export default ChangePasscode;
