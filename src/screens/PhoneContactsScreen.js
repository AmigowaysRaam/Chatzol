import React, { useEffect, useState } from "react";
import { View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Platform,
  Modal,
  Linking,AppState
} from "react-native";
import Contacts from "react-native-contacts";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { hp, wp } from "../resources/dimensions";
import { COLORS } from "../resources/Colors";
import HeaderBar from "../ScreenComponents/HeaderComponent/HeaderComponent";

const PhoneContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [permissionModal, setPermissionModal] = useState(true);
  const [showSettingsBtn, setShowSettingsBtn] = useState(false);

  const requestPermission = async () => {
    const permission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    }

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    if (result === RESULTS.BLOCKED) {
      setShowSettingsBtn(true);
    }

    return false;
  };

  const loadContacts = async () => {
    try {
      const allContacts = await Contacts.getAll();

      const formatted = allContacts
        .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
        .map((c) => ({
          ...c,
          phone: c.phoneNumbers[0].number.replace(/\s+/g, ""),
          isAppUser: false,
        }))
        .sort((a, b) => a.givenName.localeCompare(b.givenName));

      setContacts(formatted);
      setFilteredContacts(formatted);
    } catch (err) {
      console.log("Contacts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAllowPermission = async () => {
    const granted = await requestPermission();

    if (granted) {
      setPermissionModal(false);
      loadContacts();
    }
  };

  useEffect(() => {
    if (!permissionModal) return;

    const checkPermission = async () => {
      const permission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS;

      const status = await check(permission);

      if (status === RESULTS.GRANTED) {
        setPermissionModal(false);
        loadContacts();
      } else {
        setLoading(false);
      }
    };

    checkPermission();
  }, []);


  useEffect(() => {
  const subscription = AppState.addEventListener("change", async (state) => {
    if (state === "active") {
      const permission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS;

      const status = await check(permission);

      if (status === RESULTS.GRANTED) {
        setPermissionModal(false);
        setShowSettingsBtn(false);
        loadContacts();
      }
    }
  });

  return () => {
    subscription.remove();
  };
}, []);

  useEffect(() => {
    const filtered = contacts.filter(
      (c) =>
        c.givenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.familyName &&
          c.familyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.phone && c.phone.includes(searchTerm))
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const handleChat = (contact) => {
    console.log("Chat with", contact.givenName);
  };

  const handleInvite = (phone) => {
    console.log("Invite", phone);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ marginTop: hp(5) }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <HeaderBar title="Contacts" showBackArrow />

      {/* Permission Modal */}
      <Modal visible={permissionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Allow Contact Access</Text>

            <Text style={styles.modalText}>
              We use your contacts to help you find friends already using the
              app and invite others to join.
            </Text>

            {!showSettingsBtn ? (
              <TouchableOpacity
                style={styles.allowButton}
                onPress={handleAllowPermission}
              >
                <Text style={styles.allowText}>Allow Access</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.allowButton}
                onPress={() => Linking.openSettings()}
              >
                <Text style={styles.allowText}>Open Settings</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search contacts..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <View>
              <Text style={styles.contactName}>
                {item.givenName} {item.familyName}
              </Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>

            {item.isAppUser ? (
              <TouchableOpacity onPress={() => handleChat(item)}>
                <Text style={styles.chatBtn}>Chat</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleInvite(item.phone)}>
                <Text style={styles.inviteBtn}>Invite</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default PhoneContactsScreen;

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "#f1f3f6",
    margin: wp(4),
    borderRadius: wp(10),
    paddingHorizontal: wp(4),
    height: hp(6),
    justifyContent: "center",
  },

  searchInput: {
    fontSize: wp(3.8),
  },

  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: wp(0.3),
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  contactName: {
    fontSize: wp(4),
    fontWeight: "600",
  },

  contactPhone: {
    fontSize: wp(3.5),
    color: "#555",
    marginTop: hp(0.3),
  },

  chatBtn: {
    color: "#fff",
    backgroundColor: "#a020cb",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
    fontSize: wp(3.5),
  },

  inviteBtn: {
    color: "#a020cb",
    borderWidth: wp(0.3),
    borderColor: "#a020cb",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
    fontSize: wp(3.5),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: wp(85),
    backgroundColor: "#fff",
    borderRadius: wp(4),
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
    alignItems: "center",
  },

  modalTitle: {
    fontSize: wp(4.8),
    fontWeight: "700",
    marginBottom: hp(1.5),
  },

  modalText: {
    textAlign: "center",
    fontSize: wp(3.6),
    color: "#555",
    marginBottom: hp(3),
    lineHeight: hp(2.8),
  },

  allowButton: {
    backgroundColor: "#a020cb",
    paddingVertical: hp(1.3),
    paddingHorizontal: wp(10),
    borderRadius: wp(2.5),
  },

  allowText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: wp(3.8),
  },
});