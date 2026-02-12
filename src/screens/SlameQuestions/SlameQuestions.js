import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import ButtonComponent from "../../components/Button/Button";

const QUESTIONS = [
  { id: "1", title: "What's Your Favourite Colour?", answer: "I love blue!" },
  { id: "2", title: "What's Your Favourite Food?", answer: "Pizza is my favorite." },
  { id: "3", title: "What's Your Favourite Teacher?", answer: "My favorite teacher is Mr. Smith." },
  { id: "4", title: "What's Your Favourite Subject?", answer: "I enjoy Mathematics." },
  { id: "5", title: "What's Your Favourite Friend's Name?", answer: "My best friend is John." },
  { id: "6", title: "What's Your Favourite Place?", answer: "The beach is my favorite place." },
];

const SlameQuestions = () => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAnswer = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const toggleSelection = (item) => {
    setSelectedQuestions((prev) =>
      prev.includes(item) ? prev.filter((q) => q !== item) : [...prev, item]
    );
  };

  const SubmitBtn = () => (
    <View>
      <TouchableOpacity
        style={[styles.button, !selectedQuestions.length && styles.disabledButton]}
        onPress={() => {
          if (selectedQuestions.length > 0) {
            navigation.navigate("NextScreen", { selectedQuestions });
          }
        }}
        disabled={!selectedQuestions.length}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  const HeaderComponent = () => (
    <LinearGradient colors={["#252525", "#000"]} style={styles.headContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconContainer}
      >
        <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.headingName,
            Louis_George_Cafe.bold.h3,
            { color: COLORS.white },
          ]}
        >
          Slam Questions
        </Text>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    const isChecked = selectedQuestions.includes(item);

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.item,
            isSelected ? styles.selectedItem : styles.selectedItemContainer,
          ]}
          onPress={() => toggleAnswer(item.id)}
        >
          <View style={styles.itemContent}>
            <Text style={[styles.itemText, isSelected && styles.selectedText]}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => toggleSelection(item)}>
              <Icon
                name={isChecked ? "check-box" : "check-box-outline-blank"}
                size={24}
                color="black"
                style={styles.checkIcon}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {isSelected && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };
  const handleNavigateSelectedQuestion = () => {
    setIsLoading(true)
    Alert.alert("Add Questions")
    setIsLoading(false)
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#000" }}>
      <HeaderComponent />
      <ScrollView style={styles.scrollView}>
        <FlatList
          data={QUESTIONS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
      {selectedQuestions.length !== 0 &&
        <View style={{ alignItems: "center", marginTop: "auto" }}>
          <ButtonComponent
            title={"Add Questions"}
            isLoading={isLoading}
            onPress={() => handleNavigateSelectedQuestion()}
          />
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    color: "#fff",
  },
  listContainer: {
    padding: 20,
    backgroundColor: "#000",
  },
  button: {
    backgroundColor: "rgb(8, 134, 4)",
    padding: 10,
    alignSelf: "center",
    width: "100%",
    height: 60,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    alignSelf: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#fff",
  },
  selectedItemContainer: {
    borderRadius: 12,
    marginBottom: 10,
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  selectedItem: {
    borderRadius: 12,
    marginBottom: 10,
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "rgb(247, 255, 43)",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkIcon: {
    marginLeft: 10,
  },
  itemText: {
    fontSize: 18,
  },
  answerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    backgroundColor: "rgb(5, 134, 4)",
    borderRadius: 12,
  },
  answerText: {
    fontSize: 16,
    color: "#fff",
  },
  scrollView: {
    height: "100%",
    backgroundColor: "#000",
  },
});

export default SlameQuestions;
