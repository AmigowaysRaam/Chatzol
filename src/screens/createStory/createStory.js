import React, { useEffect, useState } from "react";
import {  View,  Text,  StyleSheet,  TouchableOpacity,  SafeAreaView,  Image,  TextInput,  StatusBar,  FlatList,  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  ScrollView,Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { launchCamera } from "react-native-image-picker";
import ImageCropPicker from "react-native-image-crop-picker";
import Modal from "react-native-modal";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Toast from "react-native-simple-toast";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";

const CreateStory = () => {
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.user?._id);

  const [imageUri, setImageUri] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState("All Photos");
  const [modalImages, setModalImages] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [albumDropdownVisible, setAlbumDropdownVisible] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  // Permissions
  const requestPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          loadAlbums();
        }
      } catch (err) {
        console.log("Permission error:", err);
      }
    } else {
      loadAlbums();
    }
  };

  // Load Albums
  const loadAlbums = async () => {
    try {
      const albumList = await CameraRoll.getAlbums();
      setAlbums(albumList);
      loadAlbumImages("All Photos"); // default all images
    } catch (err) {
      console.log("Error loading albums:", err);
    }
  };

  // Load images from album or All Photos
  const loadAlbumImages = async (albumName) => {
    setModalLoading(true);
    try {
      let photos;
      if (albumName === "All Photos") {
        photos = await CameraRoll.getPhotos({ first: 1000, assetType: "Photos" });
      } else {
        photos = await CameraRoll.getPhotos({ first: 1000, assetType: "Photos", groupName: albumName });
      }

      const imageList = photos.edges.map((edge) => ({ uri: edge.node.image.uri }));
      setGalleryImages(imageList);
      setModalImages(imageList);
      setSelectedAlbum(albumName);
      setAlbumDropdownVisible(false);
    } catch (err) {
      console.log("Error loading images:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // Camera
  const openCamera = () => {
    launchCamera({ mediaType: "photo", quality: 1 }, async (response) => {
      if (response.didCancel || response.errorCode) return;

      try {
        const image = await ImageCropPicker.openCropper({
          path: response.assets[0].uri,
          width: 900,
          height: 1200,
        });
        setImageUri(image.path);
        loadAlbumImages(selectedAlbum);
      } catch (err) {
        console.log("Crop canceled");
      }
    });
  };

  const selectImage = async (uri) => {
    try {
      const image = await ImageCropPicker.openCropper({ path: uri, width: 900, height: 1200 });
      setImageUri(image.path);
    } catch (err) {
      console.log("Crop canceled");
    }
  };

  const removeImage = () => setImageUri(null);

  const handleCreateStory = async () => {
    if (!imageUri) return Alert.alert("Error", "Please select an image.");
    setLoading(true);

    const formData = new FormData();
    formData.append("userid", userId);
    formData.append("caption", caption);
    formData.append("image", { uri: imageUri, type: "image/jpeg", name: "story.jpg" });

    try {
      const response = await fetch(
        "https://chatzol.scriptzol.in/api/?url=app-upload-status",
        { method: "POST", body: formData }
      );
      const result = await response.json();
      setLoading(false);
      if (result.success) {
        Toast.show("Story uploaded successfully.");
        navigation.goBack();
      } else Alert.alert("Upload failed");
    } catch (error) {
      setLoading(false);
      Alert.alert("Upload failed");
    }
  };

  const renderGalleryItem = ({ item }) => {
    const isSelected = item.uri === imageUri;
    return (
      <TouchableOpacity
        onPress={() => selectImage(item.uri)}
        style={[styles.galleryItem, isSelected && styles.selectedImage]}
      >
        <Image source={{ uri: item.uri }} style={styles.galleryImage} />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Preview */}
      <View style={{ flex: 1 }}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <TouchableOpacity onPress={openCamera} style={styles.cameraPlaceholder}>
            <MaterialIcons name="photo-camera" size={hp(8)} color="#666" />
            <Text style={{ color: "#888", marginTop: hp(1) }}>Open Camera</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.topOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={wp(6)} color="#fff" />
          </TouchableOpacity>
          {imageUri && (
            <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
              <MaterialIcons name="close" size={wp(5)} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Caption */}
        {imageUri && (
          <View style={styles.captionContainer}>
            <TextInput
              placeholder="Write a caption..."
              placeholderTextColor="#ccc"
              style={styles.captionInput}
              value={caption}
              onChangeText={setCaption}
            />
            <TouchableOpacity onPress={handleCreateStory} disabled={!imageUri}>
              <MaterialIcons
                name="send"
                size={wp(6)}
                color={imageUri ? COLORS.button_bg_color : "#555"}
                style={{ position: "absolute", top: -wp(9), right: wp(2) }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Gallery */}
      <PanGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.translationY < -50 && nativeEvent.state === State.END) {
            setGalleryModalVisible(true);
          }
        }}
      >
        <View style={styles.galleryWrapper}>
          <TouchableOpacity style={styles.expandButton} onPress={() => setGalleryModalVisible(true)}>
            <MaterialIcons name="expand-less" size={wp(5)} color="#fff" />
          </TouchableOpacity>
          <FlatList
            data={galleryImages} // all images from selected album
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderGalleryItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </PanGestureHandler>

      {/* Full Gallery Modal */}
      <Modal
        isVisible={galleryModalVisible}
        onSwipeComplete={() => setGalleryModalVisible(false)}
        swipeDirection="down"
        style={{ margin: 0 }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          {/* Album Selector */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAlbumDropdownVisible(!albumDropdownVisible)}>
              <Text style={{ color: "#fff", fontSize: wp(4.5) }}>
                {selectedAlbum || "Albums"} ▼
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGalleryModalVisible(false)}>
              <MaterialIcons name="close" size={wp(6)} color="#fff" />
            </TouchableOpacity>
          </View>

          {albumDropdownVisible && (
            <ScrollView style={styles.albumDropdown}>
              <TouchableOpacity
                style={styles.albumItem}
                onPress={() => loadAlbumImages("All Photos")}
              >
                <Text style={{ color: "#fff", fontSize: wp(4) }}>All Photos</Text>
              </TouchableOpacity>
              {albums.map((album, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.albumItem}
                  onPress={() => loadAlbumImages(album.title)}
                >
                  <Text style={{ color: "#fff", fontSize: wp(4) }}>{album.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {modalLoading ? (
            <ActivityIndicator color="#fff" size="large" style={{ marginTop: hp(5) }} />
          ) : (
            <FlatList
              data={modalImages}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ margin: 1 }}
                  onPress={() => {
                    selectImage(item.uri);
                    setGalleryModalVisible(false);
                  }}
                >
                  <Image source={{ uri: item.uri }} style={{ width: wp(33), height: wp(33) }} />
                </TouchableOpacity>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  topOverlay: { position: "absolute", top: hp(2), left: wp(3), right: wp(3), flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  captionContainer: { position: "absolute", bottom: hp(15), left: wp(4), right: wp(4) },
  captionInput: { backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", padding: hp(1.2), borderRadius: wp(8), fontSize: wp(4) },
  removeButton: { backgroundColor: "rgba(0,0,0,0.6)", padding: wp(2), borderRadius: wp(4) },
  galleryWrapper: { backgroundColor: "transparent", paddingVertical: hp(1), paddingLeft: wp(2) },
  expandButton: { position: "absolute", right: wp(45), top: -hp(6), backgroundColor: "rgba(0,0,0,0.6)", padding: wp(1), borderRadius: wp(4), zIndex: 10 },
  galleryItem: { marginRight: wp(2) },
  selectedImage: { borderWidth: 2, borderColor: "#25D366" },
  galleryImage: { width: wp(18), height: wp(18), borderRadius: wp(2) },
  cameraPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: "#000a", justifyContent: "center", alignItems: "center" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", padding: wp(3), alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#333" },
  albumDropdown: { backgroundColor: "#111", maxHeight: hp(40) },
  albumItem: { padding: hp(1.5), borderBottomWidth: 1, borderBottomColor: "#333" },
});

export default CreateStory;