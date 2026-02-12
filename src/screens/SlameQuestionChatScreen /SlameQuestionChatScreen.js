import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp } from "../../resources/dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import ButtonComponent from "../../components/Button/Button";
import { getUsersSlamQuestions, sendUsersSlamQuestions } from "../../redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";

const SlameQuestionChatScreen = () => {
  const [themeColor, setThemeColor] = useState("#000000");
  const [questionsArray, setQuestionsArray] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [inputs, setInputs] = useState({});

  const userId = useSelector((state) => state.auth.user?._id);
  const route = useRoute();
  const { userItem } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    fnGetSlamQuestions();
  }, [userId]);

  const fnGetSlamQuestions = () => {
    setIsLoading(true);

    dispatch(
      getUsersSlamQuestions(userId, (response) => {
        setIsLoading(false);
        if (response.success) {
          setQuestionsArray(response.data);
        } else {
          setQuestionsArray([]);
        }
      })
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fnGetSlamQuestions();
    setRefreshing(false);
  };

  const handleNavigateSendQuestions = () => {
    const selectedQuestions = Object.entries(inputs)
      .filter(([key, value]) => value.trim() !== "")
      .map(([key, value]) => ({
        questionId: key,
        answer: value,
      }));

    alert(JSON.stringify(selectedQuestions))

    if (selectedQuestions.length === 0) {
      Toast.show({
        text1: "Error",
        text2: "You need to provide answers for at least one question.",
        type: "error",
      });
      return;
    }

    // dispatch(
    //   sendUsersSlamQuestions(userId, userItem._id, selectedQuestions, (response) => {
    //     if (response.success) {
    //       Toast.show({
    //         text1: "Success",
    //         text2: response.message,
    //         type: "success",
    //       });
    //       setTimeout(() => {
    //         navigation.goBack();
    //       }, 1000);
    //     } else {
    //       Toast.show({
    //         text1: "Error",
    //         text2: response.message,
    //         type: "error",
    //       });
    //     }
    //   })
    // );
  };

  const handleInputChange = (questionId, value) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [questionId]: value,
    }));
  };

  const HeaderComponent = () => (
    <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image source={{ uri: userItem?.image }} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={[Louis_George_Cafe.bold.h4, { color: COLORS.white }]}>
            {userItem?.fullname}
          </Text>
          <Text style={[styles.about, Louis_George_Cafe.medium.h7, { color: COLORS.white }]}>
            Online
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text
        style={[
          styles.itemText,
          Louis_George_Cafe.medium.h8,
          { color: COLORS.white, marginBottom: hp(1) },
        ]}
      >
        {index + 1}. {item.question}
      </Text>
      <TextInput
        style={styles.inputField}
        value={inputs[item._id] || ""}
        onChangeText={(text) => handleInputChange(item._id, text)}
        placeholder="Type your answer here"
        placeholderTextColor={COLORS.grey}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColor }}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <HeaderComponent />
        <Text style={{ width: wp(90), marginHorizontal: wp(10) }}>
          <Toast ref={(ref) => Toast.setRef(ref)} /> {/* Initialize Toast */}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Show loading spinner while fetching questions */}
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.cardContainer}>
            <FlatList
              data={questionsArray}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </View>
        )}
      </ScrollView>

      {/* Send Button */}
      <View style={styles.sendButtonContainer}>
        <ButtonComponent title={"Send"} onPress={handleNavigateSendQuestions} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    width: "100%",
  },
  iconContainer: {
    marginRight: 15,
    padding: wp(2),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  profileImage: {
    width: wp(15),
    height: hp(7),
    borderRadius: wp(3),
    marginHorizontal: wp(3),
  },
  textContainer: {
    justifyContent: "center",
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    width: "100%",
  },
  scrollViewContainer: {
    marginTop: hp(10), // Added to prevent the header from overlapping
    paddingBottom: hp(2),
  },
  cardContainer: {
    backgroundColor: "#1A1A1A", // Dark background for the card
    padding: wp(4),
    borderRadius: 12, // Rounded corners for the whole card
    marginHorizontal: wp(5), // Push the card slightly from the edges
  },
  itemContainer: {
    marginBottom: hp(1),
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
  },
  itemText: {
    textAlign: "left",
    color: COLORS.white,
  },
  inputField: {
    backgroundColor: "#fff",
    width: wp(70),
    height: hp(5),
    marginTop: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: 8,
    color: COLORS.black,
  },
  sendButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(2),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
});

export default SlameQuestionChatScreen;
