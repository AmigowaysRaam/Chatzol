import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe, width } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";
import { loginUser } from "../../redux/authActions";
import ButtonComponent from "../../components/Button/Button";
import TextInputComponent from "../../components/TextInput/TextInput";
import Icon from "react-native-vector-icons/Ionicons";
import messaging from '@react-native-firebase/messaging';
import getFCMToken from "../../getFcmToken";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState(__DEV__ ? "gow" : "");
  const [password, setPassword] = useState(__DEV__ ? "1212" : "");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, error, lerror } = useSelector((state) => state.auth);
  const [fcmtoken, setfcmTorkn] = useState(null);

  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");



  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  const handleLogin = async () => {

    // alert(fcmTorkn)
    if (!username) {
      setUsernameErr('User Name must not be Empty')
      return;
    }
    if (!password) {
      setPasswordErr('Password must not be Empty')
      // Alert.alert("Validation Error", "Please fill in both username and password.", [{ text: "OK" }]);
      return;
    }
    setIsLoading(true);
    const credentials = { username, password, fcmtoken };
    dispatch(loginUser(credentials, fcmtoken, (response) => {
      if (response) {
        AsyncStorage.setItem('user_data', JSON.stringify(response));
        setIsLoading(false);
      }
      else {
        setIsLoading(false);
      }
    }));

  }

  useEffect(() => {


    const fetchFCMToken = async () => {
      try {
        // Request permission (if not done previously)
        await messaging().requestPermission();

        // Get the FCM token
        const token = await messaging().getToken();
        console.log('FCM Token::', token);
        setfcmTorkn(token)

        // Save token to AsyncStorage (or state) for later use
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };

    fetchFCMToken();
    return () => { };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const saveLoginDetails = async () => {
        try {
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
        } catch (error) {
          console.error("Failed to save login details:", error);
        }
      };
      saveLoginDetails();
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (lerror) {
      setIsLoading(false);
      setPasswordErr('');
      setUsernameErr('');
      Toast.show({
        text1: lerror,
        type: 'error',
        position: 'top',
      });
    }
  }, [lerror]);

  const handleForgot = () => {

    navigation.navigate("ForgotPassword");
  };

  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <View style={styles.container}>
      <Toast />
      <View >
        <Image
          resizeMode="contain"
          source={require('../../../src/assets/animations/chatZol_logo.png')}
          style={[
            Louis_George_Cafe.bold.h2,
            {
              color: COLORS.white,
              height: hp(30)
            },
          ]}
        >
        </Image>
      </View>

      <TextInputComponent
        style={[styles.input, { backgroundColor: COLORS.input_background }]}
        title="Enter Username or Email"
        value={username}
        onChangeText={setUsername}
      />

      {
        usernameErr &&
        <Text style={[Louis_George_Cafe.regular.h8, { color: "red", fontFamily: "Louis_George_Cafe_Bold" }]}>
          {usernameErr}
        </Text>
      }

      <View style={styles.passwordContainer}>
        <TextInputComponent
          style={[styles.input, { backgroundColor: COLORS.input_background }]}
          title="Password"
          value={password}
          maxLength={16}
          secureTextEntry={!isPasswordVisible}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {
        passwordErr &&
        <Text style={[Louis_George_Cafe.regular.h8, { color: "red", fontFamily: "Louis_George_Cafe_Bold" }]}>
          {passwordErr}
        </Text>
      }
      <TouchableOpacity onPress={handleForgot}>
        <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.white,  padding: wp(4) }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <ButtonComponent
        title={"Log In"}
        isLoading={isLoading}
        onPress={handleLogin}
      />

      <TouchableOpacity onPress={() => handleRegister()}>
        <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.white, marginTop: hp(2) }]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    padding: wp(2),
    backgroundColor: COLORS.black,
  },
  input: {
    width: wp(80),
    height: hp(6),
    marginTop: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: wp(80),
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
});

export default LoginScreen;