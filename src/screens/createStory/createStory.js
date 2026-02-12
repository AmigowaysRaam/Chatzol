import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator, // Import ActivityIndicator for the loader
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageCropPicker from "react-native-image-crop-picker";
import { useSelector } from "react-redux";
import Toast from 'react-native-simple-toast';


const CreateStory = () => {
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false); // State to handle loading
    const userId = useSelector((state) => state.auth.user?._id);

    const removeImage = () => {
        setImageUri(null);
    };

    const openGallery = () => {
        launchImageLibrary(
            {
                mediaType: "photo",
                quality: 1,
                includeBase64: false,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                } else if (response.errorCode) {
                    console.log("ImagePicker Error: ", response.errorMessage);
                } else {
                    ImageCropPicker.openCropper({
                        path: response.assets[0].uri,
                        width: 900,
                        height: 1200,
                    }).then((image) => {
                        setImageUri(image.path);
                    });
                }
            }
        );
    };

    const openCamera = () => {
        launchCamera(
            {
                mediaType: "photo",
                quality: 1,
                includeBase64: false,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                } else if (response.errorCode) {
                    console.log("ImagePicker Error: ", response.errorMessage);
                } else {
                    ImageCropPicker.openCropper({
                        path: response.assets[0].uri,
                        width: 900,
                        height: 1200,
                    }).then((image) => {
                        setImageUri(image.path);
                    });
                }
            }
        );
    };

    const HeaderComponent = ({ handleCreateStory }) => {
        return (
            <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconContainer}
                >
                    <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text
                        style={[styles.headingName, Louis_George_Cafe.bold.h3, { color: COLORS.white }]}
                    >
                        Create Story
                    </Text>
                </View>
                {
                    imageUri &&
                    <TouchableOpacity onPress={handleCreateStory} style={styles.iconContainer}>
                        <MaterialIcons name="check" size={28} color={COLORS.white} />
                    </TouchableOpacity>
                }
            </LinearGradient>
        );
    };

    const handleCreateStory = async () => {
        const apiUrl = "https://chatzol.scriptzol.in/api/?url=app-upload-status";

        if (!imageUri) {
            Alert.alert("Error", "Please select an image.");
            return;
        }

        setLoading(true); // Set loading to true before starting upload

        const formData = new FormData();
        formData.append("userid", userId);
        formData.append("caption", caption);

        const imageData = {
            uri: imageUri,
            type: "image/jpeg",
            name: "story-image.jpg",
        };

        formData.append("image", imageData);
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            setLoading(false); // Set loading to false after upload is done

            if (result.success) {
                // Alert.alert("Success", "Story uploaded successfully.");
                Toast.show('Story uploaded successfully.', Toast.LONG);
                setImageUri(null);
                setCaption("");
                navigation.goBack();
            } else {
                Alert.alert("Error", "Failed to upload story. Please try again.");
            }
        } catch (error) {
            setLoading(false); // Set loading to false in case of error
            console.log("Error uploading story:", error);
            Alert.alert("Error", "Failed to upload story. Please try again.");
        }
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: "#FFF", flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <HeaderComponent handleCreateStory={handleCreateStory} />

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        {/* Display the selected image */}
                        {
                            (
                                <>
                                    <View style={styles.selectedImageContainer}>
                                        <Text style={styles.selectedImageText}>Selected Image:</Text>
                                        <Image
                                            resizeMode="contain"
                                            source={
                                                imageUri ? { uri: imageUri } :
                                                    require('../../../src/assets/animations/Logo 512X512.jpg')
                                            }
                                            style={[styles.selectedImage, {
                                                opacity: imageUri ? 1 : 0.2
                                            }]}
                                        />
                                        {
                                            imageUri &&
                                            <TouchableOpacity
                                                onPress={removeImage}
                                                style={[
                                                    styles.optonButton,
                                                    {
                                                        marginVertical: wp(2),
                                                        paddingVertical: wp(2),
                                                        paddingHorizontal: wp(5),
                                                        borderRadius: wp(2),
                                                        marginBottom: hp(2),
                                                        color: "#000",
                                                        backgroundColor: "#ddd",
                                                    },
                                                ]}
                                            >
                                                <Text style={{ color: "red" }}>Remove Image</Text>
                                            </TouchableOpacity>
                                        }

                                    </View>
                                    <View style={styles.captionContainer}>
                                        <TextInput
                                            style={[styles.captionInput, Louis_George_Cafe.regular.h6]}
                                            placeholder="Enter your caption here"
                                            value={caption}
                                            onChangeText={setCaption}
                                        />
                                    </View>
                                </>
                            )}

                        {/* Add a button for opening the gallery or camera */}
                        <View style={styles.optionContainer}>
                            <TouchableOpacity onPress={openGallery} style={styles.optionButton}>
                                <Text style={styles.optionText}>Open Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openCamera} style={styles.optionButton}>
                                <Text style={styles.optionText}>Open Camera</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Loader while uploading image */}
                        {loading && (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size="large" color={COLORS.button_bg_color} />
                            </View>
                        )}

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        alignItems: "center",
    },
    headContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        backgroundColor: "#000",
    },
    headingName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
    },
    captionContainer: {
        marginTop: hp(2),
        alignItems: "center",
    },
    captionInput: {
        width: wp(79),
        height: wp(10),
        borderWidth: wp(0.5),
        borderColor: "#999",
        borderRadius: wp(1),
        padding: wp(1),
        fontSize: 16,
        marginBottom: wp(4),
    },
    optionContainer: {
        alignItems: "center",
    },
    optionButton: {
        backgroundColor: COLORS.button_bg_color,
        paddingVertical: wp(2),
        paddingHorizontal: wp(5),
        borderRadius: wp(2),
        marginBottom: hp(2),
    },

    optionText: {
        color: COLORS.black,
    },
    selectedImageContainer: {
        marginTop: hp(4),
        alignItems: "center",
    },
    selectedImageText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.white,
        marginBottom: hp(2),
    },

    selectedImage: {
        width: wp(80),
        height: hp(40),
        borderRadius: wp(2),
        borderWidth: wp(1),
        padding: wp(2),
        borderColor: '#888',
        borderStyle: "dashed"
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(2),
    },
});

export default CreateStory;
