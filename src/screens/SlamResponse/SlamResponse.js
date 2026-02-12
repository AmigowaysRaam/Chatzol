import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Alert,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { hp, wp } from "../../resources/dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import ButtonComponent from "../../components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { checkFlames, getUsersSlamQuestions, getUsersSlamQuestionsChat, sendUsersSlamQuestions, sendUsersSlamQuestionsAnswers } from "../../redux/authActions";
import { useWallpaper } from "../../context/WallpaperContext";
import { Divider } from "react-native-paper";
import FlameScreen from "../FlameScreen/FlameScreen";

const SlamResponse = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [themeColor, setThemeColor] = useState("#000000");
  const [questionsArray, setQuestionsArray] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { wallpaper, changeWallpaper } = useWallpaper();
  const wallpaperArray = useSelector((state) => state.auth.wallpaperList);
  const [wallpaperApi, setWallaperFromApi] = useState(null);
  const [flamesGameOption, setFlamesGameOption] = useState(null);
  const [themeSend, setWallpaper] = useState(null);
  const userId = useSelector((state) => state.auth.user?._id);
  const [chatQuestions, setChatQuestion] = useState([]);
  const flamesResults = useSelector((state) => state.flames);

  const [flameresult, setflameResult] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [showFlames, setShowFlames] = useState(null);
  const [yourName, setYourName] = useState(null);
  const [friendName, setFriendName] = useState(null);

  const [allowRespond, setAllowRespond] = useState(null);



  const route = useRoute();
  const { userItem, touserId, conversationid } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    fnGetSlamQuestions();
    fnGetSlamQuestionsChat();
  }, [userId]);

  const fnGetSlamQuestions = () => {
    setIsLoading(true);
    dispatch(
      getUsersSlamQuestions(userId, (response) => {
        console.log("Slam Questions Response:", response); // Debugging response
        setIsLoading(false);
        if (response.success) {
          setQuestionsArray(response.data);
        } else {
          setQuestionsArray([]);
        }
      })
    );
  };

  const fnGetSlamQuestionsChat = () => {
    setIsLoading(true);
    dispatch(
      getUsersSlamQuestionsChat(userId, touserId ? touserId : userItem?.touserId, conversationid, (response) => {
        console.log("Slam Questions Chat Response:", response.data[0].conversationData); // Debugging response
        setIsLoading(false);

        if (response.success) {
          setChatQuestion(response.data[0].conversationData); // Set questions
          setWallaperFromApi(response.data[0].bgUrl);
          setShowFlames(response.data[0].allowFlames);
          setAllowRespond(response.data[0].allowResponse);

          // Populate answers state with response values
          const newAnswers = response.data[0].conversationData.reduce((acc, question) => {
            acc[question.slambookId] = question.response || ""; // Default to empty string if no response
            return acc;
          }, {});
          console.log("Answers populated:", newAnswers); // Debugging answer population
          setAnswers(newAnswers);
        } else {
          setChatQuestion([]);
        }
      })
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fnGetSlamQuestions();
    fnGetSlamQuestionsChat();
    setRefreshing(false);
  };

  const toggleQuestionSelection = (id) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((questionId) => questionId !== id);
      } else {
        if (prevSelected.length < 5) {
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
          <Text style={[styles.itemText, Louis_George_Cafe.medium.h8, { color: COLORS.black }]}>
            {item.question}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [answers, setAnswers] = useState(
    chatQuestions.reduce((acc, question) => {
      acc[question.slambookId] = ""; // Initialize each conversation's answer as an empty string
      return acc;
    }, {})
  );

  const handleAnswerChange = (slambookId, answer, conversationId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [slambookId]: answer,
    }));
    console.log("Updated answers:", answers);
  };

  const handleSendAnswers = (id) => {
    dispatch(
      sendUsersSlamQuestionsAnswers(userId, id, answers, conversationid, (response) => {
        if (response.success) {
          Toast.show({
            text1: "Success",
            text2: response.message,
            type: "success",
          });
          setTimeout(() => {
            navigation.goBack()
          }, 1000)
        } else {
          Toast.show({
            text1: "Error",
            text2: response.message,
            type: "error",
          });
        }
      })
    );
  };

  const handleNavigateSendQuestions = () => {
    handleSendAnswers();

    // dispatch(
    //   sendUsersSlamQuestions(userId, touserId ? touserId : userItem?.touserId, selectedQuestions, (response) => {
    //     if (response.success) {
    //       Toast.show({
    //         text1: 'Success',
    //         text2: response.message,
    //         type: 'success',
    //       });
    //       onRefresh();
    //       getSlamnCoversationList(userId);
    //       navigation.goBack()
    //     } else {
    //       setErrorAndLoading(response.message);
    //       Toast.show({
    //         text1: 'Error',
    //         text2: response.message,
    //         type: 'error',
    //       });
    //     }
    //   })
    // );
  };

  const HeaderComponent = () => {
    return (
      <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Image source={userItem?.image ? { uri: userItem?.image } : ""} style={styles.profileImage} />
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, { color: COLORS.white }]}>
              {userItem?.fullname}
            </Text>
          </View>
        </View>
        <Divider />
      </LinearGradient>
    );
  };

  const handleTOFlameResult = async () => {

    if (!yourName || !friendName) {
      Alert.alert("Please fill in both names");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();
    console.log(userId, yourName, friendName)

    try {
      await dispatch(checkFlames(userId, yourName, friendName))
        .then((data) => {
          setIsLoading(false);
          console.log("data", data)
          if (data) {
            setflameResult(data?.result)
            setResultImage(data?.image);
          } else {
            setIsLoading(false);
            // Alert.alert(data.message);
          }
        })
        .catch((error) => {
          console.log("err", error)
          setIsLoading(false);
          // Alert.alert("Registration Failed", error.message);
        });


      // setIsLoading(false); 
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColor }}>
      <View style={styles.fixedHeader}>
        <HeaderComponent />
        <Text style={{ alignSelf: "center" }}>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </Text>
      </View>


      <ImageBackground source={wallpaperApi ? { uri: wallpaperApi } : ""} style={styles.imageBackground}>

        {showFlames === 1 ?
          <>
            <View style={styles.inputFieldsContainer}>
              <Text style={[styles.title, Louis_George_Cafe.bold.h1, {
                color: COLORS.white, marginBottom: wp(5),
                textShadowColor: '#000', // Stroke color (black in this case)
                textShadowOffset: { width: 2, height: 2 }, // Stroke offset
                textShadowRadius: 5,
                textAlign: "center",
              }]}>Flames</Text>

              <TextInput
                placeholder="Your Name"
                value={yourName}
                onChangeText={(text) => {
                  setYourName(text);        // Update yourName state
                  setResultImage(null);      // Reset resultImage to null
                  setflameResult(null);      // Reset flameResult to null
                }}
                style={[styles.inputBox, { backgroundColor: COLORS.input_background, color: "#000" }]}
              />

              <TextInput
                placeholder="Friend's Name"
                value={friendName}
                onChangeText={(text) => {
                  setFriendName(text);      // Update friendName state
                  setResultImage(null);      // Reset resultImage to null
                  setflameResult(null);      // Reset flameResult to null
                }}
                style={[styles.inputBox, { backgroundColor: COLORS.input_background, color: "#000" }]}
              />

            </View>

            <View style={styles.sendButtonContainer}>
              <TouchableOpacity
                onPress={handleTOFlameResult}
                style={[styles.sendButon, {
                  backgroundColor: '#4CAF50',
                  width: wp(45),              // Set button width to 45% of screen width
                  height: hp(5),              // Increase height to 6% of screen height for better visibility
                  alignSelf: "center",        // Center button horizontally within the container
                  justifyContent: "center",   // Center the text vertically
                  alignItems: "center",       // Ensure the text is centered horizontally as well
                  borderRadius: wp(10),        // Rounded corners for the button
                }]}
              >
                <Text style={{
                  color: 'white',        // Text color
                  fontSize: 16,          // Font size of the button text
                  fontWeight: 'bold',
                }}>Check</Text>
              </TouchableOpacity>
            </View>
            <Text style={[Louis_George_Cafe.bold.h1, { color: COLORS.white, textAlign: "center", marginTop: wp(10) }]}>{flameresult}</Text>

            <View style={styles.resultContainer}>
              {/* <Text style={[styles.resultText, { color: COLORS.white }]}>
                {flamesResults}
              </Text> */}
              {resultImage && ( // Check if resultImage is not null
                <Image
                  source={resultImage ? { uri: resultImage } : ""}
                  style={styles.resultImage}
                />
              )}
            </View>


          </>
          :
          <>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <View
                style={[
                  styles.positionContainer,
                  {
                    alignItems: "flex-start",
                    marginTop: wp(5),
                    marginVertical: wp(1)
                  },
                ]}
              >
                <FlatList
                  data={chatQuestions}
                  keyExtractor={(conversation) => conversation.conversationId}
                  renderItem={({ item }) => (
                    <>
                      <View style={[styles.conversationContainer,]}>
                        <Text style={styles.questionText}>{item.question}</Text>
                      </View>
                      <TextInput
                        editable={allowRespond === 1}
                        placeholder={allowRespond === 1 ? 'Your Answer' : ''}
                        placeholderTextColor={COLORS.white}
                        value={answers[item.slambookId]}
                        onChangeText={(text) => handleAnswerChange(item.slambookId, text, item.conversationId)}
                        style={[styles.inputBox, { backgroundColor: allowRespond !== 1 ? COLORS.next_bg_color : COLORS.button_bg_color, color: "white" }]}
                      />
                    </>
                  )}
                />
              </View>
              {/* ))} */}
            </ScrollView>

            {
              allowRespond === 1 &&
              <TouchableOpacity
                onPress={() => handleNavigateSendQuestions()} // Assuming this is the onPress handler
                style={[styles.senButton, {
                  backgroundColor: resultImage ? '#4CAF50' : "#c3c3c3",
                  width: wp(100),        // Button width is full screen width
                  height: hp(5),              // Increase height to 6% of screen height for better visibility
                  alignSelf: "center",        // Center button horizontally within the container
                  justifyContent: "center",   // Center the text vertically
                  alignItems: "center",       // Ensure the text is centered horizontally as well
                  borderRadius: wp(1),
                }]}
              >
                <Text style={[styles.buttonText, { color: "#000" }]}>{"Submit"}</Text>
              </TouchableOpacity>
            }
          </>
        }

        <View style={[styles.sendButtonContainer, {
          position: 'absolute',  // Fixes the button at the bottom of the screen
          bottom: 0,             // Aligns it to the bottom of the screen
          width: wp(100),        // Takes full width of the screen
        }]}>
          {
            showFlames === 1 &&
            <TouchableOpacity
              onPress={() => resultImage && setShowFlames(showFlames === 1 ? 0 : 1)}  // Assuming this is the onPress handler
              style={[styles.senButton, {
                backgroundColor: resultImage ? '#4CAF50' : "#c3c3c3",
                width: wp(100),        // Button width is full screen width
                height: hp(5),              // Increase height to 6% of screen height for better visibility
                alignSelf: "center",        // Center button horizontally within the container
                justifyContent: "center",   // Center the text vertically
                alignItems: "center",       // Ensure the text is centered horizontally as well
                borderRadius: wp(1),
              }]}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>{"Next"}</Text>
            </TouchableOpacity>
          }

        </View>
      </ImageBackground>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  sendButtonContainer: {
    alignItems: 'center',    // Centers the button horizontally
    justifyContent: 'center', // Centers the button vertically
    marginVertical: wp(10),      // Adds some space on top and bottom of the button
    paddingHorizontal: wp(4),   // Optional: Horizontal padding for the container
  },
  resultContainer: {
    alignItems: "center",
    // marginTop: hp(2),
  },
  sendButton: {
    width: wp(100),          // Takes full width of the container
    paddingVertical: wp(3),    // Vertical padding for button size
    borderRadius: wp(1),       // Rounded corners
    justifyContent: 'center',  // Ensures the content is centered
    alignItems: 'center',   // Centers the text inside the button
  },
  resultText: {
    fontSize: hp(3),
    fontWeight: "bold",
    // marginTop: hp(2),
  },
  buttonText: {
    color: 'white',        // Text color
    fontSize: 18,          // Font size of the button text
    fontWeight: 'bold',    // Makes the text bold
  },
  positionContainer: {
    paddingBottom: wp(2),
    maxWidth: wp(100),
    margin: wp(2),
    marginTop: wp(5),
  },
  // Container for the input fields with responsive margins and padding
  inputFieldsContainer: {
    marginTop: hp(10),
    marginHorizontal: wp(5),
    paddingBottom: hp(3),
    // height: hp(100),
  },
  resultImage: {
    width: wp(60),
    height: hp(30),
    resizeMode: "contain",
  },


  // Styling for each input field with responsive height, width, and padding
  inputBox: {
    height: hp(6),             // 6% of the screen height for each input
    borderColor: '#ccc',       // Border color
    borderWidth: 1,            // Border width
    borderRadius: wp(2),       // Border radius set as 2% of the screen width
    marginBottom: hp(2),       // 2% of the screen height between input fields
    paddingHorizontal: wp(4),  // Padding inside the input fields (4% of screen width)
    fontSize: wp(4),           // Font size for the input text (4% of screen width)
    color: '#FFFFFF',          // Text color for the input fields
  },

  // Container for the send button with responsive margins and padding
  sendButtonContainer: {
    marginTop: hp(3),          // 3% of the screen height above the button
    alignItems: 'center',      // Center the button horizontally
  },

  // Button styling with responsive padding
  sendButton: {
    paddingVertical: hp(2),    // Vertical padding for the button (2% of screen height)
    paddingHorizontal: wp(10), // Horizontal padding for the button (10% of screen width)
    borderRadius: wp(3),       // Rounded corners for the button (3% of screen width)
    justifyContent: 'center',  // Center the content of the button
    alignItems: 'center',      // Align text in the center of the button
    width: wp(80),             // Button width is 80% of the screen width
  },

  // Button text styling with responsive font size
  buttonText: {
    color: '#fff',             // White text color for the button text
    fontSize: wp(5),           // Font size of the button text (5% of the screen width)
    fontWeight: 'bold',        // Bold font style for the text
  },
  scrollViewContainer: {
    marginTop: hp(5), // This margin is added to prevent content from being hidden under the fixed header
    paddingBottom: hp(2),
  },
  conversationContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",  // Transparent white color (50% opacity)
    borderRadius: 10,
    padding: wp(2),
    width: wp(92),
    marginBottom: wp(1),
    justifyContent: "center",
    marginVertical: wp(1)
  },
  questionText: {
    fontSize: 16,
    color: '#333',
  },
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    width: wp(100),
  },
  inputBox: {
    borderRadius: 10,
    maxWidth: wp(98),
    marginBottom: wp(3),
    margin: wp(0.5),
    marginTop: wp(0),
    paddingHorizontal: wp(5),
    height: wp(12)

  },
  conversationQuestionContainer: {
    color: "#fff",
    backgroundColor: "yellow",
    borderRadius: 10,
    padding: wp(5),
    maxWidth: wp(75),
  },
  iconContainer: {
    marginRight: 15,
    padding: wp(2),
  },
  checkboxContainer: {
    padding: hp(2),
    backgroundColor: "#000",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    height: hp(100),
    // opacity: 0.6,    // Set image opacity (0 is fully transparent, 1 is fully opaque)

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
    width: "100%",
  },
  sendButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  itemContainer: {
    padding: wp(4),
    justifyContent: "center",
    paddingVertical: wp(2),
  },
  itemContent: {
    backgroundColor: "#fff",
    width: wp(77),
    borderWidth: wp(0.3),
    borderRadius: wp(2),
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

export default SlamResponse;
