import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { getUpdateStoryList } from "../../redux/authActions";

const UserStories = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    const [loader, setLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
    const profile = useSelector((state) => state.auth.profile);
    const [imageSelected, setSelectedPic] = useState({});
    const [dummyStatusArray, setUserStoryArr] = useState([]);

    // Refresh data when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchData(); // Fetch data on focus
        }, [userId])
    );

    const fetchData = () => {
        dispatch(
            getUpdateStoryList(userId, (response) => {
                console.log(response.data, 'getStatusDataArr');
                setUserStoryArr(response?.data)
            })
        );
    }

    const HeaderComponent = () => {
        return (
            <>
                <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
                    <View style={{ maxWidth: wp(100), flex: 1, alignItems: "center" }}>
                        <Text numberOfLines={1} style={[styles.headingName, Louis_George_Cafe.bold.h5, { color: COLORS.white }]}>
                            {'Updates'}
                        </Text>
                    </View>
                </LinearGradient>
            </>
        );
    };

    const openCamera = () => {
        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'back',
                includeBase64: true,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                } else if (response.errorCode) {
                    console.log("Image Picker Error: ", response.errorMessage);
                    Alert.alert("Error", "Could not pick the image");
                } else if (response.assets && response.assets.length > 0) {
                    const selectedImageUri = response.assets[0].uri;
                    setProfileImage(selectedImageUri);
                    setSelectedPic(response.assets[0]);

                } else {
                    Alert.alert("Error", "No image selected");
                }
            }
        );
    };

    const cropImage = (uri) => {
        ImageCropPicker.openCropper({
            path: uri, // The image URI to crop
            width: 300,  // Width of the cropped image
            height: 300, // Height of the cropped image
            cropping: true, // Enable cropping
            cropperCircleOverlay: false, // You can enable a circle overlay if desired
            cropperToolbarTitle: 'Crop Image', // Custom toolbar title
            cropperActiveWidgetColor: '#F0A500', // Color of the active crop widget
            cropperStatusBarColor: '#F0A500', // Color of the status bar when the cropper is active
            cropperToolbarColor: '#F0A500', // Toolbar background color
        }).then((croppedImage) => {
            console.log('Cropped Image:', croppedImage);
            setImage(croppedImage.path); // Save the cropped image URI to state
        }).catch((error) => {
            console.log('Image Cropping Error:', error);
        });
    };




    const openFilePicker = () => {
        launchImageLibrary(
            {
                mediaType: 'mixed',
                includeBase64: true,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else {
                    alert(response.assets[0].uri);
                    // setSelectedPic(response.assets[0]);
                    console.log('Response:', response);
                }
            }
        );
    };



    const renderStatusItem = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => handleStoryPreview(index)}
            style={styles.statusContainer}
        >
            <View style={[styles.statusImageContainer, {
                borderColor: !item?.isNew ? "grey" : 'green'
            }]}>
                {/* Access the last status image */}
                <Image
                    source={{ uri: item?.statusImages[item.statusImages.length - 1]?.url }}
                    style={[styles.statusImage]}
                />
            </View>
            <View style={styles.statusTextContainer}>
                <Text style={[styles.statusName, { color: item.isNew ? COLORS.primary : COLORS.white }]}>
                    {item?.name}
                </Text>
                <Text style={[styles.statusTime, { color: COLORS.gray }]}>
                    {item?.time}
                </Text>
            </View>
        </TouchableOpacity >
    );

    const handleAddStatus = () => {
        console.log("Add new status");
    };

    const HeaderContainerStatuAdd = () => {

        return (
            <>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: wp(3)
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CreateStory')}
                        // onPress={handleOpenModal} 
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Image
                            source={profile?.profilepicture ? { uri: profile?.profilepicture } : ""}
                            style={[styles.statusImage, {
                                borderColor: 'grey'
                            }]}
                        />
                        <View style={{ position: 'relative', top: 18, right: 20, borderColor: COLORS.white, borderWidth: wp(0.3), backgroundColor: COLORS.black, borderRadius: wp(10) }}>
                            <Icon name="add-circle" size={22} color={COLORS.button_bg_color} />
                        </View>
                    </TouchableOpacity >

                    <TouchableOpacity
                        onPress={() => navigation.navigate('OwnStatusView')}
                        style={{ width: wp(80), }}
                    >
                        <Text style={[styles.statusName]}>
                            {profile?.fullname}
                        </Text>
                        <Text style={[styles.statusTime, { color: COLORS.gray }]}>
                            Click to view your Update
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 0.5, marginVertical: wp(3), width: wp(95), backgroundColor: COLORS.next_bg_color, alignSelf: 'center' }} />
            </>
        );
    }


    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleStoryPreview = (index) => {
        navigation.navigate('StoryPreviewScreen', {
            statusArray: dummyStatusArray,
            initialIndex: index,
        });
    };

    const handleOpenModal = () => {
        setIsModalVisible(true); // Set modal visibility to true when clicked
    };

    const handleCloseModal = () => {
        setIsModalVisible(false); // Close the modal when the close button is clicked
    };

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
            <HeaderComponent />

            <HeaderContainerStatuAdd />
            <Text style={[{ color: COLORS.gray, marginHorizontal: wp(4), marginVertical: wp(1.5), marginBottom: wp(3) }]}>
                Recent Update
            </Text>
            {/* Status List Section */}
            <FlatList
                data={dummyStatusArray}
                renderItem={renderStatusItem}
                keyExtractor={(item) => item.id}
                style={styles.statusList}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={<View style={{ marginVertical: wp(20), alignSelf: 'center' }}>
                    <Text style={[
                        Louis_George_Cafe.regular.h4
                    ]}>No status updates available</Text>
                </View>}
            />


            <Toast style={{ zIndex: 999 }} />

            {/* Modal Component */}
            <Modal
                transparent={true}
                animationType="none"
                visible={isModalVisible}
                onRequestClose={handleCloseModal} // To handle the back press
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={{
                                backgroundColor: "#F1F2F3",
                                width: wp(80),
                                borderRadius: wp(2)
                            }}>
                                <TouchableOpacity onPress={() => openCamera()} style={{
                                    backgroundColor: "#F1F2F3",
                                    width: wp(80),
                                    borderRadius: wp(2)
                                }}>
                                    <Text style={[{
                                        color: '#000',
                                        alignSelf: 'center',
                                        padding: wp(2),
                                        marginVertical: wp(1)
                                    }]}>Open Camera</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => openFilePicker()}
                                    style={{
                                        backgroundColor: "#F1F2F3",
                                        width: wp(80),
                                        // borderRadius: wp(2)
                                    }}
                                >
                                    <Text style={[{
                                        color: '#000',
                                        padding: wp(2),
                                        marginVertical: wp(1),
                                        alignSelf: 'center'
                                    }]}>Gallery</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={handleCloseModal}
                                style={{
                                    backgroundColor: "#F1F2F3",
                                    width: wp(80),
                                    borderRadius: wp(2),
                                    marginVertical: wp(2)
                                }}
                            >
                                <Text style={[{
                                    color: '#000',
                                    padding: wp(2),
                                    marginVertical: wp(1),
                                    alignSelf: 'center'
                                }]}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    headContainer: {
        width: wp(100),
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: hp(1),
        paddingHorizontal: wp(4),
    },
    headingName: {
        fontSize: 20,
        fontWeight: "600",
    },
    statusList: {
        marginVertical: wp(1),
        paddingHorizontal: wp(4),
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(2),
    },
    statusImageContainer: {
        flexDirection: "row",
        borderWidth: wp(0.7),
        borderColor: COLORS.button_bg_color,
        borderRadius: wp(8),
    },
    statusImage: {
        width: wp(14),
        height: wp(14),
        borderRadius: wp(7),
        borderWidth: 2,
        borderColor: 'white',
    },
    statusTextContainer: {
        marginLeft: wp(3),
    },
    statusName: {
        fontSize: 14,
        fontWeight: "600",
    },
    statusTime: {
        fontSize: 12,
        marginTop: hp(0.5),
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContainer: {
        position: "absolute",
        bottom: wp(5),
        borderRadius: wp(2),
        alignItems: "center",
        width: wp(85),
        alignSelf: "center"

    },
    modalText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: wp(3),
    },
    closeButton: {
        fontSize: 16,
        fontWeight: "600",
    }
});

export default UserStories;
