import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import SignIn from "../screens/SignIn/SignIn";
import SlameQuestions2 from "../screens/SlameQuestions/SlameQuestion2";
import Community from "../screens/Community/Community";
import ChatScreen from "../screens/ChatScreen";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import UserAnswer from "../screens/UserAnswer/UserAnswer";
import GeneralAnnouncement from "../screens/GeneralAnnouncement/GeneralAnnouncement";
import SlameQuestions from "../screens/SlameQuestions/SlameQuestions";
import TabNavigator from "./TabNavigator";
import Splash from "../screens/SplashScreen/SplashScreen";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import OtpScreen from "../screens/OtpScreen/OtpScreen";
import GeneralAnnouncement2 from "../screens/GeneralAnnouncement/GeneralAnnouncement2";
import NewCommunity from "../screens/NewCommunity/NewCommunity";
import Profile from "../screens/Profile/Profile";
import NewChatGroup from "../screens/group/NewGroup";
import NewChat from "../screens/NewChat/NewChat";
import FlameScreen from "../screens/FlameScreen/FlameScreen";
import ChangePassword from "../screens/ChangePassword/ChangePassword";
import CreatePasswordonForget from "../screens/CreatePasswordonForget/CreatePasswordonForget";
import GroupChatScreen from "../screens/GroupChatScreen";
import GroupDetails from "../screens/GroupDetail/GroupDetail";
import SlameQuestionChatSendScreen from "../screens/SlameQuestionChatSendScreen/SlameQuestionChatSendScreen";
import SlameQuestionChatScreen from "../screens/SlameQuestionChatScreen/SlameQuestionChatScreen";
import WallpaperScreen from "../screens/WallPaper/wallpaper";
import CommunitChat from "../screens/CommunitChat";
import CommunityDetails from "../screens/CommunityDetails/CommunityDetails";
import ProfileScreen from "../screens/ProfileScreen";
import SlamBook from "../screens/SlamBook/SlamBook";
import SlamResponse from "../screens/SlamResponse/SlamResponse";
import AddSubgroup from "../screens/addSubgroup/AddSubgroup";
import PublicProfile from "../screens/PublicProfile/PublicProfile";
import BlcokedUserList from "../screens/BlockedUserLIst/BlcokedUserList";
import StoryPreviewScreen from "../screens/StoryPreviewScreen";
import { Easing } from 'react-native'; // Don't forget to import Easing
import StaredMessages from "../screens/StaredMessages/StaredMessages";
import CreateStory from "../screens/createStory/createStory";
import OwnStatusView from "../screens/OwnStatusView/OwnStatusView";
import CallScreen from "../screens/CallScreen";
import AnswerCallScreen from "../screens/AnswerCallScreen";
import OtpPassword from "../screens/OtpPassword";


const Stack = createNativeStackNavigator();

function InitialRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="HomeScreen" component={TabNavigator} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OtpPassword" component={OtpPassword}/>
        <Stack.Screen name="SlameQuestions" component={SlameQuestions} />
        <Stack.Screen name="UserAnswer" component={UserAnswer} />
        <Stack.Screen name="SlameQuestions2" component={SlameQuestions2} />
        <Stack.Screen name="Community" component={Community} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="FlameScreen" component={FlameScreen} />
        <Stack.Screen
          name="GeneralAnnouncement"
          component={GeneralAnnouncement}
        />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen
          name="GeneralAnnouncement2"
          component={GeneralAnnouncement2}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="NewCommunity" component={NewCommunity} />
        <Stack.Screen name="NewChatGroup" component={NewChatGroup} />
        <Stack.Screen name="NewChat" component={NewChat} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePassword} />
        <Stack.Screen name="CreatePasswordonForget" component={CreatePasswordonForget} />
        <Stack.Screen name="GroupChatScreen" component={GroupChatScreen} />
        <Stack.Screen name="GroupDetailsScreen" component={GroupDetails} />
        <Stack.Screen name="SlameQuestionChatSendScreen" component={SlameQuestionChatSendScreen} />
        <Stack.Screen name="SlameQuestionChatScreen" component={SlameQuestionChatScreen} />
        <Stack.Screen name="WallpaperScreen" component={WallpaperScreen} />
        <Stack.Screen name="CommunitChat" component={CommunitChat} />
        <Stack.Screen name="CommunityDetails" component={CommunityDetails} />
        <Stack.Screen name="SlamBook" component={SlamBook} />
        <Stack.Screen name="SlamResponse" component={SlamResponse} />
        <Stack.Screen name="AddSubgroup" component={AddSubgroup} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="PublicProfile" component={PublicProfile} />
        <Stack.Screen name="StaredMessages" component={StaredMessages} />
        <Stack.Screen name="CreateStory" component={CreateStory} />
        <Stack.Screen name="OwnStatusView" component={OwnStatusView} />
        <Stack.Screen name="BlcokedUserList" component={BlcokedUserList} />
        <Stack.Screen name="CallScreen" component={CallScreen} />
        <Stack.Screen name="AnswerCallScreen" component={AnswerCallScreen} />
        <Stack.Screen
          name="StoryPreviewScreen"
          component={StoryPreviewScreen}
          options={{
            animationTypeForReplace: 'push', // Transition type for replacing the screen
            gestureEnabled: true, // Allow swipe gesture to go back
            animation: 'fade_from_bottom', // Custom animation from bottom
            // Slow down the animation by modifying the transitionSpec
            transitionSpec: {
              open: {
                animation: 'timing', // Use timing-based animation
                config: {
                  duration: 1000, // 1000ms = 1 second (feel free to adjust)
                  easing: Easing.out(Easing.ease), // Slow easing for a smoother animation
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 1000, // Slow close animation as well
                  easing: Easing.out(Easing.ease),
                },
              },
            },
            cardStyleInterpolator: ({ current, next, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0], // Slide from the bottom
                      }),
                    },
                  ],
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1], // Fade effect
                  }),
                },
              };
            },
          }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default InitialRouter;
