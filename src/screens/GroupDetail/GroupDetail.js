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
  Switch,
  Alert,
  FlatList,
  TextInput as TextVariable, ToastAndroid
} from "react-native";
import { wp, hp } from "../../resources/dimensions";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../resources/Colors";
import { Divider, TextInput } from "react-native-paper";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Louis_George_Cafe } from "../../resources/fonts";
import { addGroupMemebers, getGroupDetails, getSearchUser, getSubGroupsDetails, removeGroupMember } from "../../redux/authActions";
import { Checkbox } from "react-native-paper";
import ButtonComponent from "../../components/Button/Button";
import Toast from "react-native-toast-message";
import { launchImageLibrary } from "react-native-image-picker"; // Import the launchImageLibrary
import Profile from "../Profile/Profile";
import { MaterialIcons } from "@expo/vector-icons";

const GroupDetails = () => {
  const route = useRoute();
  const { groupId } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userId = useSelector((state) => state.auth.user?._id);
  const [groupData, setGroupData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupName, setNewGroupName] = useState(''); // To store new group name
  const [newGroupImage, setNewGroupImage] = useState(groupData?.image);
  const [page, setPage] = useState(1);  // Track the current page
  const [hasMore, setHasMore] = useState(true);
  const [newGroupBio, setnewGroupBio] = useState(''); // To store new group name
  const [isEditModalVisible, setisEditModalVisible] = useState(false);
  const [canSendMessages, setCanSendMessages] = useState(false); // State for the toggle switch
  const [subGroups, setSubGroups] = useState([]);
  const [allowSubGroupCreate, setAllowSubGroupCreate] = useState(false);

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter(id => id !== userId) // Deselect if already selected
        : [...prevSelectedUsers, userId] // Add to selected list
    );
  };

  const [users, setusersList] = useState(null);

  useEffect(() => {

    if (!searchQuery) return;
    setIsLoading(true);
    const lettersOnly = searchQuery.replace(/[^a-zA-Z]/g, '');
    dispatch(getSearchUser(userId, searchQuery, 1, groupId, (response) => {
      if (response.success) {
        const flag = response?.data
        setusersList(flag);
        setIsLoading(false)
      }
    })
    )
  }, [searchQuery]);


  useEffect(() => {

    if (userId && groupId) {
      fetchGroupDetails();
    }
  }, [userId, groupId]);


  useFocusEffect(
    React.useCallback(() => {
      fetchGroupDetails();
      return () => {

      };
    }, [])
  );

  const fetchGroupDetails = async () => {
    if (userId && groupId) {
      dispatch(
        getGroupDetails(userId, groupId, (response) => {
          const group = response.data[0];
          // alert(JSON.stringify(group))
          setCanSendMessages(group?.isMessageSendable == 1  ? true : false)
          setGroupData(group ? group : {});
          setNewGroupName(group?.name)
          setAllowSubGroupCreate(group.allowAddsubgroup == 1 ? true : false)
          setSubGroups(response?.data[0]?.subgroups)
        })
      );

    } else {
      console.log("No group details found.");
    }
  };

  const handlePickImage = async () => {

    if (groupData?.adminid === userId) {
      // Launch image picker to select a new image
      launchImageLibrary(
        {
          mediaType: "photo",
          quality: 1,
          includeBase64: false,
          maxWidth: 500,
          maxHeight: 500,
        },
        (response) => {
          if (response.didCancel) {
            console.log("User cancelled image picker");
          } else if (response.errorCode) {
            console.log("ImagePicker Error: ", response.errorMessage);
          } else {
            // If the user picked an image, save the URI
            setNewGroupImage(response.assets[0].uri);
          }
        }
      );
    }
  };


  const handleBackPress = () => {
    navigation.goBack(); // This will take the user back to the previous screen
  };

  const handleAddMemebers = () => {
    setIsModalVisible(true); // Show the modal when the plus icon is clicked
  };

  const handleSubmit = () => {
    const selectedUserDetails = groupData.users.filter(user =>
      selectedUsers.includes(user._id) // Use _id to match selected users
    );
    dispatch(
      addGroupMemebers(userId, groupId, selectedUsers, (response) => {
        if (response.success) {
          fetchGroupDetails();
          setIsModalVisible(false);
          setSelectedUsers([])
          Toast.show({
            text1: 'Success!',
            text2: response.message,
            type: 'success',
            position: 'top',
          });
        }
        else {
          fetchGroupDetails();
          setIsModalVisible(false);
          setSelectedUsers([])
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

  if (!groupData) {
    return (
      <View style={[styles.loadingContainer, {
        backgroundColor: COLORS.black
      }]}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  const ProfileComponent = () => (
    <View style={styles.profileContainer}>
      <View
        style={styles.profileImageContainer}
      // onPress={handlePickImage}
      >
        < Image
          source={{ uri: groupData?.image }}
          style={[styles.profileImage, {
            borderColor: COLORS.button_bg_color
          }]}

        />
      </View>

    </View>
  );



  const handleEditGroup = async () => {

    // Prepare FormData for the POST request
    // alert(JSON.stringify(newGroupImage))
    const formData = new FormData();
    formData.append('name', newGroupName != "" ? newGroupName : groupData?.name);
    formData.append('userid', userId);
    formData.append('groupid', groupData?._id);
    formData.append('bio', newGroupBio !== "" ? newGroupBio : groupData?.bio);
    formData.append('allow_send_message', canSendMessages ? 1 : 0);


    // Ensure group image is correctly formatted
    if (newGroupImage) {
      formData.append('image', {
        uri: newGroupImage,
        type: 'image/jpeg',
        name: 'groupImage.jpg',
      });
    }
    // console.log(formData)
    try {
      const response = await fetch('https://chatzol.scriptzol.in/api/?url=app-update-group', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // dispatch(getListConversation(userId));
        fetchGroupDetails();
        Toast.show({
          text1: 'Success!',
          text2: data.message,
          type: 'success',
          position: 'top',
        });
        setIsLoading(false);
        setisEditModalVisible(false)
        // navigation.navigate("GroupChatScreen", { groupId, username, avatar });
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      } else {
        Toast.show({
          text1: 'Error!',
          text2: data.message,
          type: 'error',
          position: 'top',
        });
        setIsLoading(false);
        setisEditModalVisible(false)
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Toast.show({
        text1: 'Error!',
        text2: 'Something went wrong, please try again later.',
        type: 'error',
        position: 'top',
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }



  const renderUsersList = () => {

    if (!groupData?.members || groupData.members.length === 0) {
      return (
        <Text style={{ color: COLORS.white, fontSize: hp(2), textAlign: "center" }}>
          No users in this group.
        </Text>
      );
    }
    function handleRemoveMember(user) {
      // Show confirmation alert
      Alert.alert(
        "Confirm Removal", // Title of the popup
        `Are you sure you want to remove ${user.name}?`, // Message in the popup
        [
          {
            text: "Cancel", // Cancel button
            style: "cancel",
          },
          {
            text: "Yes", // Confirm button
            onPress: async () => {
              // Dispatch the removeGroupMember action to remove the user from the group

              dispatch(removeGroupMember(user._id, groupData._id, userId, (response) => {
                if (response.success) {
                  fetchGroupDetails();
                  Toast.show({
                    text1: 'Success!',
                    text2: response.message,
                    type: 'success',
                    position: 'top',
                  });
                }
                else {
                  fetchGroupDetails();
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
        ]
      );

    }



    return groupData.members.map((user, index) => (

      <View key={index} style={{ flexDirection: "row", alignItems: "center", paddingVertical: wp(2), marginHorizontal: wp(3) }}>
        <TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: user?.image }}
              style={{
                width: wp(10),
                height: wp(10),
                borderRadius: wp(5),
                marginRight: wp(3),
                borderColor: "#888",
                borderWidth: wp(0.6),
                padding: wp(2)
              }}
            />
            <Text style={{ color: COLORS.white, fontSize: hp(2) }}>
              {user?.name && user?.name != '' ? user?.name : ''}
            </Text>
          </View>
        </TouchableOpacity>
        {
          groupData?.adminid !== user._id &&
          <TouchableOpacity onPress={() => handleRemoveMember(user)} style={{ marginLeft: 'auto' }}>
            <Ionicons name="remove-circle" size={30} color={COLORS.white} style={{ marginHorizontal: wp(2) }} />
          </TouchableOpacity>
        }
      </View>
    ));
  };

  return (
    <View style={[styles.container, {
      backgroundColor: COLORS.black
    }]}>
      {/* Header with Back Button and Edit Icon */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={30} color={COLORS.white} />
        </TouchableOpacity>
        {/* Edit Icon */}
        {
          groupData?.adminid == userId &&
          <TouchableOpacity onPress={() => {
            setisEditModalVisible(true)
          }}>
            <Ionicons name="pencil" size={30} color={COLORS.white} style={styles.editIcon} />
          </TouchableOpacity>
        }
      </View>
      <ProfileComponent
        setEdit={
          groupData?.adminid === userId}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} style={{ zIndex: 999 }} />
      <View style={styles.infoContainer}>
        <Text style={[Louis_George_Cafe.bold.h4, { color: COLORS.white }]}>
          {
            groupData?.name
            || "Group Name"}
        </Text>

        {groupData?.bio != undefined && groupData?.bio !== 'undefined' &&
          <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.white }]}>
            {groupData?.bio || ''}
          </Text>
        }
      </View>
      <View style={[styles.sendButtonContainer, {
        width: wp(100),
        marginTop: wp(2)
      }]}>
        {allowSubGroupCreate &&
          <TouchableOpacity
            onPress={() => navigation.navigate('AddSubgroup', { groupId: groupData?._id, groupData })}  // Assuming this is the onPress handler
            style={[styles.senButton, {
              backgroundColor: COLORS.button_bg_color,
              width: wp(38),        // Button width is full screen width
              height: hp(4),              // Increase height to 6% of screen height for better visibility
              alignSelf: "center",        // Center button horizontally within the container
              justifyContent: "space-evenly",   // Center the text vertically
              alignItems: "center",       // Ensure the text is centered horizontally as well
              borderRadius: wp(1),
              flexDirection: "row"
            }]}
          >
            <Ionicons name="add-circle-outline" size={wp(5)} color={COLORS.black} />
            <Text style={[Louis_George_Cafe.bold.h8, styles.buttonText, { color: COLORS.black }]}>
              {
                "Add Sub Group"}</Text>
          </TouchableOpacity>
        }
      </View>
      <Divider style={{ marginVertical: hp(2) }} />
      <ScrollView style={styles.userList}>
        {
          subGroups?.length !== 0 &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: wp(5) }}>
            <Text style={{ color: COLORS.white, fontSize: hp(3), textAlign: "left" }}>
              Sub Group
            </Text>
          </View>
        }
        <FlatList
          data={subGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item._id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: wp(2), marginHorizontal: wp(3) }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: wp(10),
                    height: wp(10),
                    borderRadius: wp(5),
                    marginRight: wp(3),
                    borderColor: "#888",
                    borderWidth: wp(0.6),
                    padding: wp(2)
                  }}
                />
                <Text style={{ color: COLORS.white, fontSize: hp(2) }}>
                  {item.name}
                </Text>
              </View>
            </View>
          )}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: wp(5) }}>
          <Text style={{ color: COLORS.white, fontSize: hp(3), textAlign: "left" }}>
            Members
          </Text>
          {
            groupData?.adminid == userId &&
            <TouchableOpacity onPress={handleAddMemebers}>
              <Ionicons
                name="add-circle-outline"
                size={30}
                color={COLORS.white}
                style={styles.plusIcon}
              />
            </TouchableOpacity>
          }
        </View>
        {renderUsersList()}
      </ScrollView>
      {/* Modal for adding members */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >

        <View style={styles.modalContainer}>
          {/* Modal Content */}
          <View style={styles.modalHeader}>
            <Text numberOfLines={1} style={[styles.groupName, { width: wp(60), marginHorizontal: wp(5) }]}>{groupData.name}</Text>

            <TouchableOpacity onPress={() => {
              setIsModalVisible(false); setSearchQuery('');
              setusersList(null);
              setPage(1)
            }}>
              <Ionicons name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={[styles.searchContainer,
          { backgroundColor: COLORS.search_bg_color }
          ]}
          >
            <TouchableOpacity style={styles.iconContainer}>
              <MaterialIcons name="search" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TextVariable
              style={styles.textInput}
              value={searchQuery}
              onChangeText={(text) => {
                const filteredText = text.replace(/\s/g, '');
                setSearchQuery(text)
              }}
              placeholder="Search..."
              placeholderTextColor={COLORS.white}
              color={COLORS.white}
            />
          </View>
          <ScrollView contentContainerStyle={styles.modalContentContainer}>
            {users === 0 ? (
              <Text style={styles.noUsersText}>No users in this group</Text>
            ) : (
              <>
                <FlatList
                  data={users}
                  keyExtractor={(item) => item?._id.toString()} // Ensure you have a unique key for each item
                  renderItem={({ item: user }) => (
                    <View style={styles.userItem}>
                      <TouchableOpacity onPress={() => toggleSelectUser(user._id)} style={styles.userItem}>
                        <Checkbox
                          status={selectedUsers.includes(user._id) ? "checked" : "unchecked"}
                          onValueChange={() => toggleSelectUser(user._id)}  // Toggle based on user._id
                          style={styles.checkbox}
                        />
                        <Image
                          source={{ uri: user.image || 'default_image_url' }}
                          style={styles.userImage}
                        />
                        <Text style={styles.userName}>{user.username}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={styles.userList} // Optional to maintain the styling of the user list
                  onEndReached={() => {
                    if (!isLoading && hasMore) {
                      setPage(prevPage => prevPage + 1);
                    }
                  }}
                  onEndReachedThreshold={0.5}
                />

              </>
            )}
          </ScrollView>

          {/* Submit Button Fixed at the Bottom */}
          {selectedUsers.length > 0 && (
            <View style={styles.submitButtonContainer}>
              <ButtonComponent title={"Add Member"} onPress={handleSubmit} />
            </View>
          )}
        </View>
      </Modal>

      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        onRequestClose={() => setisEditModalVisible(false)}
      >
        <View style={styles.overlayContainer}>
          {
            isLoading ?
              <ActivityIndicator />
              :
              <View style={[styles.editModalContent, { backgroundColor: COLORS.search_bg_color }]}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => {
                    setisEditModalVisible(false);
                  }}>
                    <Ionicons name="close" size={30} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.profileImageContainer}
                  onPress={handlePickImage}
                >
                  <Image
                    source={{ uri: newGroupImage ? newGroupImage : groupData?.image }}
                    style={styles.profileImage}
                  />
                  {/* Pen Icon positioned on top of the image */}
                  <View style={[styles.iconContainer, { backgroundColor: COLORS.button_bg_color }]}>
                    <Ionicons name="pencil" size={30} color={COLORS.black} />
                  </View>
                </TouchableOpacity>

                <TextInput
                  style={{ marginVertical: wp(2) }}
                  value={newGroupName}
                  onChangeText={(text) => setNewGroupName(text)}
                  placeholder="Group Name..."
                  placeholderTextColor="#555"
                  color={COLORS.white}
                />

                <TextInput
                  style={{ marginVertical: wp(2) }}
                  value={newGroupBio}
                  onChangeText={(text) => setnewGroupBio(text)}
                  placeholder="Group Bio"
                  placeholderTextColor="#555"
                  color={COLORS.white}
                  multiline
                />
                <View style={styles.toggleSwitchContainer}>
                  <Text
                    style={[
                      // styles.headingName,
                      Louis_George_Cafe.regular.h7,
                      { color: COLORS.white, marginHorizontal: wp(2) },
                    ]}
                  >Allow others to send messages</Text>
                  <Switch
                    value={canSendMessages}
                    onValueChange={(value) => setCanSendMessages(value)}
                    trackColor={{ false: '#fff', true: COLORS.primary }} // Customize track color when off and on
                    thumbColor={canSendMessages ? COLORS.button_bg_color : '#ffffff'} // Customize thumb color when switched on or off
                    style={{
                      transform: [{ scaleX: 1 }, { scaleY: 1 }], // Adjusting size (x and y axis scaling)
                    }}
                  />
                </View>
                {/* Save Button positioned at the bottom */}
                <View style={[styles.saveButtonContainer, {
                  backgroundColor: COLORS.button_bg_color, borderRadius: wp(10)
                }]}>
                  <TouchableOpacity onPress={() => {
                    handleEditGroup();
                  }}>
                    <Text
                      style={[
                        // styles.headingName,
                        Louis_George_Cafe.regular.h7,
                        { color: COLORS.black, marginHorizontal: wp(2) },
                      ]}
                    >Save Changes</Text>
                  </TouchableOpacity>
                  {/* <ButtonComponent title={"Save Changes"} o /> */}
                </View>
              </View>
          }
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(2),
    paddingHorizontal: wp(2),
  },
  searchContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: wp(90),
    height: hp(5),
    borderRadius: wp(50),
    paddingHorizontal: wp(2),
    marginBottom: wp(1),
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    // borderRadius: 25,
    // marginRight: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: '#FFF',
  },
  iconContainer: {
    position: 'absolute',
    bottom: wp(1),
    right: wp(1),
    // backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: To add a background for better visibility
    borderRadius: wp(10),
    padding: wp(1),
  },
  toggleSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: wp(3),
  },
  textInput: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    // backgroundColor: '#000', // Transparent overlay
    justifyContent: 'flex-end',
  },

  saveButtonContainer: {
    padding: wp(2),
    alignSelf: 'center',
  },

  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  editModalContent: {
    // backgroundColor: '#000', // Modal background
    width: wp(90),
    padding: wp(4),
    borderRadius: wp(2),
    height: hp(65)
  },

  modalContentContainer: {
    padding: wp(5),
    paddingBottom: wp(20), // Space for the submit button
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: wp(1),
    padding: wp(5)

  },
  groupName: {
    // color: "#fff",
    fontSize: hp(2),
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
    // color: COLORS.white,
    fontSize: hp(2),
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingTop: hp(3),
    paddingLeft: wp(5),
    paddingBottom: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    // position: "relative",
    justifyContent: "center",
    alignSelf: "center",
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    borderWidth: wp(0.6),
    marginBottom: wp(5)
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
  editIcon: {
    marginRight: wp(5), // Adjust to position the icon correctly
  },
});

export default GroupDetails;
