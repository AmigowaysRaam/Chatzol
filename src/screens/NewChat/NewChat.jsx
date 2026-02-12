import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../../resources/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp } from "../../resources/dimensions";
import { Louis_George_Cafe } from "../../resources/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Avatar } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { allowGroupCommunity, getSearchUser } from "../../redux/authActions";
import { createConversation } from "../../redux/authActions";

const NewChat = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // const users = useSelector((state) => state.auth.searchedUsers || []);
  const userId = useSelector((state) => state.auth.user?._id);
  const messageList = useSelector((state) => state.auth.messageList);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);  // Track the current page
  const [hasMore, setHasMore] = useState(true);
  const [users, setusersList] = useState(null);
  const [allowCommunity, setAllowCommunity] = useState(0);

  useEffect(() => {

    if (!searchTerm) return;
    setIsLoading(true);
    const lettersOnly = searchTerm.replace(/[^a-zA-Z]/g, '');
    // setLetterCount(lettersOnly.length);
    // alert(searchTerm);
    if (lettersOnly.length >= 3) {

      dispatch(getSearchUser(userId, searchTerm, page, '', (response) => {
        if (response.success) {
          const flag = response?.data
          setusersList(flag);
          setIsLoading(false)
        }
      })
      );
    }
    else {
      setIsLoading(false)
      setusersList([]);

    }

  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
    if (searchTerm === '') {
      setusersList([]);
    }
  }, [searchTerm]);


  useEffect(() => {

    dispatch(allowGroupCommunity(userId, (response) => {
      if (response.success) {
        const flag = response?.data.allowaddCommunity
        setAllowCommunity(flag)
      }
    })
    );

  }, [userId]);

  const handleNewGroup = () => {
    navigation.navigate("NewChatGroup");
  };
  const handleNewCommunity = () => {
    navigation.navigate("NewCommunity");
  };

  const HeaderComponent = ({ onbackPress }) => (
    <LinearGradient colors={["#f0f0f0", "#FFF"]} style={styles.headContainer}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.headingName,
            Louis_George_Cafe.bold.h2,
            { color: COLORS.white },
          ]}
        >
          New Chat
        </Text>
      </View>

      <TouchableOpacity onPress={onbackPress}>
        <MaterialIcons name="close" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </LinearGradient>
  );



  return (
    <View style={styles.container}>
      <HeaderComponent
        onbackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.header}>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: wp(4),

          }}
          onPress={() => handleNewGroup()}
        >
          {<AntDesign
            name="addusergroup"
            size={24}
            style={{ marginHorizontal: wp(4) }}
            color={COLORS.button_bg_color}
          />}
          <Text
            style={[
              styles.headingName,
              Louis_George_Cafe.medium.h6,
              { color: COLORS.white },
            ]}
          >
            {'New group'}
          </Text>
        </TouchableOpacity>

        {allowCommunity == 1 || allowCommunity == '1' &&
          <>
            <View
              style={{
                height: 1,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "grey",
              }}
            />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: wp(4),
              }}
              onPress={() => handleNewCommunity()}
            >
              {<FontAwesome
                name="group"
                size={24}
                style={{ marginHorizontal: wp(4) }}
                color={COLORS.button_bg_color}
              />}
              <Text
                style={[
                  styles.headingName,
                  Louis_George_Cafe.medium.h6,
                  { color: COLORS.white },
                ]}
              >
                {'New community'}
              </Text>
            </TouchableOpacity>
          </>}

      </View>

      <View
        style={{
          marginVertical: wp(4),
        }}
      >
        <Text
          style={[
            styles.eadingName,
            Louis_George_Cafe.bold.h5,
            { color: COLORS.white, textAlign: "center" },
          ]}
        >
          {"Contacts"}
        </Text>
      </View>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: "#ebecf1" },
        ]}
      >
        <TouchableOpacity style={styles.iconContainer}>
          <MaterialIcons name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={searchTerm}
          onChange={() => { setPage(1) }}
          onChangeText={setSearchTerm}
          placeholder="Search..."
          placeholderTextColor={COLORS.white}
          color={COLORS.white}
        />
        {/* <TouchableOpacity style={styles.iconStyle}>
              <MaterialIcons name="more-vert" size={24} color={COLORS.white} />
            </TouchableOpacity> */}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.white} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: wp(6), height: wp(15) }}>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await dispatch(createConversation(userId, item._id, "Initial message"))
                    navigation.navigate("ChatScreen", {
                      username: item.username,
                      userId: item._id,
                      toUserId: item._id,
                      firstname: item.fullname,
                      userProfileImage: item.image,
                      touserId: item._id,
                    });
                  } catch (error) {
                    console.error("Error in creating conversation:", error);
                  }
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: wp(2),
                }}
              >
                <Avatar.Image size={48} source={{ uri: item.image }} />
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={[styles.headingName, Louis_George_Cafe.medium.h7, { color: COLORS.white, marginStart: wp(4) }]}
                  >
                    {item?.fullname}
                  </Text>
                  <Text
                    style={[styles.headingName, Louis_George_Cafe.medium.h8, { color: COLORS.white, marginStart: wp(4) }]}
                  >
                    {item?.username}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          onEndReached={() => {
            if (!isLoading && hasMore) {
              setPage(prevPage => prevPage + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => {
            <Text
              style={[
                styles.eadingName,
                Louis_George_Cafe.bold.h7,
                { color: COLORS.white, textAlign: "center" },
              ]}
            >
              {"No Users Found"}
            </Text>
          }}
        />
      )}
    </View>
  );
};

export default NewChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    width: wp(95),
    marginHorizontal: wp(4),
    // backgroundColor: COLORS.search_bg_color,
    backgroundColor: "#ebecf1",
    paddingVertical: wp(2),
    borderRadius: wp(2),
    marginVertical: wp(2),
    alignSelf: "center",
    borderRadius: wp(3)

  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(2),
  },
  textContainer: {
    flex: 1,
    marginHorizontal: wp(2),
  },
  textInput: {
    flex: 1,
  },
  iconContainer: {
    marginRight: wp(4),
  },
  iconStyle: {
    marginLeft: wp(2),
  },
  searchContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: wp(95),
    height: hp(5),
    borderRadius: wp(50),
    paddingHorizontal: wp(3),
    marginVertical: wp(1),
    marginBottom: wp(1),
  },
});
