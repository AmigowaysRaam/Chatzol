import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { wp, hp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import HeaderBar from "../ScreenComponents/HeaderComponent/HeaderComponent";
import { Louis_George_Cafe } from "../resources/fonts";
// import { deleteAccount } from "../redux/authActions";

const DeleteAccountScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.profile);

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeletePress = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setLoading(true);

    const payload = {
      userid: user?._id,
      reason: reason,
    };

    // 🔥 Uncomment when API ready
    /*
    dispatch(
      deleteAccount(payload, (response) => {
        setLoading(false);
        setShowConfirm(false);

        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Account Deleted",
            text2: "Your account has been permanently deleted.",
          });

          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          }, 1500);
        } else {
          setError(response.message || "Failed to delete account");
          Toast.show({
            type: "error",
            text1: "Error",
            text2: response.message,
          });
        }
      })
    );
    */

    // TEMP simulation
    setTimeout(() => {
      setLoading(false);
      setShowConfirm(false);
      Toast.show({
        type: "success",
        text1: "Account Deleted (Demo)",
      });
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <HeaderBar title="Account Deletion" showBackArrow />

      <View style={styles.card}>
        <Ionicons name="warning-outline" size={wp(18)} color="red" />

        <Text style={[styles.warningText, Louis_George_Cafe.bold.h2]}>
          Deleting your account will permanently remove:
        </Text>

        <Text style={[styles.bullet, Louis_George_Cafe.medium.h5]}>
          • Your profile
        </Text>
        <Text style={[styles.bullet, Louis_George_Cafe.medium.h5]}>
          • Messages & media
        </Text>
        <Text style={[styles.bullet, Louis_George_Cafe.medium.h5]}>
          • Groups & communities
        </Text>
        <Text style={[styles.bullet, Louis_George_Cafe.medium.h5]}>
          • All saved data
        </Text>

        <TextInput
          placeholder="Reason for leaving (optional)"
          placeholderTextColor="#777"
          value={reason}
          onChangeText={setReason}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.deleteButton, loading && { opacity: 0.6 }]}
          onPress={handleDeletePress}
          disabled={loading}
        >
          <Text style={styles.deleteText}>Delete My Account</Text>
        </TouchableOpacity>
      </View>

      {/*  Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => !loading && setShowConfirm(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Ionicons
              name="alert-circle-outline"
              size={wp(12)}
              color={COLORS.validation}
              style={{ marginBottom: wp(3) }}
            />

            <Text style={styles.modalTitle}>
              Confirm Account Deletion
            </Text>

            <Text style={styles.modalText}>
              This action is permanent and cannot be undone.
              Are you sure you want to delete your account?
            </Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.validation}
                style={{ marginTop: wp(4) }}
              />
            ) : (
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.deactivateBtn]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.deleteModalText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  card: {
    marginTop: hp(5),
    marginHorizontal: wp(6),
    backgroundColor: "#FFEBEE",
    borderRadius: 20,
    padding: wp(6),
    alignItems: "center",
  },

  warningText: {
    color: "#000",
    marginTop: hp(1),
    marginBottom: hp(2),
    textAlign: "center",
  },

  bullet: {
    color: "#444",
    alignSelf: "flex-start",
    marginLeft: wp(4),
    marginBottom: hp(0.5),
  },

  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: "#ddd",
  },

  deleteButton: {
    marginTop: hp(3),
    backgroundColor: COLORS.validation,
    width: "100%",
    paddingVertical: hp(2),
    borderRadius: 14,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  error: {
    color: "red",
    marginTop: hp(1),
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: wp(85),
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: wp(6),
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: hp(1),
  },

  modalText: {
    textAlign: "center",
    marginBottom: hp(3),
    color: "#555",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  modalBtn: {
    width: "48%",
    paddingVertical: hp(1.8),
    borderRadius: 12,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#ddd",
  },

  deactivateBtn: {
    backgroundColor: COLORS.validation,
  },

  cancelText: {
    color: "#000",
    fontWeight: "500",
  },

  deleteModalText: {
    color: "#fff",
    fontWeight: "600",
  },
});