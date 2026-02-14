import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  // TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { Louis_George_Cafe } from "../../resources/fonts";
import { wp, hp } from "../../resources/dimensions";
import { useFonts } from "expo-font";
import { COLORS } from "../../resources/Colors";
import { useDispatch } from "react-redux";
import { checkEmailRequest } from "../../redux/authActions";
import Toast from 'react-native-toast-message'; // Import Toast
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";


const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [mailErr, setEmailError] = useState("");
  const dispatch = useDispatch();

  // const { theme } = useTheme();

  const handleToSignIn = () => {
    Keyboard.dismiss()
    var emailValid = false;
    const reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (email.length == 0) {
      setEmailError("Email is required");
    } else if (reg.test(email) === false) {
      setEmailError("Email format is incorrect");
    } else {
      setEmailError("");
      emailValid = true;
    }
     navigation.navigate('CreatePasswordonForget', { emailParams: email });

    if (emailValid) {
      dispatch(
        checkEmailRequest(email, (response) => {
           navigation.navigate('CreatePasswordonForget', { emailParams: email });
          if (response.success) {
            alert(JSON.stringify(response))
             Toast.show({
               text1: 'Success',
               text2: response.message,
               type: 'success',
             });
            setTimeout(() => {
               navigation.navigate('CreatePasswordonForget', { emailParams: email });
             }, 1000);
          }
          else {
              navigation.navigate('CreatePasswordonForget', { emailParams: email });
            Toast.show({
              text1: 'Error',
              text2: response.message,
              type: 'error',
            });
          }
        })
      );
    }
  };

  // useEffect(() => {
  //   Toast.show({
  //     text1: 'Error',
  //     text2: "response.message",
  //     type: 'error',
  //   });
  // }, [])

  return (
    <>
      <LinearGradient
        colors={["#F0F0F0", "#FFF"]}
        style={[styles.headContainer, {
          flexDirection: "row",
          alignItems: "center",
          padding: wp(5),
        }]}
      >
        {/* Back Icon on the left */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            // padding: wp(5),
          }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* Title text horizontally centered */}
        <Text
          style={[
            Louis_George_Cafe.bold.h5,
            {
              color: COLORS.white,
              textAlign: 'center',
              flex: 1, // This ensures the text takes up remaining space and centers it
            },
          ]}
        >
          Forgot Password
        </Text>
      </LinearGradient>
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.black }]}>
        <Text style={{
          textAlign: 'center',
          zIndex: 99999
        }}>
          <Toast /> {/* Initialize Toast */}
        </Text>
        <Text
          style={[
            Louis_George_Cafe.bold.h3,
            styles.title,
            { color: COLORS.white },
            // { color: COLORS[theme].textPrimary },
            { fontFamily: "Louis George Cafe Bold" },
          ]}
        >
          Forgot Password
        </Text>
        <Text
          style={[
            Louis_George_Cafe.medium.h7,
            styles.description,
            { color: COLORS.white },
          ]}
        >
          Enter your email address below, and we will send you a link to reset
          your password.
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: COLORS.white,
              backgroundColor: COLORS.backgroundColor,
            },
          ]}
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={{ color: COLORS.validation, marginHorizontal: hp(3) }}>
          {mailErr}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.button_bg_color }]}
          onPress={handleToSignIn}
        >
          <Text
            style={[
              Louis_George_Cafe.bold.h7,
              styles.buttonText,
              { color: COLORS.black },
            ]}
          >
            Reset Password
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    padding: wp(3),
    alignItems: "center"
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginVertical: wp(5),
    width: wp(95)
  },
  input: {
    width: wp(80),
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp(5),
    marginBottom: 10,
  },

  button: {
    width: wp(70),
    borderRadius: wp(10),
    alignSelf: "center",
    marginTop: hp(8),
  },
  buttonText: {
    alignItems: "center",
    marginVertical: hp(2),
    textAlign: "center",
  },
});

export default ForgotPassword;
