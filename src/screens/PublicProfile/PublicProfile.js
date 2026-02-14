import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Switch,
    Alert,
    ActivityIndicator,
    FlatList,
    Modal,
    TouchableWithoutFeedback
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useDispatch, useSelector } from "react-redux";
import {
    blockUser,
    deleteeChatUsers,
    muteChatUsers,
    reportUser,
    getListMessages
} from "../../redux/authActions";
import Toast from "react-native-toast-message";

const PublicProfile = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();

    const { userItem } = route.params;
    const userId = useSelector((state) => state.auth.user?._id);

    const [loader, setLoader] = useState(false);
    const [loadingMedia, setLoadingMedia] = useState(true);
    const [mediaItems, setMediaItems] = useState([]);
    const [canSendMessages, setCanSendMessages] = useState(userItem.muted == '1');
    const [selectedImage, setSelectedImage] = useState(null);

    // 🔥 Fetch Chat Media (Images Only)
    useEffect(() => {
        if (userId && userItem?.username) {
            fetchChatMedia();
        }
    }, [userId]);

    const fetchChatMedia = () => {
        setLoadingMedia(true);

        dispatch(
            getListMessages(userId, userItem.username, (response) => {

                if (response?.data) {

                    const onlyImages = response.data.filter(
                        (item) => item.image && item.image !== ""
                    );

                    setMediaItems(onlyImages);
                }

                setLoadingMedia(false);
            })
        );
    };

    // ------------------------
    // HANDLE BLOCK / REPORT / DELETE
    // ------------------------

    const handleButton = (type) => {

        let title = "";
        let action;

        if (type === "block") {
            title = `Are you sure you want to block ${userItem.fullname}?`;
            action = blockUser;
        } else if (type === "report") {
            title = `Report ${userItem.fullname}?`;
            action = reportUser;
        } else {
            title = `Delete ${userItem.fullname}?`;
            action = deleteeChatUsers;
        }

        Alert.alert("Confirm", title, [
            { text: "Cancel", style: "cancel" },
            {
                text: "OK",
                onPress: () => {
                    setLoader(true);
                    dispatch(
                        action(userId, userItem.touserId, (response) => {
                            Toast.show({
                                text1: response.message,
                                type: response.success ? "success" : "error"
                            });

                            if (response.success) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "HomeScreen" }],
                                });
                            }

                            setLoader(false);
                        })
                    );
                }
            }
        ]);
    };

    // ------------------------
    // HANDLE MUTE
    // ------------------------

    const handleMute = () => {
        setCanSendMessages(!canSendMessages);

        dispatch(
            muteChatUsers(userId, userItem.username, (response) => {
                Toast.show({
                    text1: response.message,
                    type: "success"
                });
            })
        );
    };

    // ------------------------
    // RENDER
    // ------------------------

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>

            {/* HEADER */}
            <LinearGradient
                colors={["#F0F0F0", "#FFF"]}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>

                <Text
                    numberOfLines={1}
                    style={[styles.headingName, { color: COLORS.white }]}
                >
                    {userItem.fullname}
                </Text>

                <View />
            </LinearGradient>

            {/* PROFILE INFO */}
            <View style={styles.profileContainer}>

                <Image
                    source={{ uri: userItem.image }}
                    style={styles.profileImage}
                />

                <Text style={[styles.headingName, { color: COLORS.white }]}>
                    {userItem.fullname}
                </Text>

                <Text style={{ color: COLORS.white }}>
                    {userItem.status || "Hey there! I am using ChatZol!"}
                </Text>
            </View>

            {/* MEDIA SECTION */}
            <View style={{ padding: wp(4) }}>

                <Text style={[styles.mediaHeader]}>
                    Media ({mediaItems.length})
                </Text>

                {loadingMedia ? (
                    <ActivityIndicator color={COLORS.white} />
                ) : mediaItems.length > 0 ? (

                    <FlatList
                        data={mediaItems}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => setSelectedImage(item.image)}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.mediaImage}
                                />
                            </TouchableOpacity>
                        )}
                    />

                ) : (
                    <Text style={{ color: COLORS.white }}>
                        No media shared yet
                    </Text>
                )}
            </View>

            {/* MUTE OPTION */}
            <View style={styles.optionRow}>
                <View style={{ flexDirection: "row" }}>
                    <Ionicons name="notifications" size={24} color={COLORS.white} />
                    <Text style={{ color: COLORS.white, marginLeft: wp(2) }}>
                        Mute
                    </Text>
                </View>

                <Switch
                    value={canSendMessages}
                    onValueChange={handleMute}
                    trackColor={{ true: COLORS.primary }}
                />
            </View>

            {/* BOTTOM BUTTONS */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleButton("report")}>
                    <Text style={styles.dangerText}>
                        Report {userItem.fullname}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleButton("block")}>
                    <Text style={styles.dangerText}>
                        Block {userItem.fullname}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleButton("delete")}>
                    <Text style={styles.dangerText}>
                        Delete Chat
                    </Text>
                </TouchableOpacity>
            </View>

            {/* FULL SCREEN IMAGE MODAL */}
            <Modal visible={!!selectedImage} transparent>
                <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
                    <View style={styles.modalContainer}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Toast />

        </SafeAreaView>
    );
};

export default PublicProfile;


const styles = StyleSheet.create({

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: wp(4),
        alignItems: "center"
    },

    profileContainer: {
        alignItems: "center",
        marginVertical: hp(2)
    },

    profileImage: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        borderWidth: 2,
        borderColor: COLORS.button_bg_color,
        marginBottom: hp(1)
    },

    headingName: {
        fontSize: 20,
        fontWeight: "600"
    },

    mediaHeader: {
        fontSize: 18,
        color: COLORS.white,
        marginBottom: wp(3)
    },

    mediaImage: {
        width: wp(30),
        height: wp(30),
        margin: wp(1),
        borderRadius: wp(2)
    },

    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp(4),
        alignItems: "center",
        marginVertical: hp(2)
    },

    buttonContainer: { 
        alignItems:'center',
        marginTop: "auto",
        padding: wp(4)
    },

    dangerText: {
        color: "red",
        marginVertical: wp(2),
        fontSize: 16
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center"
    },

    fullImage: {
        width: "100%",
        height: "100%"
    }
});
