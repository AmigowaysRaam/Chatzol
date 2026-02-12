import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
} from "react-native";
import { List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../resources/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { getCommiunityList } from "../../redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/Button/Button";
import Toast from "react-native-toast-message";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Collapsible from 'react-native-collapsible';
import { Louis_George_Cafe } from "../../resources/fonts";

const Community = () => {
  const navigation = useNavigation();
  const [expandedIds, setExpandedIds] = useState([]);
  const [showAnnouncement, setShowAnnouncement] = useState({});
  const [showDivisions, setShowDivisions] = useState({});
  const [isLoading, setIsLoading] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const userId = useSelector((state) => state.auth.user?._id);
  const [searchQuery, setSearchQuery] = useState("");
  const [communityData, setCommunityData] = useState();
  const [modalVisible, setModalVisible] = useState(false); // For controlling modal visibility
  const [editedCommunity, setEditedCommunity] = useState(null); // State for storing the community to edit

  const AccordionGroup = ({ group, level }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapse = () => {
      setCollapsed(!collapsed);
    };

    return (
      <View style={[styles.groupContainer, { marginLeft: level * 10 }]}>
        <TouchableOpacity onPress={toggleCollapse}>
          <Text style={styles.groupName}>{group.name}</Text>
        </TouchableOpacity>

        {/* Collapsible section for subgroups */}
        <Collapsible collapsed={collapsed}>
          {group.groups && group.groups.length > 0 && group.groups.map((subGroup, index) => (
            <AccordionGroup key={index} group={subGroup} level={level + 1} />
          ))}
        </Collapsible>
      </View>
    );
  };

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCommunties();
  }, [userId]);

  useEffect(() => {
    // console.log("userid",userId)
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCommunties();
    });
    return unsubscribe;
  }, [navigation, userId]);


  const fetchCommunties = () => {

    dispatch(
      getCommiunityList(userId, (response) => {

        if (response.success) {

          const responseData = response?.data || [];
          // alert(JSON.stringify(responseData))
          if (response.data.length !== 0) {
            setCommunityData(response?.data);
          }
          // setCommunityData(response?.data && response.data.length > 0 ? response.data : []);


          setRefreshing(false);
          setIsLoading(false);
        } else {
          setCommunityData([]); // Clear community data on failure
          setRefreshing(false);
          setIsLoading(false);
        }
      })
    );
  };




  const filteredCommunities = (Array.isArray(communityData) && communityData.length > 0)
    ? communityData.filter((community) =>
      community?.name && community.name.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    )
    : []; // Return empty array if communityData is not valid or empty

  const onRefresh = () => {
    setRefreshing(true);
    fetchCommunties();
  };

  const [newGroupImage, setNewGroupImage] = useState(null);

  const HeaderComponent = () => {
    return (
      <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.headingName}>Community</Text>
        </View>
      </LinearGradient>
    );
  };

  const NewChatComponent = ({ onAddPress }) => (
    <View style={styles.newChatContainer}>
      <Text style={[styles.groupText, Louis_George_Cafe.bold.h6]}>Communities</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Icon name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );



  const toggleAccordion = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAnnouncement = (id) => {
    setShowAnnouncement((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  const handlePickImage = async () => {
    // Launch image picker to select a new image
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        includeBase64: false, // Optionally include base64 if you want to use it
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
  };

  const toggleDivisions = (id) => {
    setShowDivisions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = (item, index) => {

    const renderGroups = (groups, level = 1) => {
      return groups.map((group, groupIndex) => (
        <View
          key={group._id || groupIndex}
          style={{ flexDirection: "row", justifyContent: "space-between", width: wp(75), paddingLeft: wp(level === 1 ? 0 : wp(1)) }}>
          <View style={{ flex: 1, width: wp(70), marginLeft: wp(5) }}>
            <List.Accordion
              title={group.name || 'No Group Name'}
              style={[{ backgroundColor: "#FFF" },]}
              expanded={expandedIds.includes(groupIndex)}
              onPress={() => toggleAccordion(groupIndex)}
              left={(props) => (
                <Image
                  source={{ uri: group.image }}
                  style={{
                    width: wp(7),
                    height: wp(7),
                    borderRadius: wp(4),
                    marginHorizontal: wp(1), borderWidth: wp(0.3), borderColor: COLORS.button_bg_color
                  }}
                />
              )}
              titleStyle={[styles.title, { color: COLORS.white }]}
            >
              {group.groups && group.groups.length > 0 && renderGroups(group.groups, level + 1)}
            </List.Accordion>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {item?.allow_message == 1 && (
              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('CommunitChat', { communitydata: item });
                  navigation.navigate("GroupChatScreen", { groupId: group._id, username: group.name, avatar: group.image });
                }}
              >
                <MaterialCommunityIcons
                  name="message-outline"
                  size={24}
                  color={COLORS.white}
                  style={{
                    alignSelf: "flex-end",
                    padding: wp(1),
                    borderRadius: wp(4),
                    marginTop: wp(1.5)
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ));
    };

    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
        <View style={{ width: wp(75), flex: 1 }}>
          <List.Accordion
            title={item?.name || 'No Community Name'}
            style={[{ backgroundColor: COLORS.black },]}
            expanded={expandedIds.includes(index)}
            onPress={() => toggleAccordion(index)}
            left={(props) => (
              <Image
                source={{ uri: item?.image }}
                style={{
                  width: wp(7),
                  height: wp(7),
                  borderRadius: wp(4),
                  marginHorizontal: wp(1), borderWidth: wp(0.3), borderColor: COLORS.button_bg_color
                }}
              />
            )}
            titleStyle={[styles.title, { color: COLORS.white, fontWeight: "900" }]}
          >
            {renderGroups(item.groups)}
          </List.Accordion>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {item?.allow_message == 1 && (
            <TouchableOpacity
              onPress={() => {
                // alert("xvcjkxvcjkhvcxjkhkjhjk")
                navigation.navigate('CommunitChat', { communitydata: item });
              }}
            >
              <MaterialCommunityIcons
                name="message-outline"
                size={24}
                color={COLORS.white}
                style={{
                  alignSelf: "flex-end",
                  padding: wp(1.5),
                  borderRadius: wp(4),
                  marginTop: wp(5),
                }}
              />
            </TouchableOpacity>
          )}
          {item?.allow_edit == 1 && (
            <TouchableOpacity
              onPress={() => {
                setEditedCommunity(item); // Set community to be edited
                setModalVisible(true); // Open the modal
                setNewGroupImage(item?.image); // Set community to be edited
              }}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={24}
                color={COLORS.white}
                style={{
                  alignSelf: "flex-end",
                  padding: wp(1.5),
                  borderRadius: wp(4),
                  marginTop: wp(5),
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };


  const onNewCommunity = () => {
    navigation.navigate("NewCommunity");
  };

  const handleSaveChanges = async () => {
    if (editedCommunity) {
      // Save the changes (you might dispatch an action here)
      const formData = new FormData();
      formData.append('name', editedCommunity?.name);
      formData.append('userid', userId);
      formData.append('communityid', editedCommunity?._id);
      formData.append('bio', editedCommunity?.bio);

      if (newGroupImage) {
        formData.append('image', {
          uri: newGroupImage,
          type: 'image/jpeg',
          name: 'groupImage.jpg',
        });
      }
      // setModalVisible(false); // Close the modal after saving

      try {
        const response = await fetch('https://chatzol.scriptzol.in/api/?url=app-update-community', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          Toast.show({
            text1: 'Success!',
            text2: data.message,
            type: 'success',
            position: 'top',
          });
          fetchCommunties();
          setIsLoading(false);
          setModalVisible(false)

        } else {
          Toast.show({
            text1: 'Error!',
            text2: data.message,
            type: 'error',
            position: 'top',
          });
          setIsLoading(false);
          setModalVisible(false)
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
  };

  return (
    <>
      <HeaderComponent />
      <ScrollView
        style={styles.parentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.green}
          />
        }
      >
        <NewChatComponent onAddPress={onNewCommunity} />
        <View style={[styles.searchContainer, {
          backgroundColor: COLORS.search_bg_color
        }]}>
          <TouchableOpacity style={[styles.iconContainer, { marginHorizontal: wp(2) }]}>
            <MaterialIcons name="search" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Search..."
            placeholderTextColor={COLORS.white}
            value={searchQuery}
            onChangeText={(text) => {
              const updatedText = text.trim();
              setSearchQuery(updatedText);
            }}
          />
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.white} />
          </View>
        ) : (
          <View style={styles.container}>
            {filteredCommunities?.length > 0 ? (
              filteredCommunities?.map((item, index) => renderItem(item, index))
            ) : (
              <Text style={[styles.noCommunitiesText, Louis_George_Cafe.bold.h6]}>No communities found</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Community Modal */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color={COLORS.white} alignSelf="flex-end" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={handlePickImage}
            >
              <Image
                source={{ uri: newGroupImage }}
                style={[styles.profileImage, {
                  borderColor: COLORS.button_bg_color
                }]}
              />
              {/* Pen Icon positioned on top of the image */}
              <View style={styles.iconContainerPen}>
                <Ionicons name="pencil-outline" size={30} color={COLORS.white} />

              </View>
            </TouchableOpacity>
            <TextInput
              placeholderTextColor="#555" // Dark grey color for the placeholder
              style={styles.modalInput}
              placeholder="Community Name"
              value={editedCommunity?.name}
              onChangeText={(text) =>
                setEditedCommunity((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              placeholderTextColor="#555" // Dark grey color for the placeholder
              style={styles.modalInput}
              placeholder="Community Description"
              value={editedCommunity?.bio}
              onChangeText={(text) =>
                setEditedCommunity((prev) => ({ ...prev, bio: text }))
              }
            />
            <View style={styles.saveButtonContainer}>
              <ButtonComponent title={"Save Changes"} onPress={() => {
                handleSaveChanges()
              }} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    backgroundColor: "#FFF",
  },
  saveButtonContainer: {
    marginTop: 'auto', // This pushes the button to the bottom
    alignSelf: 'center',
  },
  profileImageContainer: {
    // position: "relative",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: wp(5),

  },
  parentContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: hp(50),
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: "#000",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  headingName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: wp(90),
    height: hp(5),
    borderRadius: wp(5),
    paddingHorizontal: wp(1),
    // backgroundColor: "#999",
    marginTop: wp(5),
  },
  textInput: {
    flex: 1,
    color: "#000",
  },
  newChatContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(90),
    justifyContent: "space-between",
  },
  groupText: {
    marginHorizontal: wp(5),
    marginBottom: wp(0),
    alignSelf: "center",
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderWidth: wp(0.6),
    marginBottom: wp(5),
    borderWidth: wp(0.8),
    borderRadius: wp(25) / 2
  },
  addButton: {
    borderColor: "#a020cb",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: wp(-5),
  },
  noCommunitiesText: {
    // color: "white",
    textAlign: "center",
    marginTop: hp(10),
    // fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FAFAFA",
    padding: wp(5),
    borderRadius: 10,
    width: wp(80),
  },
  iconContainerPen: {
    position: 'absolute',
    bottom: 5,
    left: wp(15),
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: To add a background for better visibility
    borderRadius: 20,
    padding: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});

export default Community;
