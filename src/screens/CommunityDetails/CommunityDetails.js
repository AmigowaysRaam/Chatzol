import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { wp, hp } from "../../resources/dimensions";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../resources/Colors";
import { Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Louis_George_Cafe } from "../../resources/fonts";
import { addGroupCommunity, addGroupMemebers, getCommunityDetails, getGroupDetails, removeGroupCommunity, removeGroupMember } from "../../redux/authActions";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";


const CommunityDetails = () => {

  const route = useRoute();
  const { communitydata } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();


  const userId = useSelector((state) => state.auth.user?._id);
  const [groupData, setGroupData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // For managing modal visibility
  const [selectedGroups, setselectedGroups] = useState([]);
  const [isEditModalVisible, setisEditModalVisible] = useState(false);

  const [groupList, setgroupList] = useState([]);



  const toggleSelectUser = (gid) => {
    setselectedGroups(prevselectedGroups => {
      if (prevselectedGroups.includes(gid)) {
        return prevselectedGroups.filter(id => id !== gid); // Deselect
      } else {
        return [...prevselectedGroups, gid]; // Select
      }
    });
    console.log(selectedGroups)
  };


  useEffect(() => {
    if (userId && communitydata) {
      fetchCommunityDetails();
    }
  }, [userId, communitydata]);

  const fetchCommunityDetails = async () => {
    if (userId && communitydata) {
      dispatch(
        getCommunityDetails(userId, communitydata._id, (response) => {
          setgroupList(response.data.groups)
          setLoading(false);
        })
      );


    } else {
      console.log("No group details found.");
    }
  };

  const handlePickImage = () => {
    // Implement logic for picking a profile image
    // navigation.navigate("Profile");
  };

  const handleBackPress = () => {
    navigation.goBack(); // This will take the user back to the previous screen
  };
  // addGroupCommunity
  const handleAddGroupToCommunity = () => {
    try {
      dispatch(
        addGroupCommunity(userId, communitydata._id, selectedGroups, (response) => {
          alert(JSON.stringify(response));
          // Check if the response indicates success
          if (response && response.success) {
            // Handle successful response
            fetchCommunityDetails();
            setisEditModalVisible(false);
            setselectedGroups([]);
            alert("Group community updated successfully!");
          } else {
            // Handle failure case if the response does not indicate success
            alert("Failed to update group community. Please try again.");
          }
        })
      );
    } catch (error) {
      console.error("Error occurred while dispatching action:", error);
      alert("An error occurred, please try again later.");
    }

  };
  const handleAddMemebers = () => {
    setisEditModalVisible(true);
  };

  const handleSubmit = () => {
    const selectedUserDetails = groupData.users.filter(user =>
      selectedGroups.includes(user._id) // Use _id to match selected users
    );

    dispatch(
      addGroupMemebers(userId, groupId, selectedGroups, (response) => {
        if (response.success) {
          fetchCommunityDetails();
          setIsModalVisible(false);
          setselectedGroups([])
          navigation.goBack();
          Toast.show({
            text1: 'Success!',
            text2: response.message,
            type: 'success',
            position: 'top',
          });
        }
        else {
          fetchCommunityDetails();
          setIsModalVisible(false);
          setselectedGroups([])
          Toast.show({
            text1: 'Error!',
            text2: "Failed",
            type: 'error',
            position: 'top',
          });
        }

      })
    );
  };

  if (!communitydata) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  const ProfileComponent = () => (
    <View style={styles.profileContainer}>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={handlePickImage}
      >
        <Image
          source={{ uri: communitydata?.image }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );


  const renderGroupList = () => {

    const handleRemoveGroup = (groupId) => {
      Alert.alert(
        "Confirm Removal", // Title of the alert
        "Are you sure you want to remove this group?", // Message to show in the alert
        [
          {
            text: "Cancel", // Button to cancel the action
            onPress: () => console.log("Removal canceled"), // Optionally handle cancel action
            style: "cancel", // Styling for the cancel button
          },
          {
            text: "OK", // Button to confirm the action
            onPress: () => {

              dispatch(removeGroupCommunity(userId, communitydata._id, groupId, (response) => {
                if (response.success) {
                  // fetchGroupDetails();
                  fetchCommunityDetails();
                  navigation.goBack();

                  Toast.show({
                    text1: 'Success!',
                    text2: response.message,
                    type: 'success',
                    position: 'top',
                  });
                }
                else {
                  fetchCommunityDetails();
                  // navigation.goBack();
                  Toast.show({
                    text1: 'Error!',
                    text2: "Failed",
                    type: 'error',
                    position: 'top',
                  });
                }

              })
              );
            },
          },
        ],
        { cancelable: false } // Prevents the alert from being dismissed by tapping outside
      );
    };


    if (!communitydata.groups || communitydata.groups.length === 0) {
      return (
        <Text style={{ color: COLORS.white, fontSize: hp(2), textAlign: "center" }}>
          No Group.
        </Text>
      );
    }

    return communitydata?.groups.map((user, index) => (
      <>

        <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: wp(2),
            marginHorizontal: wp(3),
            flex: 1 // This ensures the text and image container takes up available space
          }}>
            <Image
              source={{ uri: user?.image }}
              style={{
                width: wp(10),
                height: wp(10),
                borderRadius: wp(5),
                marginRight: wp(3),
                borderColor: "#888",
                borderWidth: wp(0.6),
                padding: wp(2),
                margin: wp(2)
              }}
            />
            <Text style={{ color: COLORS.white, fontSize: hp(2), textTransform: "capitalize" }}>
              {user.name}
            </Text>
          </View>

          {/* Remove button */}
          <Ionicons
            name="remove-circle-outline"
            size={30}
            color={COLORS.white}
            style={{
              paddingHorizontal: wp(3),
            }}
            onPress={() => handleRemoveGroup(user._id)} // Call the remove function
          />
        </View>
      </>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Toast ref={(ref) => Toast.setRef(ref)} />

      {/* Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={30} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ProfileComponent />
      <Toast ref={(ref) => Toast.setRef(ref)} style={{ zIndex: 999 }} />
      <View style={styles.infoContainer}>
        <Text style={[Louis_George_Cafe.bold.h4, { color: COLORS.white }]}>
          {communitydata?.name}
        </Text>
        <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.white }]}>
          {communitydata?.bio ? communitydata?.bio : ''}
        </Text>
      </View>
      <Divider style={{ marginVertical: hp(5) }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: wp(5) }}>
        <Text style={{ color: COLORS.white, fontSize: hp(3), textAlign: "left" }}>
          Groups
        </Text>
        <TouchableOpacity onPress={handleAddMemebers}>
          <Ionicons
            name="add-circle-outline"
            size={30}
            color={COLORS.white}
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      </View>
      {renderGroupList()}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setisEditModalVisible(false)}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeader}>
              <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, {
                color: COLORS.white,
                marginHorizontal: wp(2),
                maxWidth: wp(72)
              }]}>
                {communitydata?.name}
              </Text>
              <TouchableOpacity onPress={() => setisEditModalVisible(false)}>
                <Ionicons name="close" size={wp(10)} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {
              groupList.length == 0
              &&
              <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, {
                color: COLORS.white,
                marginHorizontal: wp(2),
                maxWidth: wp(100),
                alignSelf: "center"
              }]}>
                {"No Groups"}
              </Text>
            }

            {groupList.length !== 0 &&
              <FlatList
                data={groupList}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => {
                  <Text style={[Louis_George_Cafe.regular.h6, { color: COLORS.white }]}>{"No Groups"}</Text>

                }}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleSelectUser(item._id)}>
                    <View style={styles.userItem} >
                      <Checkbox
                        status={selectedGroups.includes(item._id) ? "checked" : "unchecked"}
                        color={COLORS.button_bg_color}
                      />
                      <Image source={{ uri: item.image }} style={styles.profilePic} />
                      <Text style={[Louis_George_Cafe.regular.h6, { color: COLORS.white }]}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              // contentContainerStyle={styles.flatListContainer} // Optional: styling for list container
              />
            }

            {
              selectedGroups.length !== 0 &&
              // <ButtonComponent title={"Add"} onPress={() => { alert(JSON.stringify(selectedGroups)) }} />
              <TouchableOpacity
                onPress={() => handleAddGroupToCommunity()}  // Assuming this is the onPress handler
                style={[styles.senButton, {
                  backgroundColor: COLORS.button_bg_color,
                  width: wp(90),        // Button width is full screen width
                  height: hp(5),              // Increase height to 6% of screen height for better visibility
                  alignSelf: "center",        // Center button horizontally within the container
                  justifyContent: "center",   // Center the text vertically
                  alignItems: "center",       // Ensure the text is centered horizontally as well
                  borderRadius: wp(1),
                }]}
              >
                <Text style={[Louis_George_Cafe.regular.h6, { color: COLORS.black }]}>{"Add"}</Text>
              </TouchableOpacity>
            }
          </View>

        </View>


      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  editModalContent: {
    backgroundColor: '#FFF', // Modal background
    width: wp(100),
    padding: wp(4),
    borderRadius: wp(2),
    height: hp(100)
  },

  modalContentContainer: {
    padding: wp(5),
    paddingBottom: wp(20), // Space for the submit button
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: wp(10),
    marginHorizontal: wp(2),
    alignItems: "center"
  },
  // 
  container: {
    flex: 1,
    // backgroundColor: "#000",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000', // Transparent overlay
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
    padding: wp(5),
    paddingBottom: wp(20), // Space for the submit button
  },
  groupName: {
    color: "#fff",
    fontSize: hp(3),
    textAlign: 'left',
  },
  userList: {
    maxHeight: hp(90),  // Ensure the list doesn't overflow out of the screen
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(2),
  },
  userImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    marginRight: wp(3),
  },
  userName: {
    color: COLORS.white,
    fontSize: hp(2),
  },
  checkbox: {
    marginLeft: wp(10),
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: wp(1),
  },
  noUsersText: {
    color: COLORS.white,
    fontSize: hp(2),
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  headerContainer: {
    paddingTop: hp(3),
    paddingLeft: wp(5),
    paddingBottom: hp(2),
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: hp(2),
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    borderColor: "#fff",
    borderWidth: wp(0.6),
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#1e1e1e",
    padding: 5,
    borderRadius: 12,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: hp(1),
  },
  userContainer: {
    marginTop: hp(2),
    alignItems: "center",
  },
});

export default CommunityDetails;
