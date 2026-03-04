import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
    Platform,
    PermissionsAndroid,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ImagePicker from "react-native-image-crop-picker";

import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useDispatch, useSelector } from "react-redux";
import { getWallpaperArray } from "../../redux/authActions";
import ButtonComponent from "../../components/Button/Button";
import { useWallpaper } from "../../context/WallpaperContext";
import Toast from "react-native-toast-message";

const WallpaperScreen = () => {
    const wallpaperArray = useSelector((state) => state.auth.wallpaperList);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);

    const { changeWallpaper, wallpaper } = useWallpaper();

    const [selectedWallpaper, setSelectedWallpaper] = useState(null);

    useEffect(() => {
        if (userId) {
            dispatch(getWallpaperArray(userId));
        }
    }, [userId]);

    // ===============================
    // 🔐 ANDROID PERMISSION
    // ===============================
    const requestGalleryPermission = async () => {
        if (Platform.OS === "android") {
            const permission =
                Platform.Version >= 33
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

            const granted = await PermissionsAndroid.request(permission);

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    // ===============================
    // 📸 PICK IMAGE FROM GALLERY
    // ===============================
    const pickImageFromGallery = async () => {
        try {
            const hasPermission = await requestGalleryPermission();
            if (!hasPermission) {
                Alert.alert("Permission denied", "Gallery access is required.");
                return;
            }

            const image = await ImagePicker.openPicker({
                width: 1080,
                height: 1920,
                cropping: true,
                compressImageQuality: 0.9,
                mediaType: "photo",
            });

            setSelectedWallpaper({
                key: "custom",
                value: image.path,
            });
        } catch (error) {
            if (error?.message !== "User cancelled image selection") {
                console.log("Image Picker Error:", error);
            }
        }
    };

    // ===============================
    // 🖼 SELECT FROM SERVER LIST
    // ===============================
    const handleWallpaperSelect = (item) => {
        setSelectedWallpaper(item);
    };

    // ===============================
    // ✅ SET WALLPAPER
    // ===============================
    const handleSubmit = () => {
        if (selectedWallpaper) {
            changeWallpaper(selectedWallpaper.value);

            Toast.show({
                text1: "Success",
                text2: "Wallpaper changed successfully!",
                type: "success",
            });

            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } else {
            Alert.alert("No selection", "Please select a wallpaper first.");
        }
    };

    // ===============================
    // 🔝 HEADER
    // ===============================
    const HeaderComponent = () => (
        <LinearGradient
            colors={["#F0F0F0", "#FFF"] }
            style={styles.headContainer}
        >
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons
                    name="arrow-back"
                    size={28}
                    color={COLORS.white}
                />
            </TouchableOpacity>

            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.headingName,
                        Louis_George_Cafe.bold.h3,
                    ]}
                >
                    Wallpaper
                </Text>
            </View>

            <View style={{ width: 28 }} />
        </LinearGradient>
    );

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
            <HeaderComponent />

            {/*  GALLERY BUTTON */}
            <View style={{ padding: wp(4) }}>
                <ButtonComponent
                    title="Choose From Gallery"
                    onPress={pickImageFromGallery}
                />
            </View>

            {/* 🖼 WALLPAPER GRID */}
            <FlatList
                data={wallpaperArray || []}
                keyExtractor={(item) => item.key.toString()}
                numColumns={3}
                contentContainerStyle={styles.scrollView}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleWallpaperSelect(item)}
                        style={[
                            styles.wallpaperItemContainer,
                            selectedWallpaper?.key === item.key ||
                            wallpaper === item.value
                                ? styles.selectedBorder
                                : null,
                        ]}
                    >
                        <Image
                            source={{ uri: item?.value }}
                            style={styles.wallpaperImage}
                        />
                    </TouchableOpacity>
                )}
            />

            {/* ❌ REMOVE WALLPAPER */}
            {wallpaper && (
                <View style={styles.saveButton}>
                    <ButtonComponent
                        title="Remove Wallpaper"
                        onPress={() => changeWallpaper(null)}
                    />
                </View>
            )}

            {/* ✅ SET WALLPAPER */}
            {selectedWallpaper && (
                <View style={styles.saveButton}>
                    <ButtonComponent
                        title="Set Wallpaper"
                        onPress={handleSubmit}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: "#000",
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
    },
    headingName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
    },
    wallpaperImage: {
        width: wp(28),
        height: wp(40),
        resizeMode: "cover",
        borderRadius: 10,
    },
    wallpaperItemContainer: {
        alignItems: "center",
        backgroundColor: "#F1F1F1",
        margin: wp(2),
        borderRadius: 10,
        overflow: "hidden",
        width: wp(28),
        height: wp(40),
    },
    selectedBorder: {
        borderWidth: 2,
        borderColor: "green",
    },
    scrollView: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
    saveButton: {
        alignItems: "center",
        marginBottom: hp(2),
    },
});

export default WallpaperScreen;
