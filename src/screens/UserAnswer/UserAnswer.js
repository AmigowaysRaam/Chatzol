import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { List } from "react-native-paper";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../resources/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";

const Terms = [
  {
    title: "What's Your Favourite Colour's",
    description: "Blue Color is my Favourite",
  },
  {
    title: "What's Your Favourite Food",
    description: "my Favourite Food is White Rice",
  },
  {
    title: "What's Your Favourite Teacher",
    description: "my Favourite Teacher Name No-Name",
  },
  {
    title: "What's Your Favourite Subject",
    description: "my Favourite Subject Maths",
  },
  {
    title: "What's Your Favourite Friend Name",
    description: "my Favourite Friend Name No-Name",
  },
];

const UserAnswer = () => {
  const navigation = useNavigation();

  const SubmitBtn = () => (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  const RenderContactItem = ({ Item }) => (
    <View style={styles.contactItemContainer}>
      <View style={{ flex: 1, backgroundColor: "#000", alignSelf: "flex-end" }}>
        <List.Accordion
          right={() => null}
          title={Item.title}
          titleStyle={[
            {
              color: "#000",
              backgroundColor: "#fff",
              borderRadius: wp(2),
              height: 50,
              justifyContent: "center",
              verticalAlign: "middle",
            },
          ]}
          style={{ backgroundColor: "#000", paddingStart: 5 }}
        >
          <View
            style={{
              backgroundColor: "#000000",
              flexDirection: "row",
              paddingVertical: 25,
              paddingHorizontal: 25,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                height: 8,
                width: 8,
                borderRadius: 5,
                margin: 6,
              }}
            />
            <Text style={{ color: "#ffffff", textAlign: "justify" }}>
              {Item.description}
            </Text>
          </View>
        </List.Accordion>
      </View>
    </View>
  );

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
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0JTGnXof5ByjBODlxpYeGsW_rK1tlLZcwLg&s",
          }}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>UserAnswer</Text>
          <Text style={styles.about}>Online</Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <HeaderComponent />
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingBottom: 10,
            marginHorizontal: 5,
            backgroundColor: "#000",
          }}
        >
          <View style={{ marginTop: 10 }}>
            {Terms.map((item) => (
              <RenderContactItem Item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
      <SubmitBtn />
    </View>
  );
};

export default UserAnswer;

const styles = StyleSheet.create({
  contactUsTitle: {
    color: "white",
  },

  contactItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    color: "#fff",
  },

  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#000",
    position: "relative",
    width: "100%",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 15,
  },
  textContainer: {
    justifyContent: "center",
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  about: {
    color: "#ccc",
    fontSize: 14,
  },
  button: {
    backgroundColor: "rgb(8, 134, 4)",
    padding: 10,
    alignSelf: "center",
    width: "100%",
    height: hp(6),
  },
  buttonText: {
    color: "#fff",
    marginVertical: 10,
    alignSelf: "center",
    fontSize: 14,
  },
});
