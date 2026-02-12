import React, { useEffect } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import Community from "../screens/Community/Community";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getSiteSettings } from "../redux/authActions";
import { COLORS } from "../resources/Colors";
import UserStories from "../screens/UserStories/UserStories";
import CallHistory from "../screens/CallHistory";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {

  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const getFrontSite = useSelector((state) => state.auth.getFrontSite);

  useEffect(() => {
    if (userId) {
      dispatch(getSiteSettings(userId));
    }
  }, [userId]);

  const handleGameTabPress = () => {
    Linking.openURL(getFrontSite?.gamelink);
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          switch (route.name) {
            case "HomeScreen":
              iconName = "chat";
              return (
                <View style={[styles.iconContainer]}>
                  <Icon
                    name={"chat"}
                    size={focused ? 32 : 25}
                    color={focused ? "#a020cb" : "#666"}
                  />
                  {/* {focused && <View style={styles.underline} />} */}
                </View>
              );

              case "UserStories":
                return (
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name="update"
                      size={focused ? 32 : 25}
                      color={focused ? "#a020cb" : "#666"}
                    />
                    {/* {focused && <View style={styles.underline} />} */}
                  </View>
                );
                // 
                case "CallHistory":
                  return (
                    <View style={styles.iconContainer}>
                      <MaterialIcons
                        name="phone"
                        size={focused ? 32 : 25}
                        color={focused ? "#a020cb" : "#666"}
                      />
                      {/* {focused && <View style={styles.underline} />} */}
                    </View>
                  );
  
            case "Community":
              return (
                <View style={styles.iconContainer}>
                  <Icon
                    name={"group"}
                    size={focused ? 32 : 25}
                    color={focused ? "#a020cb" : "#666"}

                  />
                  {/* {focused && <View style={styles.underline} />} */}
                </View>
              );
            // case "SlamBook":
            //   return (
            //     <View style={styles.iconContainer}>
            //       <MaterialIcons
            //         name="wallet-giftcard"
            //         size={focused ? 32 : 25}
            //         color={focused ? "#a020cb" : "#666"}
            //       />
            //       {focused && <View style={styles.underline} />}
            //     </View>
            //   );
            
           
              
            default:
              return (
                <View style={styles.iconContainer}>
                  <Icon name={"home"} size={25} color={"#fff"} />
                  {focused && <View style={styles.underline} />}
                </View>
              );
          }
        },
        tabBarLabel: () => null,
        tabBarInactiveTintColor: "#fff",
        headerShown: false,
        tabBarStyle: {
          // backgroundColor: "rgb(8, 134, 4)",
          // backgroundColor: "#a020cb",
          backgroundColor: "#FFF",
          height: 52,
          width: "100%",
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      {/* <Tab.Screen name="SlamBook" component={SlamBook} /> */}
      <Tab.Screen name="UserStories" component={UserStories} />
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="CallHistory" component={CallHistory} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    position: "relative",
  },
  underline: {
    width: "100%",
    height: 2,
    position: "absolute",
    bottom: -2,
    backgroundColor: COLORS.button_bg_color
  },
});

export default TabNavigator;
