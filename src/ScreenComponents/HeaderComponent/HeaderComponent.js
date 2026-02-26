import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { hp, wp } from "../../resources/dimensions";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../resources/Colors";

const HeaderBar = ({title='',showBackArrow=false , showClose=false}) => {
  const navigation = useNavigation();

  const HeaderComponent = () => (
    <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
      {showBackArrow &&
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconContainer}
      >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>
}
      
        <Text style={styles.headerTitle}>{title}</Text>
        {showClose &&
        <TouchableOpacity onPress={() => navigation.goBack()}>
                  <MaterialIcons name="close" size={26} color="#000" style={{position:'absolute', top:-wp(4), left:wp(60)}} />
                </TouchableOpacity>
}
      

    
    </LinearGradient>
  );

  return <HeaderComponent />;
};

const styles = StyleSheet.create({
  headContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    elevation: 3,
  },
  iconContainer: {
    marginRight: wp(3),
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
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
   headerTitle: {
    fontSize: wp(5),
    fontWeight: "600",
    marginLeft: wp(4),
  },
});

export default HeaderBar;
