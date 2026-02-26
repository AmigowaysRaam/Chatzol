import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";
import { loginUser, registerUser } from "../../redux/authActions";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import TextInputComponent from "../../components/TextInput/TextInput";
import ButtonComponent from "../../components/Button/Button";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const resetForm = () => {
    setFullname("");
    setUsername("");
    setEmail("");
    setPhonenumber("");
    setPassword("");
    setConfirmPassword("");
  };

  const fnAlert = (message) => {
    Toast.show({
      text1: "Error",
      text2: message,
      type: "error",
    });
  };

  const handleRegister = () => {
    Keyboard.dismiss();

    const regEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    const regPhone = /^[0-9]{10}$/;
    const regPassword = /^[A-Za-z\d@$!%*?&]{4,16}$/;

    let errorsTemp = {
      fullname: "",
      username: "",
      email: "",
      phonenumber: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!fullname.trim()) {
      errorsTemp.fullname = "Full name is required";
      isValid = false;
    }
    if (!username.trim()) {
      errorsTemp.username = "Username is required";
      isValid = false;
    }
    if (!email.trim()) {
      errorsTemp.email = "Email is required";
      isValid = false;
    } else if (!regEmail.test(email)) {
      errorsTemp.email = "Invalid email format";
      isValid = false;
    }
    if (!phonenumber.trim()) {
      errorsTemp.phonenumber = "Phone number is required";
      isValid = false;
    } else if (!regPhone.test(phonenumber)) {
      errorsTemp.phonenumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }
    if (!password.trim()) {
      errorsTemp.password = "Password is required";
      isValid = false;
    } else if (!regPassword.test(password)) {
      errorsTemp.password = "Password must be between 4 and 16 characters";
      isValid = false;
    }
    if (!confirmPassword.trim()) {
      errorsTemp.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (confirmPassword !== password) {
      errorsTemp.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(errorsTemp);

    if (isValid) {
      setIsLoading(true);
      const userData = { fullname, username, email, phonenumber, password };
      dispatch(
        registerUser(userData, (response) => {
          setIsLoading(false);
          if (response.success) {
            Toast.show({
              text1: "Success",
              text2: response.message,
              type: "success",
            });
            setTimeout(() => {
              dispatch(
                loginUser({ username, password }, (loginResponse) => {
                  if (loginResponse) {
                    AsyncStorage.setItem("user_data", JSON.stringify(loginResponse.data));
                    navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
                  }
                })
              );
            }, 1000);
          } else {
            fnAlert(response.message);
          }
        })
      );
    } else {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Toast />

      <Text style={[Louis_George_Cafe.bold.h2, styles.header]}>Create Account</Text>

      <TextInputComponent
        maxLength={20}
        title="Full Name"
        value={fullname}
        onChangeText={(text) => {
          const filtered = text.replace(/[^a-zA-Z\s]/g, "");
          setFullname(filtered);
          setErrors((prev) => ({ ...prev, fullname: null }));
        }}
      />
      {errors.fullname ? <Text style={styles.error}>{errors.fullname}</Text> : null}

      <TextInputComponent
        maxLength={20}
        title="Username"
        value={username}
        onChangeText={(text) => {
          const filtered = text.replace(/[^a-zA-Z0-9_]/g, "");
          setUsername(filtered);
          setErrors((prev) => ({ ...prev, username: null }));
        }}
      />
      {errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}

      <TextInputComponent
        title="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          const filtered = text.trim();
          setEmail(filtered);
          const regEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
          setErrors((prev) => ({ ...prev, email: filtered && !regEmail.test(filtered) ? "Invalid email format" : "" }));
        }}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <TextInputComponent
        title="Phone Number"
        keyboardType="phone-pad"
        value={phonenumber}
        maxLength={10}
        onChangeText={(text) => {
          const filtered = text.replace(/\D/g, "");
          if (filtered.length <= 10) {
            setPhonenumber(filtered);
            setErrors((prev) => ({ ...prev, phonenumber: null }));
          }
        }}
      />
      {errors.phonenumber ? <Text style={styles.error}>{errors.phonenumber}</Text> : null}

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInputComponent
          title="Password"
          maxLength={16}
          value={password}
          secureTextEntry={!isPasswordVisible}
          onChangeText={(text) => {
            setPassword(text.trim());
            setErrors((prev) => ({ ...prev, password: null }));
          }}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      {/* Confirm Password */}
      <View style={styles.passwordContainer}>
        <TextInputComponent
          title="Confirm Password"
          maxLength={16}
          value={confirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
          onChangeText={(text) => {
            setConfirmPassword(text.trim());
            setErrors((prev) => ({ ...prev, confirmPassword: null }));
          }}
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}

      <ButtonComponent title="Register" isLoading={isLoading} onPress={handleRegister} />

      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  scrollContent: { alignItems: "center", paddingHorizontal: wp(8), paddingVertical: hp(5) },
  header: { fontSize: 28, marginBottom: hp(4), color: COLORS.white, textAlign: "center" },
  error: { color: COLORS.validation, alignSelf: "flex-start", marginTop: 5, marginBottom: 10 },
  passwordContainer: { width: "100%", position: "relative", marginBottom: hp(2) },
  eyeIcon: { position: "absolute", right: wp(7), top: wp(6) },
  loginTextContainer: { flexDirection: "row", marginTop: hp(3) },
  loginText: { color: COLORS.white, fontSize: 14 },
  loginLink: { color: COLORS.primary, fontSize: 14, fontWeight: "bold" },
});

export default RegisterScreen;