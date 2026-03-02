import React, { useState } from "react";
import {  View,  Text,  TextInput,  TouchableOpacity,  StyleSheet,  KeyboardAvoidingView,  Platform,} from "react-native";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../redux/authActions";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import HeaderBar from "../../ScreenComponents/HeaderComponent/HeaderComponent";


  const InputField = ({
    label,
    value,
    onChangeText,
    secure,
    toggleSecure,
    show,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          style={styles.input}
          placeholder={`Enter ${label}`}
          placeholderTextColor="#777"
        />

        <TouchableOpacity onPress={toggleSecure}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
    </View>
  );


const ChangePasscode = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const profile = useSelector((state) => state.auth.profile);

  const [oldPasscode, setOldPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePasscode = () => {
    setLoading(true);

    if (!oldPasscode || !newPasscode || !confirmPasscode) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (newPasscode.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    setError("");

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
            type: "success",
            text1: "Password Updated",
            text2: response.message || "Your password was changed successfully",
          });

          setTimeout(() => navigation.goBack(), 1200);
        } else {
          setError(response.message || "Failed to change password");
          Toast.show({
            type: "error",
            text1: "Error",
            text2: response.message,
          });
        }
      })
    );
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      {/* Header */}
      <HeaderBar title="Change Password" showBackArrow/>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>
          Update your password to keep your account secure.
        </Text>

        <InputField
          label="Old Password"
          value={oldPasscode}
          onChangeText={setOldPasscode}
          show={showOld}
          toggleSecure={() => setShowOld(!showOld)}
        />


        <InputField
          label="New Password"
          value={newPasscode}
          onChangeText={setNewPasscode}
          show={showNew}
          toggleSecure={() => setShowNew(!showNew)}
        />

        <InputField
          label="Confirm Password"
          value={confirmPasscode}
          onChangeText={setConfirmPasscode}
          show={showConfirm}
          toggleSecure={() => setShowConfirm(!showConfirm)}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleChangePasscode}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default ChangePasscode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    marginTop: hp(6),
    marginHorizontal: wp(6),
    backgroundColor: "#e7caf0",
    borderRadius: 20,
    padding: wp(6),
  },

  subtitle: {
    color: "#661480",
    fontSize: 13,
    marginBottom: hp(3),
  },

  inputContainer: {
    marginBottom: hp(2),
  },

  label: {
    color: "#661480",
    fontSize: 13,
    marginBottom: hp(0.8),
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8EAED",
    borderRadius: 12,
    paddingHorizontal: wp(4),
  },

  input: {
    flex: 1,
    color: "#000",
    height: hp(6),
  },

  error: {
    color: "#FF4D4D",
    marginTop: hp(1),
    fontSize: 13,
  },

  button: {
    marginTop: hp(3),
    backgroundColor: COLORS.button_bg_color,
    paddingVertical: hp(1.8),
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
