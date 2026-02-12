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
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native"; // Ensure this is correct
import Icon from "react-native-vector-icons/MaterialIcons";

const QUESTIONS = [
  { id: "1", title: "What's Your Favourite Colour?" },
  { id: "2", title: "What's Your Favourite Food?" },
  { id: "3", title: "What's Your Favourite Teacher?" },
  { id: "4", title: "What's Your Favourite Subject?" },
  { id: "5", title: "What's Your Favourite Friend's Name?" },
  { id: "6", title: "What's Your Favourite Place?" },
  { id: "7", title: "What's Your Favourite Subject?" },
  { id: "8", title: "What's Your Favourite Friend's Name?" },
  { id: "9", title: "What's Your Favourite Place?" },
];

const HeaderComponent = ({ navigation }) => (
  <LinearGradient colors={["#e6e6fa", "#000"]} style={styles.headContainer}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.iconContainer}
    >
      <MaterialIcons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.profileContainer}>
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0JTGnXof5ByjBODlxpYeGsW_rK1tlLZcwLg&s",
        }}
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>SlameQuestions2</Text>
        <Text style={styles.about}>Online</Text>
      </View>
    </View>
  </LinearGradient>
);

const SlameQuestions2 = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  const handleTOSlameQuestion = () => {
    // navigation.navigate("SlameQuestions");
  };

  const SubmitBtn = () => (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleTOSlameQuestion}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.selectedItemContainer}
      onPress={() => setSelectedId(item.id)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <HeaderComponent navigation={navigation} />
      <ScrollView
        style={{
          marginVertical: "-7%",
          height: "92%",
          backgroundColor: "#000",
        }}
      >
        <FlatList
          data={QUESTIONS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
      <SubmitBtn />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 30,
  },
  iconContainer: {
    marginRight: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  listContainer: {
    padding: 20,
    backgroundColor: "#000",
  },
  textContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: "rgb(8, 134, 4)",
    padding: 10,
    alignSelf: "center",
    width: wp(99),
    height: hp(6),
  },
  buttonText: {
    alignSelf: "center",
    color: "black",
    marginTop: hp(1),
  },
  selectedItemContainer: {
    borderRadius: 12,
    marginBottom: 10,
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 18,
  },
});

export default SlameQuestions2;
