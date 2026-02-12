import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { hp, wp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";

const QUESTIONS = [
  { id: "1", title: "What's Your Favorite Color?" },
  { id: "2", title: "What's Your Favorite Food?" },
  { id: "3", title: "What's Your Favorite Teacher?" },
  { id: "4", title: "What's Your Favorite Subject?" },
  { id: "5", title: "What's Your Favorite Friend's Name?" },
  { id: "6", title: "What's Your Favorite Place?" },
];

const THEMES = [
  { id: "1", name: "Light", color: "#ffffff", textColor: "#000000" },
  { id: "2", name: "Dark", color: "#000000", textColor: "#ffffff" },
  { id: "3", name: "Blue", color: "#0000ff", textColor: "#ffffff" },
  { id: "4", name: "Green", color: "#008000", textColor: "#ffffff" },
  { id: "5", name: "Light", color: "#fe2", textColor: "#000000" },
  { id: "6", name: "Dark", color: "#fe3456", textColor: "#ffffff" },
  { id: "7", name: "Blue", color: "#fb6", textColor: "#ffffff" },
  { id: "8", name: "Green", color: "#008f66", textColor: "#ffffff" },
];

const GeneralAnnouncement2 = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [themeColor, setThemeColor] = useState("#000000");
  const [flamesGameOption, setFlamesGameOption] = useState(null);
  const navigation = useNavigation();

  const HeaderComponent = () => (
    <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconContainer}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=faces1&fit=crop&w=100&h=100",
          }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          {/* <Text style={styles.name}>SlameQuestions</Text> */}
          <Text style={[Louis_George_Cafe.bold.h4, { color: COLORS.white }]}>
            SlameQuestions
          </Text>
          <Text
            style={[
              styles.about,
              Louis_George_Cafe.medium.h7,
              { color: COLORS.white },
            ]}
          >
            Online
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  const ThemeSelector = ({ onThemeSelect }) => {
    const [selectedTheme, setSelectedTheme] = useState(null);

    const renderThemeItem = ({ item }) => {
      const isSelected = item.id === selectedTheme;

      return (
        <TouchableOpacity
          style={[
            styles.themeItem,
            isSelected && { borderWidth: 2, borderColor: "gold" },
          ]}
          onPress={() => {
            setSelectedTheme(item.id);
            onThemeSelect(item.color);
          }}
        >
          {/* <View style={[styles.colorBox, { backgroundColor: item.color }]} />
          <Text style={styles.themeName}>{item.name}</Text> */}
        </TouchableOpacity>
      );
    };

    return (
      <FlatList
        data={THEMES}
        renderItem={renderThemeItem}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.flatListContent}
      />
    );
  };

  const toggleQuestionSelection = (id) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((questionId) => questionId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedQuestions.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          // isSelected ? styles.selectedItem : styles.selectedItemContainer,
          { flexDirection: "row" },
        ]}
        onPress={() => toggleQuestionSelection(item.id)}
      >
        <View>
          <Icon
            name={isSelected ? "check-circle" : "circle"}
            // name={isSelected ? "check-circle" : "CheckBox"}
            size={24}
            color={isSelected ? "green" : "grey"}
            style={styles.checkIcon}
          />
        </View>
        <View style={styles.itemContent}>
          <Text
            style={[
              styles.itemText,
              // isSelected && styles.selectedText
              Louis_George_Cafe.medium.h8,
              { color: COLORS.black },
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColor, marginTop: hp(-2) }}
    >
      <ScrollView style={styles.scrollView}>
        <HeaderComponent onBackPress={() => navigation.goBack()} />
        <View style={styles.themeSelectorContainer}>
          <Text style={[Louis_George_Cafe.regular.h7, { color: COLORS.white }]}>
            Select a Theme:{" "}
          </Text>
          <ThemeSelector onThemeSelect={setThemeColor} />
        </View>
        <View style={styles.checkboxContainer}>
          <Text
            style={[
              Louis_George_Cafe.regular.h7,
              { color: COLORS.white, marginBottom: hp(1) },
            ]}
          >
            Do you want to add FLAMES compatiple game ?
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
                Yes{" "}
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
        <FlatList
          data={QUESTIONS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
      <TouchableOpacity
        style={[styles.button, { marginVertical: hp(1) }]}
        onPress={() => {
          console.log("Selected Questions: ", selectedQuestions);

          // navigation.goBack();
        }}
      >
        <Text
          style={[
            styles.buttonText,
            Louis_George_Cafe.medium.h7,
            { color: COLORS.white },
          ]}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
  },
  iconContainer: {
    marginRight: 15,
    padding: 8,
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

  themeSelectorContainer: {
    padding: wp(5),
    backgroundColor: "#000000",
  },

  flatListContent: {
    paddingHorizontal: wp(2),
  },
  themeItem: {
    flexDirection: "row",
    width: wp(15),
    height: hp(7),
    alignItems: "center",
    // padding: wp(3),
    margin: hp(1),
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  colorBox: {
    width: wp(8),
    height: wp(8),
    borderRadius: 5,
    marginRight: wp(3),
  },
  themeName: {
    fontSize: 16,
  },
  listContainer: {
    padding: wp(5),
    backgroundColor: "#000",
  },

  button: {
    backgroundColor: "rgb(8, 134, 4)",

    padding: 10,
    alignSelf: "center",
    width: "100%",
    height: hp(6),
  },
  buttonText: {
    marginVertical: 10,
    alignSelf: "center",
  },
  itemContainer: {
    padding: wp(4),
    justifyContent: "center",
  },
  selectedItem: {
    borderRadius: 12,
    marginBottom: hp(1),
    padding: wp(4),
    backgroundColor: "#FFFF00",
  },
  selectedItemContainer: {
    borderRadius: 12,
    marginBottom: hp(1),
    padding: wp(4),
    width: wp(77),
  },
  itemContent: {
    backgroundColor: "#fff",
    width: wp(77),
    height: hp(5),
  },
  itemText: {
    textAlign: "justify",
    // color: "#000",
    marginVertical: hp(1.4),
    marginHorizontal: wp(4),
    // alignSelf: "center",
  },
  checkIcon: {
    marginRight: wp(3),
    marginVertical: hp(1.3),
    width: wp(6),
    height: wp(6),
    borderRadius: 12,
  },

  scrollView: {
    flex: 1,
    marginVertical: hp(2),
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
});

export default GeneralAnnouncement2;
