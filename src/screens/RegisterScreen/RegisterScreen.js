import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../resources/dimensions";
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
  const dispatch = useDispatch();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const fnAlert = (message) => {
    Toast.show({
      text1: "Error",
      text2: message,
      type: "error",
    });
  };

  const handleRegister = () => {
    Keyboard.dismiss();

    const regEmail =
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    const regPhone = /^[0-9]{10}$/;
    const regPassword =
      /^[A-Za-z\d@$!%*?&]{4,16}$/;

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

    // if (!email.trim()) {
    //   errorsTemp.email = "Email is required";
    //   isValid = false;
    // } else if (!regEmail.test(email)) {
    //   errorsTemp.email = "Invalid email format";
    //   isValid = false;
    // }

    if (!phonenumber.trim()) {
      errorsTemp.phonenumber = "Phone number is required";
      isValid = false;
    } else if (!regPhone.test(phonenumber)) {
      errorsTemp.phonenumber =
        "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (!password.trim()) {
      errorsTemp.password = "Password is required";
      isValid = false;
    } else if (!regPassword.test(password)) {
      errorsTemp.password =
        "Password must be between 4 and 16 characters";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      errorsTemp.confirmPassword =
        "Please confirm your password";
      isValid = false;
    } else if (confirmPassword !== password) {
      errorsTemp.confirmPassword =
        "Passwords do not match";
      isValid = false;
    }

    setErrors(errorsTemp);

    if (!isValid) return;

    setIsLoading(true);

    const userData = {
      fullname,
      username,
      email,
      phonenumber,
      password,
    };

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
                  AsyncStorage.setItem(
                    "user_data",
                    JSON.stringify(loginResponse.data)
                  );
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "HomeScreen" }],
                  });
                }
              })
            );
          }, 1000);
        } else {
          fnAlert(response.message);
        }
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
       

        {/* Header */}
        <View style={styles.topSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us and start your journey today
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <TextInputComponent
            title="Full Name"
            maxLength={20}
            value={fullname}
            onChangeText={(text) => {
              const filtered = text.replace(
                /[^a-zA-Z\s]/g,
                ""
              );
              setFullname(filtered);
              setErrors((prev) => ({
                ...prev,
                fullname: "",
              }));
            }}
          />
          {errors.fullname ? (
            <Text style={styles.error}>
              {errors.fullname}
            </Text>
          ) : null}

          <TextInputComponent
            title="Username"
            maxLength={20}
            value={username}
            onChangeText={(text) => {
              const filtered = text.replace(
                /[^a-zA-Z0-9_]/g,
                ""
              );
              setUsername(filtered);
              setErrors((prev) => ({
                ...prev,
                username: "",
              }));
            }}
          />
          {errors.username ? (
            <Text style={styles.error}>
              {errors.username}
            </Text>
          ) : null}

          <TextInputComponent
            title="Email   (optional)"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text.trim());
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }}
          />
          {errors.email ? (
            <Text style={styles.error}>
              {errors.email}
            </Text>
          ) : null}

          <TextInputComponent
            title="Phone Number"
            keyboardType="phone-pad"
            value={phonenumber}
            maxLength={10}
            onChangeText={(text) => {
              const filtered =
                text.replace(/\D/g, "");
              setPhonenumber(filtered);
              setErrors((prev) => ({
                ...prev,
                phonenumber: "",
              }));
            }}
          />
          {errors.phonenumber ? (
            <Text style={styles.error}>
              {errors.phonenumber}
            </Text>
          ) : null}

          {/* Password */}
          <View style={styles.passwordWrapper}>
            <TextInputComponent
              title="Password"
              value={password}
              secureTextEntry={!isPasswordVisible}
              onChangeText={(text) => {
                setPassword(text.trim());
                setErrors((prev) => ({
                  ...prev,
                  password: "",
                }));
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <Icon
                name={
                  isPasswordVisible
                    ? "eye-off"
                    : "eye"
                }
                size={22}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.error}>
              {errors.password}
            </Text>
          ) : null}

          {/* Confirm Password */}
          <View style={styles.passwordWrapper}>
            <TextInputComponent
              title="Confirm Password"
              value={confirmPassword}
              secureTextEntry={
                !isConfirmPasswordVisible
              }
              onChangeText={(text) => {
                setConfirmPassword(text.trim());
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={
                toggleConfirmPasswordVisibility
              }
            >
              <Icon
                name={
                  isConfirmPasswordVisible
                    ? "eye-off"
                    : "eye"
                }
                size={22}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.error}>
              {errors.confirmPassword}
            </Text>
          ) : null}

         <TouchableOpacity
  onPress={handleRegister}
  activeOpacity={0.8}
  style={styles.registerButton}
  disabled={isLoading}
>
  <Text style={styles.registerButtonText}>
    {isLoading ? "Loading..." : "Register"}
  </Text>
</TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.bottomContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LoginScreen")
            }
          >
            <Text style={styles.loginLink}>
              {" "}
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
       <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContent: {
    padding: wp(6),
    paddingBottom: hp(5),
  },
  topSection: {
    marginTop: hp(3),
    marginBottom: hp(4),
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#e7caf0",
    borderRadius: 18,
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  error: {
    color: COLORS.validation,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 12,
  },
  passwordWrapper: {
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: wp(3),
    top: wp(6),
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(4),
  },
  loginText: {
    color: "#aaa",
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
 registerButton: {
  backgroundColor: COLORS.button_bg_color,
  paddingVertical: wp(3),
  borderRadius: wp(10),
  alignItems: "center",
  justifyContent: "center",
  marginTop: hp(3),
  width: "70%", // full width inside card
  alignSelf: "center",
},
registerButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
});

export default RegisterScreen;
