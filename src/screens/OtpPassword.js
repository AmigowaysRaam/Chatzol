import React, { useEffect, useState, useRef } from 'react';
import {  View,  Image,  StyleSheet,  Text,  TouchableOpacity,  KeyboardAvoidingView,  Platform,  ActivityIndicator,
} from 'react-native';
import { hp, wp } from '../resources/dimensions';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { Louis_George_Cafe } from "../resources/fonts";
import { COLORS } from "../resources/Colors";
import ButtonComponent from "../components/Button/Button";

export default function OtpPassword() {
  const navigation = useNavigation();

  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [fullOtp, setFullOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const TEMP_OTP = "1212";

  const validatePhone = () => /^[6-9]\d{9}$/.test(phone);

  const handleSendOTP = () => {
    if (!validatePhone()) {
      alert("Enter valid 10 digit number");
      return;
    }
    setOtpSent(true);
    setOtpDigits(['', '', '', '']);
    setFullOtp('');
    setTimer(60);
  };

  /* ================= OTP VERIFY ================= */
  useEffect(() => {
    if (fullOtp.length === 4) {
      if (fullOtp === TEMP_OTP) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigation.replace("CreatePasswordonForget");
        }, 500);
      } else {
        alert("Invalid OTP");
        setOtpDigits(["", "", "", ""]);
        setFullOtp("");
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
    alert('OTP resent (temporary).');
  };

  /* ================= DIALPAD LOGIC ================= */
  const handleOtpPress = (digit) => {
    const updated = [...otpDigits];
    const emptyIndex = updated.findIndex(d => d === "");
    if (emptyIndex !== -1) {
      updated[emptyIndex] = digit;
      setOtpDigits(updated);
      setFullOtp(updated.join(""));
    }
  };

  const handleDelete = () => {
    const updated = [...otpDigits];
    for (let i = updated.length - 1; i >= 0; i--) {
      if (updated[i] !== "") {
        updated[i] = "";
        break;
      }
    }
    setOtpDigits(updated);
    setFullOtp(updated.join(""));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: COLORS.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        style={styles.splashLogo}
        source={require('../assets/logo.png')}
      />

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

          <ButtonComponent title={"Send OTP"} onPress={handleSendOTP} />
        </View>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text
            style={[
              Louis_George_Cafe.bold.h5,
              { color: COLORS.textPrimary, marginBottom: hp(4) },
            ]}
          >
            Enter OTP sent to {phone}
          </Text>

          <View style={styles.otpContainer}>
            {otpDigits.map((digit, index) => (
              <View key={index} style={styles.otpInput}>
                <Text style={{ fontSize: wp(5), color: COLORS.textPrimary }}>
                  {digit}
                </Text>
              </View>
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

          {loading && (
            <ActivityIndicator
              style={{ marginTop: hp(2) }}
              color={COLORS.button_bg_color}
            />
          )}

          <View style={styles.dialpadContainer}>
            <View style={styles.dialPadWrapper}>
              {[
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                ["del", "0", "Verify"],
              ].map((row, rowIndex) => (
                <View key={rowIndex} style={styles.dialRow}>
                  {row.map((item, index) => {
                    const isVerify = item === "Verify";
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.circleButton, isVerify && styles.sendButton]}
                        onPress={() => {
                          if (item === "del") handleDelete();
                          else if (item === "Verify") {
                            if (fullOtp.length === 4) {
                              if (fullOtp === TEMP_OTP) {
                                setLoading(true);
                                setTimeout(() => {
                                  setLoading(false);
                                  navigation.replace("CreatePasswordonForget");
                                }, 500);
                              } else {
                                alert("Invalid OTP");
                                setOtpDigits(["", "", "", ""]);
                                setFullOtp("");
                              }
                            } else {
                              alert("Enter complete 4-digit OTP");
                            }
                          } else {
                            handleOtpPress(item);
                          }
                        }}
                      >
                        <Text style={[styles.circleText, isVerify && styles.sendText]}>
                          {item === "del" ? "⌫" : item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },

  fieldContainer: {
    width: wp(90),
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "transparent",
    height: hp(6),
    width: "100%",
    marginBottom: hp(2),
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(70),
    marginBottom: wp(5),
  },

  otpInput: {
    width: wp(12),
    height: wp(12),
    borderWidth: wp(0.5),
    borderRadius: wp(2),
    borderColor: COLORS.button_bg_color,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },

  splashLogo: {
    height: hp(30),
    width: wp(70),
    resizeMode: "cover",
    marginVertical: wp(10),
  },

  dialpadContainer: {
    marginTop: hp(9),
    paddingVertical: wp(5),
    backgroundColor:"#E8EAED",
    width:wp(100)
  },

  dialPadWrapper: {
    alignItems: "center",
  },

  dialRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: wp(3),
  },

  circleButton: {
    width: wp(30),
    height: wp(12),
    borderRadius: wp(5),
    backgroundColor: "#e7caf0",
    justifyContent: "center",
    alignItems: "center",
  },

  circleText: {
    fontSize: 22,
    color: "#661480",
    fontWeight: "600",
  },

  sendButton: {
    backgroundColor: COLORS.button_bg_color,
  },

  sendText: { 
    color: "#fff",
    fontWeight: "700",
  },
});