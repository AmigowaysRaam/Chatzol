import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useDispatch, useSelector } from "react-redux";
import { checkFlames } from "../../redux/authActions";
import ButtonComponent from "../../components/Button/Button";
import { useWallpaper } from "../../context/WallpaperContext";

const FlameScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const { wallpaper, changeWallpaper } = useWallpaper()

  const [flameresult, setflameResult] = useState(null);
  const [resultImage, setResultImage] = useState(null);


  const [isLoading, setIsLoading] = useState(false);
  const [frndName, setFrndName] = useState("");
  const flamesResults = useSelector((state) => state.flames);
  const userId = useSelector((state) => state.auth.user?._id);

  const handleTOFlameResult = async () => {
    if (!name || !frndName) {
      Alert.alert("Please fill in both names");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();
    console.log(userId, name, frndName)

    try {
      await dispatch(checkFlames(userId, name, frndName))
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



  const HeaderComponent = () => (
    <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>
      <View style={[styles.textContainer]}>
        <Text style={[styles.title, Louis_George_Cafe.bold.h2, { color: COLORS.white }]}>
          Flames
        </Text>
      </View>
      {/* <TouchableOpacity style={styles.settingsBtn}>
        <MaterialIcons name="settings" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialIcons name="person" size={28} color={COLORS.white} />
      </TouchableOpacity> */}
    </LinearGradient>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <HeaderComponent />
      <ImageBackground
        source={{ uri: wallpaper ? wallpaper : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0JTGnXof5ByjBODlxpYeGsW_rK1tlLZcwLg&s" }}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, Louis_George_Cafe.bold.h1, {
            color: COLORS.white, marginBottom: wp(2),
            textShadowColor: '#000', // Stroke color (black in this case)
            textShadowOffset: { width: 2, height: 2 }, // Stroke offset
            textShadowRadius: 5, // Stroke blur radius
          }]}>Flames</Text>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS.input_background }]}
            placeholder="Add Your Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setResultImage(null);
              setflameResult(null);
            }}
            keyboardType="default"
            accessibilityLabel="Your Name"
          />
          <TextInput
            style={[styles.input, { backgroundColor: COLORS.input_background }]}
            placeholder="Add Your Friend's Name"
            value={frndName}
            onChangeText={(text) => {
              setFrndName(text);
              setResultImage(null);
              setflameResult(null);
            }}
            keyboardType="default"
            accessibilityLabel="Friend's Name"
          />
          {
            !resultImage &&
            <View >
              <ButtonComponent
                title={"Check"}
                isLoading={isLoading}
                onPress={handleTOFlameResult}
              />
            </View>
          }
          <Text style={[Louis_George_Cafe.bold.h1, { color: COLORS.white }]}>{flameresult}</Text>

          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, { color: COLORS.white }]}>
              {flamesResults}
            </Text>
            {resultImage && ( // Check if resultImage is not null
              <Image
                source={{ uri: resultImage }}
                style={styles.resultImage}
              />
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    padding: wp(5),
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: hp(3), // Ensure there’s some padding at the bottom
  },

  input: {
    width: wp(80),
    height: hp(6),
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
  },
  resultText: {
    fontSize: hp(3),
    fontWeight: "bold",
    marginTop: hp(2),
  },
  resultContainer: {
    alignItems: "center",
    marginTop: hp(2),
  },
  resultImage: {
    width: wp(60),
    height: hp(30),
    resizeMode: "contain",
  },

  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: "#000",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
  iconContainer: {
    marginRight: wp(3),
  },
  headingName: {
    alignSelf: "center",
    fontSize: hp(3), // Adjust the font size for better visibility
  },
});

export default FlameScreen;
