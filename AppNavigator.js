// // AppNavigator.js
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// // import HomePage from "./screens/HomePage";
// import GeneralAnnouncement from "./screens/GeneralAnnouncement";
// import DetailsPage from "./screens/DetailsPage";

// import { Ionicons } from "@expo/vector-icons"; // Optional: For custom icons
// import HomeScreen from "./src/screens/HomeScreen/HomeScreen";

// const Tab = createBottomTabNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: "tomato",
//           tabBarInactiveTintColor: "gray",
//           tabBarStyle: { backgroundColor: "black" },
//         }}
//       >
//         <Tab.Screen
//           name="HomeScreen"
//           component={HomeScreen}
//           options={{
//             tabBarLabel: "Chat",
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="home" size={size} color={color} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Details"
//           component={DetailsPage}
//           options={{
//             tabBarLabel: "Details",
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="information-circle" size={size} color={color} />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;
