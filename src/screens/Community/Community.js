import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import { getCommiunityList } from "../../redux/authActions";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Community = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  const [communityData, setCommunityData] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editedCommunity, setEditedCommunity] = useState(null);
  const [newGroupImage, setNewGroupImage] = useState(null);

  useEffect(() => {
    fetchCommunities();
  }, [userId]);

  const fetchCommunities = () => {
    setLoading(true);
    dispatch(
      getCommiunityList(userId, (response) => {
        if (response.success) {
          setCommunityData(response?.data || []);
        } else {
          setCommunityData([]);
        }
        setLoading(false);
        setRefreshing(false);
      })
    );
  };

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setNewGroupImage(response.assets[0].uri);
      }
    });
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("name", editedCommunity?.name);
    formData.append("userid", userId);
    formData.append("communityid", editedCommunity?._id);
    formData.append("bio", editedCommunity?.bio);

    if (newGroupImage) {
      formData.append("image", {
        uri: newGroupImage,
        type: "image/jpeg",
        name: "community.jpg",
      });
    }

    try {
      const response = await fetch(
        "https://chatzol.scriptzol.in/api/?url=app-update-community",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);
        cons
      if (data.success) {
        Toast.show({ type: "success", text1: data.message });
        fetchCommunities();
      } else {
        Toast.show({ type: "error", text1: data.message });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }

    setModalVisible(false);
  };

  const filteredCommunities = communityData.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGroup = (group) => (
    <View key={group._id} style={styles.groupRow}>
      <Image source={{ uri: group.image }} style={styles.groupAvatar} />
      <Text style={styles.groupName}>{group.name}</Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("GroupChatScreen", {
            groupId: group._id,
            username: group.name,
            avatar: group.image,
          })
        }
      >
        <MaterialCommunityIcons
          name="message-outline"
          size={wp(5.5)}
          color={COLORS.green}
        />
      </TouchableOpacity>
    </View>
  );

const renderCommunity = (item, index) => {
  const isExpanded = expandedIds.includes(index);

  return (
    <View key={item._id || index} style={styles.communityCard}>
      <TouchableOpacity
        style={styles.communityHeader}
        onPress={() => toggleAccordion(index)}
        activeOpacity={0.8}
      >
        <Image
          source={ item?.image }
          style={styles.communityAvatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.communityTitle}>{item?.name}</Text>
          <Text style={styles.communitySubtitle}>
            {item?.bio || "No description available"}
          </Text>
        </View>

        {/* EDIT BUTTON */}
        {item?.allow_edit == 1 && (
          <TouchableOpacity
            onPress={() => {
              setEditedCommunity(item);
              setNewGroupImage(item?.image);
              setModalVisible(true);
            }}
            style={{ marginRight: wp(3) }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={wp(5.5)}
              color="#666"
            />
          </TouchableOpacity>
        )}

        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={wp(6)}
          color="#666"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.groupsContainer}>
          {item.groups?.map(renderGroup)}
        </View>
      )}
    </View>
  );
};

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity onPress={() => navigation.navigate("NewCommunity")}>
          <MaterialIcons name="add" size={wp(7)} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchCommunities} />
        }
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={wp(5)} color="#888" />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.green} />
        ) : filteredCommunities.length > 0 ? (
          filteredCommunities.map(renderCommunity)
        ) : (
          <Text style={styles.emptyText}>No communities found</Text>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={wp(7)} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={ newGroupImage }
                style={styles.editAvatar}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              value={editedCommunity?.name}
              onChangeText={(text) =>
                setEditedCommunity((prev) => ({ ...prev, name: text }))
              }
              placeholder="Community Name"
            />

            <TextInput
              style={styles.input}
              value={editedCommunity?.bio}
              onChangeText={(text) =>
                setEditedCommunity((prev) => ({ ...prev, bio: text }))
              }
              placeholder="Description"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={{ color: "#fff", fontSize: wp(4.2), fontWeight: "600" }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Community;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F0F0F0",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#111",
    fontSize: wp(5),
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: wp(4),
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: wp(3),
    borderRadius: wp(3),
    alignItems: "center",
    marginBottom: hp(2),
  },
  searchInput: {
    marginLeft: wp(2),
    flex: 1,
    fontSize: wp(4),
  },
  communityCard: {
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
    elevation: 3,
  },
  communityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  communityAvatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    borderColor:COLORS.button_bg_color,
    borderWidth:wp(0.5),
    marginRight: wp(4),
  },
  communityTitle: {
    fontSize: wp(4.5),
    fontWeight: "600",
  },
  communitySubtitle: {
    fontSize: wp(3.5),
    color: "#666",
    marginTop: hp(0.5),
  },
  groupsContainer: {
    marginTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: hp(1),
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1),
  },
  groupAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    marginRight: wp(3),
  },
  groupName: {
    flex: 1,
    fontSize: wp(4),
  },
  emptyText: {
    textAlign: "center",
    marginTop: hp(10),
    fontSize: wp(4),
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: wp(5),
    borderRadius: wp(4),
    padding: wp(5),
  },
  editAvatar: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    borderWidth:wp(0.5),
    alignSelf: "center",
    marginVertical: hp(2),
    borderColor:COLORS.button_bg_color
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(3),
    borderRadius: wp(2),
    marginBottom: hp(2),
    fontSize: wp(4),
  },
  saveButton: {
    backgroundColor: COLORS.button_bg_color,
    paddingVertical: hp(1.8),
    borderRadius: wp(3),
    alignItems: "center",
  },
});