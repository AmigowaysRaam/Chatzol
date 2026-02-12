import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../resources/Colors";
import { useDispatch, useSelector } from "react-redux";
import { getSlamnCoversationList } from "../../redux/authActions";
import { ActivityIndicator } from "react-native-paper";

const SlamBook = () => {

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [slamConvoArr, setSlamConvoListArr] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State to track refreshing status

  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.user?._id);

  useFocusEffect(
    useCallback(() => {
      // This code will run when the screen comes into focus
      dispatch(
        getSlamnCoversationList(userId, (response) => {
          setSlamConvoListArr(response.data);
          setLoading(false);
        })
      );
      return () => { };
    }, [])
  );

  useEffect(() => {
    setLoading(true);

    dispatch(
      getSlamnCoversationList(userId, (response) => {
        // setSlamConvoListArr(response.data);
        setLoading(false);
      })
    );
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      getSlamnCoversationList(userId, (response) => {
        setSlamConvoListArr(response.data);
        setRefreshing(false);
      })
    );
  };

  const filteredConversations = slamConvoArr.filter((conversation) =>
    conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("SlamResponse", {
        userItem: item,
        touserId: item?.id,
        conversationid: item?.conversationid,
      })}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={[styles.textContainer, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
        <Text style={[styles.name, { color: COLORS.white, textTransform: "capitalize" }]}>{item.username}</Text>
        <Text style={{ color: COLORS.white, fontSize: wp(2.5) }}>{item?.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const HeaderComponent = () => (
    <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
      <View style={styles.textContainer}>
        <Text style={[styles.headingName, { color: COLORS.white }]}>Slam Conversation</Text>
      </View>
    </LinearGradient>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.black }]}>
      <HeaderComponent />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: COLORS.next_bg_color }]}>
        <TouchableOpacity style={styles.iconContainer}>
          <MaterialIcons name="search" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, { color: COLORS.white }]}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search..."
          placeholderTextColor={COLORS.text_color}
        />
      </View>

      {/* FlatList for Slam Conversations */}
      <FlatList
        style={{ marginVertical: wp(5) }}
        data={filteredConversations}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id ? item._id : `item-${index}`} // Fallback to index if _id is missing
        ListEmptyComponent={
          <View style={styles.textContainer}>
            {
              !isLoading &&
              <Text
                style={{
                  color: COLORS.next_bg_color,
                  fontSize: 20,
                  fontWeight: "bold",
                  alignSelf: "center",
                  marginTop: wp(20),
                }}
              >
                No Conversations Found
              </Text>
            }
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.button_bg_color]} />
        }
        // ListHeaderComponent={HeaderComponent}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: wp(20) }} />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: wp(96),
    height: hp(5),
    borderRadius: wp(50),
    paddingHorizontal: wp(2),
    marginTop: hp(2),
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(2),
  },
  iconContainer: {
    marginRight: wp(4),
  },
  textContainer: {
    flex: 1,
    marginHorizontal: wp(2),
  },
  headingName: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
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
    marginRight: wp(2),
    borderColor: "#888",
    borderWidth: wp(0.6),
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});

export default SlamBook;
