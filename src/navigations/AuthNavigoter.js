import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import SignIn from "../screens/SignIn/SignIn";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import FlameScreen from "../screens/FlameScreen/FlameScreen";
import GeneralAnnouncement from "../screens/GeneralAnnouncement/GeneralAnnouncement";
import FlameResult from "../screens/FlameResult/FlameResult";
import SlameQuestions from "../screens/SlameQuestions/SlameQuestions";
import SlameQuestions2 from "../screens/SlameQuestions/SlameQuestion2";
import UserAnswer from "../screens/UserAnswer/UserAnswer";
import Community from "../screens/Community/Community";
import ChangePassword from "../screens/ChangePassword/ChangePassword";

const Stack = createStackNavigator();

const AuthNavigator = ({ initialRouteName }) => (
  <Stack.Navigator
    initialRouteName={LoginScreen}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="SignIn" component={SignIn} />
    {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="FlameScreen" component={FlameScreen} />
    <Stack.Screen name="GeneralAnnouncement" component={GeneralAnnouncement} />
    <Stack.Screen name="FlameResult" component={FlameResult} />
    <Stack.Screen name="SlameQuestions" component={SlameQuestions} />
    <Stack.Screen name="SlameQuestions2" component={SlameQuestions2} />
    <Stack.Screen name="UserAnswer" component={UserAnswer} />
    <Stack.Screen name="Community" component={Community} />
    <Stack.Screen name="ChangePasswordScreen" component={ChangePassword} />
  </Stack.Navigator>
);

export default AuthNavigator;
