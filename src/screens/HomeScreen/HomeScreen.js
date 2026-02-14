import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  BackHandler, Modal,
  TouchableWithoutFeedback
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { LinearGradient } from "expo-linear-gradient";
import { Louis_George_Cafe } from "../../resources/fonts";
import { COLORS } from "../../resources/Colors";
import { useSelector, useDispatch } from "react-redux";
import { deleteeChatUsers, deleteMessages, getListConversation, getSiteSettings, getUserProfile, makeFavChatUsers, muteChatUsers, pinChatinHome, updateUserStatus } from "../../redux/authActions";
import messaging from '@react-native-firebase/messaging';
import moment from "moment";
import { AppState } from 'react-native';
import Toast from "react-native-toast-message";
import firestore from '@react-native-firebase/firestore';
import InCallManager from 'react-native-incall-manager';



const SelectionHeader = ({
  selectedChats,
  exitSelectionMode,
  fnDeleteConvo,
  fnHandleMuteConvo,
  fnPinChat,
  fnFavourotConvo,
}) => {

   const isPinnedSelected = selectedChats.some(item => item.pinChart == 1);
const isMutedSelected = selectedChats.some(item => item.muted == 1);
const isFavouriteSelected = selectedChats.some(item => item.favourited == 1);
  return (
    <View style={{
      height: 70,
      backgroundColor: "#a020cb",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15
    }}>
      
      {/* Back Button */}
      <TouchableOpacity onPress={exitSelectionMode}>
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Selected Count */}
      <Text style={{
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
      }}>
        {selectedChats.length}
      </Text>

      {/* Action Icons */}
      <View style={{ flexDirection: "row" }}>

       <TouchableOpacity onPress={fnPinChat}>
  <MaterialCommunityIcons
    name={isPinnedSelected ? "pin-off-outline" : "pin-outline"}
    size={24}
    color="white"
    style={{ marginHorizontal: 10 }}
  />
</TouchableOpacity>

<TouchableOpacity onPress={fnHandleMuteConvo}>
  <Icon
    name={isMutedSelected ? "volume-high-outline" : "volume-mute-outline"}
    size={24}
    color="white"
    style={{ marginHorizontal: 10 }}
  />
</TouchableOpacity>

<TouchableOpacity onPress={fnFavourotConvo}>
  <Icon
    name={isFavouriteSelected ? "heart" : "heart-outline"}
    size={24}
    color="white"
    style={{ marginHorizontal: 10 }}
  />
</TouchableOpacity>

<TouchableOpacity onPress={fnDeleteConvo}>
  <Icon
    name={"trash-outline"}
    size={24}
    color="white"
    style={{ marginHorizontal: 10 }}
  />
</TouchableOpacity>

      </View>
    </View>
  );
};


const HomeScreen = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);
  const conversationList = useSelector((state) => state.auth.conversationList);
  const profile = useSelector((state) => state.auth.profile);
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [proPicModal, setProfileModalOpen] = useState(false);
  const [proPic, setProPic] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);


 

  const handleLongPress = (item) => {
  setIsSelectionMode(true);
  setSelectedChats([item]);
};

const handleSelectItem = (item) => {
  if (!isSelectionMode) {
    handleUserClick(
      item.touserId,
      item.name,
      item.type,
      item.groupId,
      item.firstname,
      item.avatar,
      item?.muted
    );
    return;
  }

  const alreadySelected = selectedChats.find(chat => chat.id === item.id);

  if (alreadySelected) {
    const updated = selectedChats.filter(chat => chat.id !== item.id);
    setSelectedChats(updated);

    if (updated.length === 0) {
      setIsSelectionMode(false);
    }
  } else {
    setSelectedChats([...selectedChats, item]);
  }
};




const exitSelectionMode = () => {
  setIsSelectionMode(false);
  setSelectedChats([]);
};


  useEffect(() => {
    // alert(JSON.stringify(profile.username))
    const backAction = () => {
      dispatch(updateUserStatus(userId, "offline"));
    };
    // Add event listener for back press
    BackHandler.addEventListener('hardwareBackPress', backAction);
    // Clean up the event listener when the component is unmounted
    return () => {
      // dispatch(updateUserStatus(userId, "online"));
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  useEffect(() => {
    onFocusHandler();
    // alert(profile);
    fetchConversations();
    dispatch(getSiteSettings(userId));
  }, []);

  useEffect(() => {
    const fetchFCMToken = async () => {
      try {
        // Request permission (if not done previously)
        await messaging().requestPermission();
        // Get the FCM token
        const token = await messaging().getToken();
        console.log('FCM Token::', token);

        // Save token to AsyncStorage (or state) for later use
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };

    fetchFCMToken();
    return () => { };
  }, []); // Empty dependency arr

  useEffect(() => {
    onFocusHandler();
    if (!userId) {
      navigation.navigate("LoginScreen");
    }
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
      return () => {
      };
    }, [])
  );

  const fetchConversations = () => {
    setLoading(true);
    // alert(viewModex)
    dispatch(getListConversation(userId, viewMode)),
      dispatch(getUserProfile(userId))
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, [viewMode])


  useFocusEffect(
    React.useCallback(() => {
      // Component is focused
      onFocusHandler();
      // Cleanup function when unfocused
      return () => {
        // Component is unfocused
        // onBlurHandler();
      };
    }, [])
  );

  const onFocusHandler = () => {
    dispatch(updateUserStatus(userId, "online"));
  };

  const onBlurHandler = () => {
    if (AppState.currentState !== 'active') {
      dispatch(updateUserStatus(userId, "offline"));
    }
  };

  const onRefresh = () => {
    onFocusHandler();
    setRefreshing(true);
    fetchConversations();
    setRefreshing(false);
  };

  const chats = conversationList?.map((convo, index) => ({
    id: index + 1,
    muted: convo.muted,
    name: convo.username,
    lastMessage: convo.lastmessage,
    timestamp: moment(convo.lastmessagetimestamp).utc().format('hh:mm A'),
    avatar: convo.image,
    seen: false,
    unreadcount: convo.unreadcount,
    lastmessagetimestamp: convo.lastmessagetimestamp ? moment(convo.lastmessagetimestamp).utc().format('D/MM/y hh:mm A') : "",
    type: convo.type,
    groupId: convo?._id,
    firstname: convo.name || convo.username,
    touserId: convo?._id,
    favourited: convo?.favourited,
    pinChart: convo?.pinned
  })) || [];

//   const chats = conversationList?.map((convo, index) => ({
//   id: index + 1,
//   name: convo.username,
//   lastMessage: convo.lastmessage,
//   timestamp: moment(convo.lastmessagetimestamp).format("hh:mm A"),
//   avatar: convo.image,
//   firstname: convo.name || convo.username,
//   touserId: convo?._id,
//   muted: convo.muted,
//   pinChart: convo.pinned,
//   favourited: convo.favourited
// })) || [];

  

  // Filter chats based on the search term
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleUserClick = (userId, username, type, groupId, firstname, avatar, muted) => {
    if (type === "user") {
      navigation.navigate("ChatScreen", { touserId: userId, username, firstname, userProfileImage: avatar, muted }
      );
    }
    else {
      navigation.navigate("GroupChatScreen", { groupId, username, avatar });
    }
  };

  const handledCallsRef = useRef(new Set());

  useEffect(() => {
    InCallManager.stopRingtone();

    if (!profile?.username) return;

    const unsubscribe = firestore()
      .collection('calls')
      .where('targetUserId', '==', profile.username)
      .where('callEnded', '==', false)
      .onSnapshot(snapshot => {
        const now = Date.now();

        snapshot.forEach(doc => {
          const data = doc.data();
          const callId = doc.id;
          // Prevent handling the same call more than once
          if (handledCallsRef.current.has(callId)) return;
          const callCreatedAt = data?.createdAt?.toMillis?.() || 0;
          const isRecent = now - callCreatedAt < 15000; // only handle calls from last 15s
          const isRinging = data?.status === 'ringing';

          if (data?.offer && isRecent) {
            handledCallsRef.current.add(callId);

            const callApiId = data.apiCallId;
            const callerName = data?.callerName || 'Unknown Caller';
            const callerPic = data?.callerPic || null;

            InCallManager.startRingtone();

            navigation.navigate('AnswerCallScreen', {
              callId,
              callApiId,
              profileName: callerName,
              callerPic
            });
          }
        });
      });


    return () => {
      InCallManager.stopRingtone();
      unsubscribe();
    };
  }, [profile?.username, navigation]);

 const fnHandleMuteConvo = () => {
  selectedChats.forEach((item) => {
    dispatch(
      muteChatUsers(userId, item.name, (response) => {
        console.log(response.message);
      })
    );
  });

  exitSelectionMode();
  onRefresh();
};


const fnDeleteConvo = () => {
  selectedChats.forEach((item) => {
    dispatch(
      deleteeChatUsers(userId, item.name, (response) => {
        console.log(response.message);
      })
    );
  });

  exitSelectionMode();
  onRefresh();
};


const fnFavourotConvo = () => {
  selectedChats.forEach((item) => {
    dispatch(
      makeFavChatUsers(userId, item.name, (response) => {
        console.log(response.message);
      })
    );
  });

  exitSelectionMode();
  onRefresh();
};


  // fnPinChat 
const fnPinChat = () => {
  selectedChats.forEach((item) => {
    dispatch(
      pinChatinHome(userId, item.name, (response) => {
        console.log(response.message);
      })
    );
  });

  exitSelectionMode();
  onRefresh();
};




  const renderItem = ({ item }) => {

  const isSelected = selectedChats.find(chat => chat.id === item.id);

  return (
    <TouchableWithoutFeedback
      onLongPress={() => handleLongPress(item)}
      onPress={() => handleSelectItem(item)}
    >
      <View style={[
        styles.item,
        isSelected && { backgroundColor: "#e6d4ff" }
      ]}>

        <Image
          source={item.avatar ? { uri: item.avatar } : ""}
          style={styles.avatar}
        />

        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              Louis_George_Cafe.bold.h8,
              { color: COLORS.white }
            ]}
          >
            {item.firstname}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              styles.lastMessage,
              Louis_George_Cafe.regular.h9,
              { color: COLORS.next_bg_color }
            ]}
          >
            {item?.lastMessage}
          </Text>
        </View>

        <View style={styles.timestampContainer}>
          <Text style={[
            Louis_George_Cafe.regular.h9,
            { color: COLORS.timestamp }
          ]}>
            {item?.lastmessagetimestamp}
          </Text>

          {item.unreadcount > 0 && (
            <View style={[
              styles.circle,
              { backgroundColor: COLORS.button_bg_color }
            ]}>
              <Text style={styles.circleText}>
                {item?.unreadcount}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", marginTop: 4 }}>

  {item.muted == 1 && (
    <Icon
      name="volume-mute"
      size={16}
      color="gray"
      style={{ marginHorizontal: 4 }}
    />
  )}

  {item.pinChart == 1 && (
    <MaterialCommunityIcons
      name="pin"
      size={16}
      color="gray"
      style={{ marginHorizontal: 4 }}
    />
  )}

</View>


      </View>
    </TouchableWithoutFeedback>
  );
};


  function handleopenModalBox(item) {
    // alert(JSON.stringify(item))
    if (item?.type === "user") {
      setSelectedId(item);
      setModalOpen(true);
    }
  }

  const handleShowProfilePic = (profilePic) => {
    setProfileModalOpen(!proPicModal)
    // alert(profilePic);
    setProPic(profilePic)
  }
  return (
    <View style={[styles.container, { backgroundColor: COLORS.black }]}>
      {isSelectionMode ? (
  <SelectionHeader
    selectedChats={selectedChats}
    exitSelectionMode={exitSelectionMode}
    fnDeleteConvo={fnDeleteConvo}
    fnHandleMuteConvo={fnHandleMuteConvo}
    fnPinChat={fnPinChat}
    fnFavourotConvo={fnFavourotConvo}
  />
) : (
  <HeaderComponent profile={profile} />
)}

      {/* <NewChatComponent /> */}
      <Toast zIndex={1} />
      <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <View style={{ flexDirection: 'row', alignSelf: "flex-start", marginHorizontal: hp(1) }}>
        <TouchableOpacity
          style={{
            backgroundColor: viewMode === 'all' ? "#EBACFF" : "#faecff",
            borderRadius: wp(10),
            paddingHorizontal: wp(4),
            alignSelf: "center",
            justifyContent: "center",
            marginHorizontal: wp(1),
            padding: hp(1),
          }}
          onPress={() => setViewMode('all')} // Set viewMode to 'all'
        >
          <Text style={[{ alignSelf: "center", justifyContent: "center" }, Louis_George_Cafe.bold.h9]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: viewMode === 'unread' ? "#EBACFF" : "#faecff",
            borderRadius: wp(10),
            paddingHorizontal: wp(4),
            alignSelf: "center",
            justifyContent: "center",
            marginHorizontal: wp(1),
            padding: hp(1),
          }}
          onPress={() => setViewMode('unread')} // Set viewMode to 'unread'
        >
          <Text style={[{ alignSelf: "center", justifyContent: "center" }, Louis_George_Cafe.bold.h9]}>
            Unread
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: viewMode === 'favourites' ? "#EBACFF" : "#faecff",
            borderRadius: wp(10),
            paddingHorizontal: wp(4),
            alignSelf: "center",
            justifyContent: "center",
            marginHorizontal: wp(1),
            padding: hp(1),
          }}
          onPress={() => setViewMode('favourites')} // Set viewMode to 'favourites'
        >
          <Text style={[{ alignSelf: "center", justifyContent: "center" },
          Louis_George_Cafe.bold.h9
          ]}>
            Favourites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: viewMode === 'groups' ? "#EBACFF" : "#faecff",
            borderRadius: wp(10),
            paddingHorizontal: wp(4),
            alignSelf: "center",
            justifyContent: "center",
            marginHorizontal: wp(1),
            padding: hp(1),
          }}
          onPress={() => setViewMode('groups')} // Set viewMode to 'groups'
        >
          <Text style={[{ alignSelf: "center", justifyContent: "center" }, Louis_George_Cafe.bold.h9]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      ) : (
        <FlatList
          data={conversationList?.length !== 0 ? filteredChats : []}
          keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => renderItem({ item })}
          ListEmptyComponent={<View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats available</Text>
          </View>}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      {/*  */}

      <Modal
        animationType="none"
        transparent={true}
        visible={proPicModal}
      >
        <TouchableWithoutFeedback
          onPress={() => setProfileModalOpen(!proPicModal)}
        >
          <View style={styles.modalOverlay}>
            <View style={{
              // backgroundColor: 'white',
              padding: wp(1),
              borderRadius: wp(5),
              width: wp(90),
              alignItems: 'center',
              paddingBottom: wp(3),
            }}>

              <Image source={proPic ? { uri: proPic } : ""} style={[styles.avata, {
                width: wp(80),
                height: hp(40)
              }]} />
            </View>
          </View>
        </TouchableWithoutFeedback> 
      </Modal>
      {/*  */}
      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalOpen}
     
      >
        <TouchableWithoutFeedback 
          onPress={() => setModalOpen(!modalOpen)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                onPress={() => setModalOpen(!modalOpen)}
                style={{
                  marginHorizontal: wp(2),
                  padding: wp(0.5),
                  borderRadius: wp(5),
                  alignSelf: 'flex-end',
                  marginHorizontal: wp(4),
                  marginTop: wp(2)
                }}
              >
                <Icon name="close" size={30} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fnHandleMuteConvo()} style={styles.closeButton}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h7, styles.closeButtonText, {
                }]}>{selectedId?.muted == 1 ? 'Unmute ' : "Mute "}
                  <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, styles.closeButtonText, {
                  }]}>{selectedId?.name}</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => fnDeleteConvo()} style={styles.closeButton}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h7, styles.closeButtonText, {
                }]}>{`Delete `}
                  <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, styles.closeButtonText, {
                  }]}>{selectedId?.name}</Text>
                </Text>
              </TouchableOpacity>


              <TouchableOpacity onPress={() => fnFavourotConvo()} style={styles.closeButton}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h7, styles.closeButtonText, {
                }]}>{selectedId?.favourited == '1' ? `Remove from Favourites ` : 'Favourite'}
                  
                </Text>

               
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fnPinChat()} style={styles.closeButton}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.regular.h7, styles.closeButtonText, {
                }]}>{selectedId?.pinChart == '1' ? `Remove Pin` : 'Pin Chart'}
                  
                </Text>
              </TouchableOpacity>


            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal> */}
    </View>
  );
};

const HeaderComponent = (profile) => {


  const navigation = useNavigation();

  const handleNavigateProfileScreen = () => {
    navigation.navigate("ProfileScreen");
  };

  const handleNavigateSettingScreen = () => {
    navigation.navigate("ChangePasswordScreen");
  };


  return (
    <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
      <View style={{ alignItems: "flex-start", position: 'relative', right: wp(2) }}>
        <Image
          resizeMode="contain"
          source={require('../../../src/assets/animations/chatZolTetxtL.png')}
          style={[
            styles.headingName,
            Louis_George_Cafe.bold.h2,
            { color: COLORS.white },
          ]}
        >
        </Image>
      </View>
      <View style={{
        flexDirection: "row", paddingHorizontal: wp(2),
        position: 'relative', right: wp(2)
      }}>
        <TouchableOpacity
         style={{
            borderWidth: wp(0.5),
            borderColor: "#a020cb",
            marginHorizontal: wp(2),
            padding: wp(0.5),
            borderRadius: wp(1)
          }}
        onPress={() => navigation.navigate("NewChat")}
      >
        <Icon name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: wp(0.5),
            borderColor: "#a020cb",
            marginHorizontal: wp(2),
            padding: wp(0.5),
            borderRadius: wp(4)
          }}
          onPress={() => { handleNavigateSettingScreen() }}
        >
          <Icon name="settings" size={wp(6)} color={COLORS.white} />
        </TouchableOpacity>
        

        <TouchableOpacity onPress={() => { handleNavigateProfileScreen() }}>
          <Image source={profile?.profile?.profilepicture ? { uri: profile?.profile?.profilepicture } : ""} style={{
            width: wp(8),
            height: wp(8),
            borderRadius: wp(6),
            borderColor: COLORS.button_bg_color,
            borderWidth: 2,
          }} />
        </TouchableOpacity>
      </View>
      {/* favourited */}
    </LinearGradient>
  );
};

// const NewChatComponent = () => {
//   const navigation = useNavigation();
//   return (
//     <View style={{ flexDirection: "row", alignItems: "center" }}>
//       <Text
//         style={[
//           Louis_George_Cafe.bold.h6,
//           {
//             marginHorizontal: wp(1),
          
//             alignSelf: "center",
//             color: COLORS.white,
//           }]}
//       >
        
//       </Text>
      
//     </View>
//   );
// };

const SearchComponent = ({ searchTerm, setSearchTerm }) => {
  return (
    <View style={[styles.searchContainer, { backgroundColor: COLORS.search_bg_color }]}>
      <TouchableOpacity style={styles.iconContainer}>
        <MaterialIcons name="search" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <TextInput
        style={[styles.textInput, Louis_George_Cafe.bold.h7]}
        value={searchTerm}
        onChangeText={(text) => {
          const filteredText = text.replace(/\s/g, '');
          setSearchTerm(text)
        }}
        placeholder="Search..."
        placeholderTextColor={COLORS.white}
        color={COLORS.white}
      // placeholderStyle={{ fontFamily: Louis_George_Cafe.regular.h9}} // Style the placeholder text
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingIcon: {
    width: wp(13),
    height: wp(13),
    marginHorizontal: wp(2)
  },
  headContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    paddingVertical: wp(2),
  },
  iconContainer: {
    marginRight: wp(4),
    paddingHorizontal: wp(2)
  },
  settingsBtn: {
    flexDirection: "row",
    marginHorizontal: wp(6),
  },
  textContainer: {
    flex: 1,
    marginHorizontal: wp(2),
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    alignItems: "center",
    justifyContent: "center",
    marginVertical: wp(10)
  },
  headingName: {
    // alignSelf: "center",
    width: wp(44),
    height: wp(6),
    marginVertical: wp(3)
  },
  name: {
    // fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(1.5),
  },
  avatar: {
    width: wp(12.5),
    height: wp(12.5),
    borderRadius: wp(6.25),
    borderColor: COLORS.button_bg_color,
    borderWidth: wp(0.5),
    marginRight: wp(2),
  },

  timestampContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: wp(32),
  },
  // timestamp: {
  //   marginRight: wp(2),
  // },
  circle: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    marginHorizontal: wp(4),
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: wp(96),
    height: hp(5),
    borderRadius: wp(50),
    paddingHorizontal: wp(2),
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  textInput: {
    flex: 1,
  },
  iconStyle: {
    marginLeft: wp(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: 'white',
    // padding: wp(5),
    borderRadius: wp(5),
    width: wp(80),
    alignItems: 'center',
    paddingBottom: wp(3),

  },
  modalTitle: {
    // fontSize: 18,
    fontWeight: 'bold',
    // marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    textAlign: "center",
    alignSelf: "center",
    paddingVertical: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: wp(2),
  },
  closeButtonText: {
    // color: '#000',
    // fontSize: 16,
    width: wp(80),
    textAlign: "center",
    textTransform: "capitalize"
  },

});

export default HomeScreen;
