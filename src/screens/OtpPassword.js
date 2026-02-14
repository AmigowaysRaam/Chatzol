import React, { useEffect, useRef, useState } from 'react';
import {
  View,Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { MaterialIcon } from "@expo/vector-icons";
import { Louis_George_Cafe } from "../resources/fonts";
import { COLORS } from "../resources/Colors";
import ButtonComponent from "../components/Button/Button"
 
export default function OtpPassword() {
  const navigation = useNavigation();

  // Phone & OTP state
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [fullOtp, setFullOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const TEMP_OTP = '1212'; // Temporary OTP

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Validate 10-digit phone
  const validatePhone = () => /^[6-9]\d{9}$/.test(phone);

  const handleSendOTP = () => {
    if (!validatePhone()) {
      alert('Enter a valid 10-digit phone number.');
      return;
    }
    setOtpSent(true);
    setOtpDigits(['', '', '', '']);
    setFullOtp('');
    setTimer(60);
  };

  // Handle OTP input change
  const handleChangeText = (text, index) => {
    const updatedOtp = [...otpDigits];
    updatedOtp[index] = text;
    setOtpDigits(updatedOtp);

    if (text && index < 3) inputRefs[index + 1].current?.focus();
    if (!text && index > 0) inputRefs[index - 1].current?.focus();

    // Update full OTP state
    setFullOtp(updatedOtp.join(''));
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Verify OTP once fullOtp changes
  useEffect(() => {
    if (fullOtp.length === 4) {
      Keyboard.dismiss();
      if (fullOtp === TEMP_OTP) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          alert('OTP verified successfully!');
          navigation.replace('CreatePasswordonForget'); // Navigate to next page
        }, 500);
      } else {
        alert('Invalid OTP!');
        setOtpDigits(['', '', '', '']);
        setFullOtp('');
        inputRefs[0].current?.focus();
      }
    }
  }, [fullOtp]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleResendOTP = () => {
    setOtpDigits(['', '', '', '']);
    setFullOtp('');
    setTimer(60);
    inputRefs[0].current?.focus();
    alert('OTP resent (temporary).');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: COLORS.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View>
        <Image style={styles.splashLogo} source={require('../assets/logo.png')} />
        {/* <Image style={styles.logoCircle} source={IMAGE_ASSETS.logo_circle} /> */}
      </View>
      {!otpSent ? (
        
          
         <View style={styles.fieldContainer}>
          <TextInput
            maxLength={10}
            placeholder="Enter Mobile Number"
            mode="outlined"
            style={styles.input}
            right={
              <TextInput.Icon
                icon="arrow-right"
                onPress={handleSendOTP}
                color={COLORS.textPrimary}
              />
            }
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            activeOutlineColor={COLORS.textPrimary}
            textColor={COLORS.textPrimary}
          />
         
           <ButtonComponent  title={"Send Otp"}
             onPress={handleSendOTP} />
         
        </View>

      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={[Louis_George_Cafe.bold.h5, { color: COLORS.textPrimary, marginBottom: hp(2) }]}>
            Enter the 4-digit OTP sent to {phone}
          </Text>
          <View style={styles.otpContainer}>
            {otpDigits.map((digit, index) => (
              <RNTextInput
                key={index}
                ref={inputRefs[index]}
                style={[styles.otpInput, { borderColor: COLORS.button_bg_color, color: COLORS.textPrimary }]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>
          {timer > 0 ? (
            <Text style={{ color: COLORS.textPrimary }}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={{ color: COLORS.button_bg_color, marginTop: hp(1.5) }}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
          {loading && <ActivityIndicator style={{ marginTop: hp(2) }} color={COLORS.button_bg_color} />}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', },
  fieldContainer: { width: wp(90), alignItems: 'center',justifyContent: 'center' },
  input: { backgroundColor: 'transparent', height: hp(6), width: wp(80) },
  sendOtpButton: {
    backgroundColor: COLORS.button_bg_color,
    height: hp(5),
    width: wp(60),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(70),
    marginBottom: hp(2),
  },
  otpInput: {
    width: wp(14),
    height: wp(14),
    borderWidth: wp(0.6),
    borderRadius: 8,
    textAlign: 'center',
    fontSize: wp(5),
  },
  splashLogo: {
    height: hp(40),
    width: wp(90), resizeMode: 'cover',marginBottom:wp(20)
  },
  logoCircle: {
    height: hp(12),
    width: hp(12), alignSelf: 'center',
    position: 'relative', bottom: hp(5),
    resizeMode: 'contain',
  },
});
