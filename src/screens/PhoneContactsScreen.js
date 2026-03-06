import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Platform,
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

  const requestPermission = async () => {
    const permission =
      Platform.OS === "ios" ? PERMISSIONS.IOS.CONTACTS : PERMISSIONS.ANDROID.READ_CONTACTS;

    const status = await check(permission);
    if (status === RESULTS.GRANTED) return true;

    const requestStatus = await request(permission);
    return requestStatus === RESULTS.GRANTED;
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          Alert.alert(
            "Permission Denied",
            "Enable contacts permission in settings to use this feature."
          );
          setLoading(false);

          return;
        }

        const allContacts = await Contacts.getAll();
        if (!allContacts || allContacts.length === 0) {
          Alert.alert("No Contacts", "Your phone has no contacts.");
          setContacts([]);
        } else {
          // Keep contacts with phone numbers only, and sort alphabetically
          const formatted = allContacts
            .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
            .map((c) => ({
              ...c,
              phone: c.phoneNumbers[0].number.replace(/\s+/g, ""),
              isAppUser: false, // API call to check if user exists
            }))
            .sort((a, b) => a.givenName.localeCompare(b.givenName));

          setContacts(formatted);
          setFilteredContacts(formatted);
        }
      } catch (err) {
        console.log("Contacts fetch error:", err);
        Alert.alert("Error", "Unable to fetch contacts.");
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = contacts.filter(
      (c) =>
        c.givenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.familyName && c.familyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.phone && c.phone.includes(searchTerm))
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const handleChat = (contact) => {
    Alert.alert("Chat", `Start chat with ${contact.givenName}`);
  };

  const handleInvite = (phone) => {
    Alert.alert("Invite", `Send invite to ${phone}?`);
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: hp(5) }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FB" }}>
      <HeaderBar title="Contacts" showBackArrow/>
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
              <Text style={styles.contactName}>{item.givenName} {item.familyName}</Text>
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
    fontSize: 15,
  },
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  contactName: { fontSize: 16, fontWeight: "600" },
  contactPhone: { fontSize: 14, color: "#555" },
  chatBtn: {
    color: "#fff",
    backgroundColor: "#a020cb",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 5,
  },
  inviteBtn: {
    color: "#a020cb",
    borderWidth: 1,
    borderColor: "#a020cb",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 5,
  },
});