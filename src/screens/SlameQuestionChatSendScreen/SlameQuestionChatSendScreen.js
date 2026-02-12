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
  Alert,
  ImageBackground
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { hp, wp } from "../../resources/dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import ButtonComponent from "../../components/Button/Button";
import { getSlamnCoversationList, getUsersSlamQuestions, getUsersSlamQuestionsChat, getWallpaperArray, sendUsersSlamQuestions, sendUsersSlamQuestionsAnswers } from "../../redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { Divider } from "react-native-paper";
import { useWallpaper } from "../../context/WallpaperContext";


const SlameQuestionChatSendScreen = () => {

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [themeColor, setThemeColor] = useState("#000000");
  const [questionsArray, setQuestionsArray] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for initial loading
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { wallpaper, changeWallpaper } = useWallpaper()
  const wallpaperArray = useSelector((state) => state.auth.wallpaperList);

  const [wallpaperApi, setWallaperFromApi] = useState(null);
  const [flamesGameOption, setFlamesGameOption] = useState(null);

  const [themeSend, setWallpaper] = useState(null);



  const userId = useSelector((state) => state.auth.user?._id);

  const [chatQuestions, setChatQuestion] = useState([]);
  const route = useRoute();
  const { userItem, touserId } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    // changeWallpaper(null)
    // alert(userItem?.id)
    fnGetSlamQuestions();
    fnGetSlamQuestionsChat();
    dispatch(getWallpaperArray(userId))
    // alert(JSON.stringify(wallpaperArray))
  }, [userId]);

  const fnGetSlamQuestions = () => {
    setIsLoading(true);
    dispatch(
      getUsersSlamQuestions(userId, (response) => {
        setIsLoading(false);
        if (response.success) {
          setQuestionsArray(response.data);
          setIsLoading(false);
        } else {
          setQuestionsArray([]);
          setIsLoading(false);
        }
      })
    );
  };

  const fnGetSlamQuestionsChat = () => {
    setIsLoading(true);
    dispatch(
      getUsersSlamQuestionsChat(userId, touserId ? touserId : userItem?.touserId, (response) => {
        setIsLoading(false);
        if (response.success) {
          setChatQuestion(response.data.conversationdata)
          setWallaperFromApi(response.data.bg)
          setIsLoading(false);
        } else {
          setChatQuestion([])
          setIsLoading(false);
        }
      })
    );
  };

  // Function to handle pull-to-refresh
  const onRefresh = () => {

    setRefreshing(true);
    fnGetSlamQuestions();
    fnGetSlamQuestionsChat();
    // Re-fetch the questions
    setRefreshing(false); // Set refreshing to false once the data is fetched
  };

  const handleNavigateSendQuestions = () => {
    // navigation.replace('SlamBook');
    // alert(touserId ? touserId : userItem?.touserId)

    dispatch(
      sendUsersSlamQuestions(userId, touserId ? touserId : userItem?.touserId, selectedQuestions, themeSend, flamesGameOption, (response) => {
        if (response.success) {
          Toast.show({
            text1: 'Success',
            text2: response.message,
            type: 'success',
          });
          onRefresh();
          getSlamnCoversationList(userId)
          navigation.goBack()
        } else {
          setErrorAndLoading(response.message);
          Toast.show({
            text1: 'Error',
            text2: response.message,
            type: 'error',
          });
        }
      })
    );
  };


  const HeaderComponent = () => {
    return (
      <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Image source={{ uri: userItem?.image }} style={styles.profileImage} />
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, { color: COLORS.white }]}>
              {userItem?.fullname}
            </Text>
            {/* <Text style={[styles.about, Louis_George_Cafe.medium.h7, { color: COLORS.white }]}>
              Online
            </Text> */}
          </View>
        </View>
      </LinearGradient>
    )
  };

  const toggleQuestionSelection = (id) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((questionId) => questionId !== id);
      } else {
        if (prevSelected.length < 10) {
          return [...prevSelected, id];
        } else {
          return prevSelected;
        }
      }
    });
  };


  const renderItem = ({ item }) => {
    const isSelected = selectedQuestions.includes(item._id);
    return (
      <TouchableOpacity
        style={[styles.itemContainer, { flexDirection: "row" }]}
        onPress={() => toggleQuestionSelection(item._id)}
      >
        <View>
          <Icon
            name={isSelected ? "check-box" : "square"}
            size={24}
            color={isSelected ? "green" : "grey"}
            style={styles.checkIcon}
          />
        </View>
        <View style={styles.itemContent}>
          <Text
            style={[styles.itemText, Louis_George_Cafe.medium.h8, { color: COLORS.black }]}
          >
            {item.question}
          </Text>
        </View>
      </TouchableOpacity>
    );

  };

  // Initialize state to store answers
  const [answers, setAnswers] = useState(
    chatQuestions.reduce((acc, question) => {
      acc[question.slambookId] = ''; // Initialize each conversation's answer as an empty string
      return acc;
    }, {})
  );


  // Handle answer change for a specific conversation
  const handleAnswerChange = (slambookId, answer, conversationId) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [slambookId]: answer,
    }));
    console.log(answers, 'answers')
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleSendAnswers = (id) => {

    dispatch(
      sendUsersSlamQuestionsAnswers(userId, id, answers, (response) => {
        if (response.success) {
          Toast.show({
            text1: 'Success',
            text2: response.message,
            type: 'success',
          });
        } else {
          setErrorAndLoading(response.message);
          Toast.show({
            text1: 'Error',
            text2: response.message,
            type: 'error',
          });
        }
      })
    );
  }
  const handleSettheme = (uri) => {
    setWallpaper(uri);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColor }}>
      <View style={styles.fixedHeader}>
        <HeaderComponent />
        <Text style={{ width: wp(90), marginHorizontal: wp(10) }}>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={{ width: wp(98), alignSelf: "center" }}>
          <Text style={[styles.headingName, Louis_George_Cafe.medium.h7, { color: COLORS.white, marginStart: wp(4) }]}>
            Select Theme
          </Text>
          <FlatList
            horizontal
            data={wallpaperArray}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => handleSettheme(item?.key)}>
                  <Image
                    source={{ uri: item?.value }}
                    style={[styles.image, { borderColor: themeSend === item?.key ? COLORS.button_bg_color : "#888888" }]}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <Text
            style={[
              Louis_George_Cafe.regular.h8,
              { color: COLORS.white, marginBottom: hp(1) },
            ]}
          >
            Do you want to add FLAMES compatible game?
          </Text>
          <View style={styles.checkboxOptions}>
            <TouchableOpacity
              style={styles.roundedCheckbox}
              onPress={() => setFlamesGameOption("yes")}
            >
              <View
                style={[
                  styles.checkboxCircle,
                  flamesGameOption === "yes" && styles.checkedCircle,
                ]}
              />
              <Text
                style={[Louis_George_Cafe.medium.h7, { color: COLORS.white }]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundedCheckbox}
              onPress={() => setFlamesGameOption("no")}
            >
              <View
                style={[
                  styles.checkboxCircle,
                  flamesGameOption === "no" && styles.checkedCircle,
                ]}
              />
              <Text
                style={[Louis_George_Cafe.medium.h7, { color: COLORS.white }]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.headingName, Louis_George_Cafe.medium.h7, { color: COLORS.white, marginStart: wp(4), marginVertical: wp(1) }]}>
          Choose only 10 Questions
        </Text>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            <View style={{ width: wp(98) }}>
              {/* FlatList to display the Slam Questions */}
              <FlatList
                data={questionsArray}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshing={false}
                onRefresh={onRefresh}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </>
        )}
      </ScrollView>

      {selectedQuestions.length !== 0 && (
        <View style={styles.sendButtonContainer}>
          <ButtonComponent title={"Send"} onPress={() => handleNavigateSendQuestions()} />
        </View>
      )}
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    width: '100%',
  },
  iconContainer: {
    marginRight: 15,
    padding: wp(2),
  },
  checkboxContainer: {
    padding: hp(2),
    backgroundColor: "#000",
  },

  checkboxOptions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  roundedCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3),
  },
  checkboxCircle: {
    width: wp(6),
    height: wp(6),
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  checkedCircle: {
    backgroundColor: "green",
  },
  imageContainer: {
    marginRight: wp(2),
  },
  image: {
    width: wp(16),  // 10% of the screen width
    height: wp(16),  // 10% of the screen width for height as well
    borderRadius: wp(7) / 2,
    marginVertical: wp(2),
    borderWidth: wp(1),
    // borderColor: "#888888"
  },
  inputBox: {
    borderRadius: 10,
    maxWidth: wp(80),
    marginBottom: wp(3),
    margin: wp(0.5),
    marginTop: wp(2),
    height: wp(10),
    paddingHorizontal: wp(5),
    height: wp(15)

  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  positionContainer: {
    paddingBottom: wp(2),
    maxWidth: wp(100),
    margin: wp(2),
    marginBottom: wp(5)
  },
  positionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conversationContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",  // Transparent white color (50% opacity)
    borderRadius: 10,
    padding: wp(5),
    maxWidth: wp(75),
    marginBottom: wp(2),
  },

  conversationQuestionContainer: {
    color: "#fff",
    backgroundColor: "yellow",
    borderRadius: 10,
    padding: wp(5),
    maxWidth: wp(75),
  },
  questionText: {
    fontSize: 16,
    color: '#333',
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    height: hp(100)
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  positionContainer: {
    paddingBottom: wp(2),
    maxWidth: wp(100),
    margin: wp(2),
    marginBottom: wp(5)
  },
  positionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  conversationContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",  // Transparent white color (50% opacity)
    borderRadius: 10,
    padding: wp(5),
    maxWidth: wp(75),
    marginBottom: wp(2),
  },

  conversationQuestionContainer: {
    color: "#fff",
    backgroundColor: "yellow",
    borderRadius: 10,
    padding: wp(5),
    maxWidth: wp(75),
  },
  questionText: {
    fontSize: 16,
    color: '#333',
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    height: hp(100)
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  profileImage: {
    width: wp(11),
    height: hp(5),
    borderRadius: wp(10),
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
    width: '100%',
  },
  scrollViewContainer: {
    marginTop: hp(10), // This margin is added to prevent content from being hidden under the fixed header
    paddingBottom: hp(2),
  },
  listContainer: {
    padding: wp(5),
    // backgroundColor: "#000",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(10),
  },
  sendButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  itemContainer: {
    padding: wp(4),
    justifyContent: "center",
    paddingVertical: wp(2)
  },

  itemContainerchat: {
    backgroundColor: "grey",
    padding: wp(4),
    justifyContent: "center",
    borderRadius: 8
  },

  itemContainerchat: {
    backgroundColor: "grey",
    padding: wp(4),
    justifyContent: "center",
    borderRadius: 8
  },
  itemContent: {
    backgroundColor: "#fff",
    width: wp(77),
    borderWidth: wp(0.3),
    borderRadius: wp(2)

  },
  itemText: {
    textAlign: "justify",
    marginVertical: hp(1.4),
    marginHorizontal: wp(4),
  },
  checkIcon: {
    marginRight: wp(3),
    marginVertical: hp(1.3),
    width: wp(6),
    height: wp(6),
    borderRadius: 12,
  },
});

export default SlameQuestionChatSendScreen;
