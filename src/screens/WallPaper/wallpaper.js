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
    ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, changeWallpaperApi, getStickerArray, getWallpaperArray } from "../../redux/authActions";
import ButtonComponent from "../../components/Button/Button";
import { useWallpaper } from "../../context/WallpaperContext";
import Toast from "react-native-toast-message";

const WallpaperScreen = () => {
    const wallpaperArray = useSelector((state) => state.auth.wallpaperList);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);

    const { changeWallpaper, wallpaper } = useWallpaper(); // Get wallpaper state and changeWallpaper function
    const profile = useSelector((state) => state.auth.profile);

    // State for selected wallpaper
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (userId) {
            dispatch(getStickerArray(userId));
            dispatch(getWallpaperArray(userId)).finally(() => {
                setLoading(false);
            });
        }
    }, [userId]);

    const handleWallpaperSelect = (item) => {
        setSelectedWallpaper(item);
    };

    const handleSubmit = () => {
        // alert(JSON.stringify())
        // return;
        if (selectedWallpaper) {

            const payload = {
                bg: selectedWallpaper.key,
                userid: profile._id,
            };

            dispatch(
                changeWallpaperApi(payload, (response) => {
                    setLoading(false);
                    if (response.success) {
                        changeWallpaper(selectedWallpaper.value);

                        Toast.show({
                            text1: 'Success',
                            text2: response.message || "Wallpaper changed successfully!",
                            type: 'success',
                        });

                        // Set a timeout before navigating back
                        setTimeout(() => {
                            navigation.goBack();
                        }, 1000);
                        // Adjust the timeout duration (in milliseconds) as needed

                    } else {
                        setErrorAndLoading(response.message || "Failed to change Wallpaper.");
                        Toast.show({
                            text1: 'Error',
                            text2: response.message || "Failed to change Wallpaper.",
                            type: 'error',
                        });
                    }

                })
            );




            // Toast.show({
            //     text1: 'Success',
            //     text2: "Wallpaper Selected",
            //     type: 'success',
            // });

            // setTimeout(() => {
            //     navigation.goBack()
            // }, 1000);

        } else {
            Alert.alert("No selection", "Please select a wallpaper first.");
        }
    };



    // Header Component for the screen
    const HeaderComponent = () => {
        return (
            <LinearGradient colors={["#F1F1F1", "#FFF"]} style={styles.headContainer}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={[styles.headingName, Louis_George_Cafe.bold.h3, { color: COLORS.white }]}>
                        Wallpaper
                    </Text>
                </View>
            </LinearGradient>
        );
    };

    // Loader component


    const WallpaperScreenLoader = () => {
        // Dummy data for wallpaper (just keys for now)
        const wallpaperArray = [
            { key: "1" },
            { key: "2" },
            { key: "3" },
            { key: "4" },
            { key: "5" },
            { key: "6" },
            { key: "7" },
            { key: "8" },
            { key: "9" },
        ];

        return (
            <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
                <FlatList
                    data={wallpaperArray} // Pass the wallpaper data
                    keyExtractor={(item) => item.key.toString()} // Make sure each wallpaper has a unique 'key'
                    numColumns={3} // Create a grid with 3 columns
                    contentContainerStyle={styles.scrollView} // Apply styles to the FlatList content container
                    style={styles.flatList} // Ensure FlatList fills the screen
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.wallpaperItemContainer}>
                            <ActivityIndicator size="small" color={"#838383"} style={{ alignItems: "center", marginHorizontal: wp(20) }} />
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        );
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
                <HeaderComponent />
                {loading ? (
                    <WallpaperScreenLoader />
                ) : (
                    <FlatList
                        data={wallpaperArray || []} // Pass the wallpaper data
                        keyExtractor={(item) => item.key.toString()} // Make sure each wallpaper has a unique 'key'
                        numColumns={3} // Create a grid with 3 columns
                        contentContainerStyle={styles.scrollView} // Apply styles to the FlatList content container
                        style={styles.flatList} // Ensure FlatList fills the screen
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleWallpaperSelect(item)} // Set selected wallpaper on press
                                style={[
                                    styles.wallpaperItemContainer,
                                    selectedWallpaper?.key === item.key || wallpaper === item.value ? { borderWidth: wp(1), borderColor: "green" } : {},
                                ]}
                            >
                                <Image source={{ uri: item?.value }} style={styles.wallpaperImage} />
                            </TouchableOpacity>
                        )}
                    />
                )}

                {
                    wallpaper !== null &&
                    <View style={styles.saveButton}>
                        <ButtonComponent
                            title={"X  Remove Wallpaper"}
                            onPress={() => { changeWallpaper(null) }} // Handle save button press
                        />
                    </View>
                }

                {
                    selectedWallpaper &&
                    <View style={styles.saveButton}>
                        <ButtonComponent
                            title={"Set Wallpaper"}
                            onPress={handleSubmit} // Handle save button press
                        />
                    </View>
                }

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({

    wallpaperBackground: {
        width: "100%", // Ensure the background takes the full width
        height: wp(40), // Ensure the background takes the full height
        backgroundColor: "#F1F1F1", // Example background color (you can change this)
        borderRadius: 10, // Optional: rounded corners for the background
    },

    headContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: "#000",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#808080",  // Grey background for the loader
    },
    saveButton: {
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
    },
    wallpaperImage: {
        width: wp(28),  // Adjust width of the image (responsive to screen size)
        height: wp(40), // Adjust height (keep aspect ratio)
        resizeMode: 'cover', // Ensure the image fills the space without distortion
        borderRadius: 10,
    },
    headingName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
    },
    wallpaperItemContainer: {
        alignItems: "center",
        backgroundColor: "#F1F1F1",
        margin: wp(2), // Space between images
        borderRadius: 10, // Optional: Rounded container for the images
        overflow: 'hidden',
        width: wp(28),
        height: wp(40)
    },
    wallpaperText: {
        fontSize: 18,
        color: "#fff",
    },
    scrollView: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
    flatList: {
        flex: 1, // Ensure FlatList takes up available space
    },
    submitButtonContainer: {
        padding: wp(4),
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(6),
        borderRadius: 5,
    },
    submitButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
});

export default WallpaperScreen;
