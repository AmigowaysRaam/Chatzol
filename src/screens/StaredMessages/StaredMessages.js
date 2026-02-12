import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Modal, Alert
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Louis_George_Cafe } from "../../resources/fonts";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../resources/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { getStaredMessage, unStarMessages } from "../../redux/authActions";
import moment from "moment"; // Import moment.js for date formatting
import Toast from "react-native-toast-message";

const StaredMessages = () => {
  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  const [starredMessages, setStarredMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Track refresh state
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility for "More" menu
  const [selectedMessage, setSelectedMessage] = useState(null); // To store the selected message for options

  // Fetch starred messages
  const fetchStarredMessages = () => {
    setRefreshing(true); // Set refreshing state to true
    dispatch(
      getStaredMessage(userId, (response) => {
        setStarredMessages(response.data);
        setRefreshing(false); // Set refreshing state to false after data is fetched
      })
    );
  };


  useEffect(() => {
    fetchStarredMessages();
  }, []);

  const HeaderComponent = ({ handleAlertUnstart }) => {
    return (
      <>
        <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
            <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View style={{ maxWidth: wp(100), flex: 1, alignItems: "center" }}>
            <Text numberOfLines={1} style={[styles.headingName, Louis_George_Cafe.bold.h5, { color: COLORS.white }]}>
              {"Starred Messages"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.morButton, { marginHorizontal: wp(2), marginTop: wp(1) }]}
            onPress={() => {
              handleAlertUnstart();
            }}
          >
            <MaterialIcons name="star" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </LinearGradient>
        <View style={{ height: 1, backgroundColor: "#9999", marginTop: wp(1) }} />
      </>
    );
  };

  const renderItem = ({ item }) => {
    // Format the timestamp
    const formattedTimestamp = moment(item.createdAt).format("MMM D, YYYY [at] h:mm A");

    return (
      <View style={[styles.messageContainer]}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: item.profilepicture }} style={styles.profilepicture} />
          <Text style={[styles.userName, Louis_George_Cafe.bold.h9]}>
            {item.name}
          </Text>
        </View>
        <Text numberOfLines={6} style={[styles.messageText, Louis_George_Cafe.regular.h8, { color: COLORS.white }]}>
          {item?.message}
        </Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setSelectedMessage(item); // Set the selected message
            setModalVisible(true); // Show the modal with the "More" options
          }}
        >
          {/* <MaterialIcons name="more-vert" size={22} color={COLORS.white} /> */}
        </TouchableOpacity>
        {/* Timestamp */}
        <Text style={[styles.timestampText, Louis_George_Cafe.regular.h9]}>
          {item?.createddatetime}
        </Text>
      </View>
    );
  };

  // Handler for the "More" menu options
  const handleMenuOption = (option) => {
    switch (option) {
      case "reply":
        console.log("Reply to:", selectedMessage);
        break;
      case "delete":
        console.log("Delete message:", selectedMessage);
        break;
      default:
        console.log("Option not available");
    }
    setModalVisible(false); // Close the modal after selecting an option
  };

  const fnhandleAlertUnstart = () => {
    Alert.alert(
      "Unstar All Messages",
      "Are you sure you want to unstar all messages?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // console.log("All messages have been unstarred.");
            dispatch(
              unStarMessages(userId, (response) => {

                fetchStarredMessages();
                Toast.show({
                  text1: response.message,
                  type: 'success',
                  position: 'top',
                });
              })
            );

            // Add functionality here to unstar all messages
            // setStarredMessages([]); // Example: clear the starred messages
          },
        },
      ],
      { cancelable: true }
    );
  };

  // useEffect(() => {
  //   Toast.show({
  //     text1: "response.message",
  //     type: 'success',
  //     position: 'top',
  //   })
  // }, [])

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
      <HeaderComponent handleAlertUnstart={fnhandleAlertUnstart} />
      {
        starredMessages?.length == 0 ?
          <Text style={[styles.emptyText, Louis_George_Cafe.regular.h7, {
            color: COLORS.white,
            alignSelf: "center",
            marginVertical: wp(10)
          }]}>No starred messages available.</Text>
          :
          <FlatList
            data={starredMessages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            refreshing={refreshing} // Enable pull-to-refresh
            onRefresh={fetchStarredMessages} // Handle refresh event
          />
      }
      <Toast zIndex={1} />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >

        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleMenuOption("reply")}>
              <Text style={styles.modalOption}>Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuOption("delete")}>
              <Text style={styles.modalOption}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalOption}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  headContainer: {
    width: wp(100),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },

  headingName: {
    fontSize: wp(6),
    color: COLORS.white,
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageList: {
    padding: wp(4),
  },

  messageContainer: {

    backgroundColor: "#ddd",
    borderTopEndRadius: wp(2),
    borderTopLeftRadius: wp(2),
    borderBottomLeftRadius: wp(2),
    padding: wp(1),
    maxWidth: wp(60),
    marginVertical: wp(1),
  },

  sender: {
    alignSelf: 'flex-end',  // Sender's message aligned to the right
    backgroundColor: "green",  // Background color for sender messages
  },

  receiver: {
    alignSelf: 'flex-start',  // Receiver's message aligned to the left
    backgroundColor: COLORS.search_bg_color,  // Background color for receiver messages
  },

  messageText: {
    fontSize: wp(4.5),
    color: COLORS.white,  // White text for both sender and receiver
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(2),
  },

  profilepicture: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(4),
    marginRight: wp(3),
    margin: wp(1)
  },

  userName: {
    color: COLORS.black,
  },

  moreButton: {
    position: 'absolute',
    right: wp(2),
    top: wp(4),
  },

  timestampText: {
    color: COLORS.gray,  // Gray color for the timestamp
    textAlign: 'right',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: wp(4),
    borderRadius: wp(2),
  },
  modalOption: {
    fontSize: wp(4),
    paddingVertical: wp(2),
    color: COLORS.black,
  },
});

export default StaredMessages;
