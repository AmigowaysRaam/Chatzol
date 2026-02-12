// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useNavigation } from "@react-navigation/native";

// const ANNOUNCEMENT = [
//   {
//     id: "1",
//     title: "New Feature Release!",
//     date: "August 30, 2024",
//     content:
//       "We are excited to announce the release of our new feature which will enhance your user experience. Check it out in the app!",
//   },
//   {
//     id: "2",
//     title: "Maintenance Downtime",
//     date: "August 31, 2024",
//     content:
//       "Our services will be undergoing maintenance from 2 AM to 4 AM. We apologize for any inconvenience this may cause.",
//   },
//   {
//     id: "3",
//     title: "Holiday Notice",
//     date: "September 1, 2024",
//     content:
//       "Our offices will be closed on September 1 for the national holiday. Support responses may be delayed.",
//   },
//   {
//     id: "2",
//     title: "Maintenance Downtime",
//     date: "August 31, 2024",
//     content:
//       "Our services will be undergoing maintenance from 2 AM to 4 AM. We apologize for any inconvenience this may cause.",
//   },
//   {
//     id: "3",
//     title: "Holiday Notice",
//     date: "September 1, 2024",
//     content:
//       "Our offices will be closed on September 1 for the national holiday. Support responses may be delayed.",
//   },
//   {
//     id: "3",
//     title: "Holiday Notice",
//     date: "September 1, 2024",
//     content:
//       "Our offices will be closed on September 1 for the national holiday. Support responses may be delayed.",
//   },
// ];

// const GeneralAnnouncement = () => {
//   const navigation = useNavigation();

//   const HeaderComponent = () => (
//     <LinearGradient colors={["#e6e6fa", "#000"]} style={styles.headContainer}>
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.iconContainer}
//       >
//         <MaterialIcons name="arrow-back" size={24} color="#fff" />
//       </TouchableOpacity>
//       <View style={styles.profileContainer}>
//         <Image
//           source={{
//             uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0JTGnXof5ByjBODlxpYeGsW_rK1tlLZcwLg&s",
//           }}
//           style={styles.profileImage}
//         />
//         <View style={styles.textContainer}>
//           <Text style={styles.name}>General Announcement</Text>
//           <Text style={styles.about}>Online</Text>
//         </View>
//       </View>
//     </LinearGradient>
//   );

//   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.itemContainer}
//       onPress={() => setSelectedAnnouncement(item)}
//     >
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.date}>{item.date}</Text>
//     </TouchableOpacity>
//   );
//   return (
//     <SafeAreaView>
//       <HeaderComponent />
//       <View
//         style={{
//           marginVertical: "-7%",
//           height: "100%",
//           backgroundColor: "#000",
//         }}
//       >
//         <FlatList
//           data={ANNOUNCEMENT}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContainer}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   headContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     marginVertical: 30,
//   },
//   iconContainer: {
//     marginRight: 15,
//   },
//   profileContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 10,
//     marginHorizontal: 20,
//   },
//   listContainer: {
//     padding: 20,
//     backgroundColor: "#000",
//   },
//   itemContainer: {
//     backgroundColor: "#fff",
//     borderWidth: 0.1,
//     borderColor: "#d3d3d3",
//     padding: 18,
//     marginBottom: 10,
//     borderRadius: 20,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   date: {
//     fontSize: 14,
//     color: "gray",
//   },
//   textContainer: {
//     flex: 1,
//   },
// });

// export default GeneralAnnouncement;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const ANNOUNCEMENT = [
  {
    id: "1",
    title: "New Feature Release!",
    date: "August 30, 2024",
    content:
      "We are excited to announce the release of our new feature which will enhance your user experience. Check it out in the app!",
  },
  {
    id: "2",
    title: "Maintenance Downtime",
    date: "August 31, 2024",
    content:
      "Our services will be undergoing maintenance from 2 AM to 4 AM. We apologize for any inconvenience this may cause.",
  },
  {
    id: "3",
    title: "Holiday Notice",
    date: "September 1, 2024",
    content:
      "Our offices will be closed on September 1 for the national holiday. Support responses may be delayed.",
  },
  {
    id: "4",
    title: "Holiday Notice",
    date: "September 1, 2024",
    content:
      "Our offices will be closed on September 1 for the national holiday. Support responses may be delayed.",
  },
  {
    id: "5",
    title: "Holiday Notice",
    date: "September 1, 2024",
    content:
      "Our offices will be closed on September 1 for the national holiday. Support responses may be delayed.",
  },
  
];

const GeneralAnnouncement = () => {
  const navigation = useNavigation();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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
          <Text style={styles.name}>General Announcement</Text>
          <Text style={styles.about}>Online</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => setSelectedAnnouncement(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.contentContainer}>
        <FlatList
          data={ANNOUNCEMENT}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headContainer: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    backgroundColor: "#252525",
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
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  about: {
    fontSize: 14,
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
    marginTop: 0,
  },
  listContainer: {
    padding: 20,
    backgroundColor: "#000",
  },
  itemContainer: {
    backgroundColor: "#333",
    padding: 18,
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#444",
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    
  },
  date: {
    fontSize: 14,
    color: "#ccc",
  },
});

export default GeneralAnnouncement;
