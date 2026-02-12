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
    FlatList
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useDispatch, useSelector } from "react-redux";
import { blockUser, deleteeChatUsers, getMediaShared, muteChatUsers, reportUser } from "../../redux/authActions";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const PublicProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    const route = useRoute();
    const { userItem } = route.params;
    const [loader, setLoader] = useState(false);
    const [canSendMessages, setCanSendMessages] = useState(userItem.muted == '1' ? true : false); // State for the toggle switch
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fnGetUserBlockedList()
        }
    }, [userId]);

    function fnGetUserBlockedList() {
        setLoading(true)
        dispatch(
            getMediaShared(userId, (response) => {
                if (response.success) {
                    setLoading(false)
                    alert(JSON.stringify(response))
                }
                else {
                    setLoading(false)
                }
            })
        );

        setLoading(false)
    }


    const [mediaItems, setMediaItems] = useState([
        "https://www.alpha-verse.com/assets/images/wallpapers/bg-1.png",
        "https://www.alpha-verse.com/assets/images/wallpapers/bg-1.png",
    ]); // Dummy media items


    const HeaderComponent = () => {
        return (
            <>
                <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                        <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
                    </TouchableOpacity>
                    <View style={{ maxWidth: wp(100), flex: 1, alignItems: "center" }}>
                        <Text numberOfLines={1} style={[styles.headingName, Louis_George_Cafe.bold.h5, { color: COLORS.white }]}>
                            {userItem?.fullname}
                        </Text>
                    </View>
                </LinearGradient>
                <View style={{ height: 1, backgroundColor: "#9999", marginTop: wp(1) }} />
            </>
        );
    };

    const handleButton = (param) => {
        if (param === 'block') {
            // Show confirmation dialog
            Alert.alert(
                "Confirm Block",
                ` "Are you sure you want to block ${userItem?.fullname}?"`,
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Block action canceled"),
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            setLoader(true)
                            dispatch(
                                blockUser(userId, userItem.touserId, (response) => {
                                    if (response.success) {
                                        Toast.show({
                                            text1: 'Success',
                                            text2: response.message,
                                            type: 'success',
                                        });
                                        setTimeout(() => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: "HomeScreen" }],
                                            });
                                        }, 1000)
                                    }
                                    else {
                                        Toast.show({
                                            text1: 'Error',
                                            text2: response.message,
                                            type: 'error',
                                        });
                                        setLoader(false)
                                    }
                                })
                            );
                        }
                    }
                ],
                { cancelable: true } // Disable dismissing by tapping outside the dialog
            );
        }
        else if (param === 'report') {
            Alert.alert(
                "Confirm Report",
                ` "Are you sure you want to Report ${userItem?.fullname}?"`,
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Block action canceled"),
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            setLoader(true)
                            dispatch(
                                reportUser(userId, userItem.touserId, (response) => {
                                    if (response.success) {
                                        Toast.show({
                                            text1: 'Success',
                                            text2: response.message,
                                            type: 'success',
                                        });
                                        setTimeout(() => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: "HomeScreen" }],
                                            });
                                        }, 1000)
                                    }
                                    else {
                                        Toast.show({
                                            text1: 'Error',
                                            text2: response.message,
                                            type: 'error',
                                        });
                                        setLoader(false)
                                    }
                                })
                            );
                        }
                    }
                ],
                { cancelable: true } // Disable dismissing by tapping outside the dialog
            );
        }
        else {
            Alert.alert(
                "Confirm Delete",
                ` "Are you sure you want to Delete ${userItem?.username}?"`,
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Block action canceled"),
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            setLoader(true)
                            dispatch(
                                deleteeChatUsers(userId, userItem?.username, (response) => {
                                    if (response.success) {
                                        Toast.show({
                                            text1: 'Success',
                                            text2: response.message,
                                            type: 'success',
                                        });
                                        setTimeout(() => {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: "HomeScreen" }],
                                            });
                                        }, 1000)
                                    }
                                    else {
                                        Toast.show({
                                            text1: 'Error',
                                            text2: response.message,
                                            type: 'error',
                                        });
                                        setLoader(false)
                                    }
                                })
                            );
                        }
                    }
                ],
                { cancelable: true } // Disable dismissing by tapping outside the dialog
            );
        }
    };

    function fnHandleMuteConvo() {
        dispatch(
            muteChatUsers(userId, userItem?.username, (response) => {
                Toast.show({
                    text1: response.message,
                    type: 'success',
                    position: 'top',
                });
            })
        );
    }

    const Button = ({ label, iconName, onPress }) => (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <View style={styles.buttonContent}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h7, styles.buttonText]}>{label}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
                <HeaderComponent />
                <View style={styles.profileContainer}>
                    {loader ? <ActivityIndicator /> :
                        <>
                            <View style={styles.profileInfoContainer}>
                                <Image
                                    source={{ uri: userItem?.image }}
                                    style={[styles.profileImage, { borderColor: COLORS.button_bg_color }]}
                                />
                                <Text numberOfLines={1} style={[styles.headingName, Louis_George_Cafe.bold.h5, { color: COLORS.white, marginVertical: wp(1) }]}>
                                    {userItem?.fullname}
                                </Text>
                                <Text style={styles.profileStatus}>
                                    {userItem?.status || "Hey there! I am using ChatZol!"}
                                </Text>
                            </View>

                            {/* Media Listing - Horizontal View with Square Images */}
                            <View style={styles.mediaContainer}>
                                <Text style={[styles.mediaHeader, Louis_George_Cafe.bold.h6]}>Media</Text>
                                <FlatList
                                    horizontal
                                    data={mediaItems}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.mediaItem}>
                                            <Image source={{ uri: item }} style={styles.mediaImage} />
                                        </View>
                                    )}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>

                            <View style={{ paddingHorizontal: wp(1), marginVertical: hp(1) }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginVertical: hp(2),
                                        justifyContent: 'space-between'
                                    }}
                                    onPress={() => navigation.navigate("StaredMessages")}
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <Ionicons name="star" size={24} color={COLORS.white} />
                                        <Text style={[Louis_George_Cafe.regular.h6, { marginLeft: wp(2) }]}>
                                            Starred Messages
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: "flex-end" }}>
                                        <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
                                    </View>
                                </TouchableOpacity>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginVertical: hp(1),
                                        justifyContent: 'space-between'
                                    }}
                                // onPress={() => navigation.navigate("ChangePasswordScreen")}
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <Ionicons name="notifications" size={24} color={COLORS.white} />
                                        <Text style={[Louis_George_Cafe.regular.h6, { marginLeft: wp(2) }]}>
                                            Mute
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: "flex-end" }}>
                                        <Switch
                                            value={canSendMessages}
                                            onValueChange={(value) => { setCanSendMessages(value); fnHandleMuteConvo() }}
                                            trackColor={{ false: '#999', true: COLORS.primary }}
                                            thumbColor={canSendMessages ? COLORS.button_bg_color : '#ffffff'}
                                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </>
                    }
                </View>

                {/* Buttons fixed at the bottom */}
                <View style={[styles.buttonContainer, { backgroundColor: COLORS.search_bg_color }]}>
                    <Button label={`Report ${userItem?.fullname}`} iconName="message" onPress={() => handleButton('report')} />
                    <View style={{ height: 1, width: wp(95), alignSelf: "center", alignContent: "center", backgroundColor: "#999" }} />
                    <Button label={`Block ${userItem?.fullname}`} iconName="block" onPress={() => handleButton('block')} />
                    <View style={{ height: 0.8, width: wp(95), alignSelf: "center", alignContent: "center", backgroundColor: "#777" }} />
                    <Button label={`Delete ${userItem?.fullname}`} iconName="block" onPress={() => handleButton('delete')} />
                </View>
                <Toast style={{ zindex: 999 }} />
            </SafeAreaView>
        </>
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
    profileContainer: {
        flex: 1,
        padding: wp(4),
    },
    profileInfoContainer: {
        alignItems: "center",
        marginBottom: hp(4),
    },
    profileImage: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        marginBottom: hp(2),
        borderWidth: wp(0.5),
    },
    profileName: {
        color: "#FFF",
        marginBottom: hp(1),
    },
    profileStatus: {
        textAlign: "center",
        paddingHorizontal: wp(5),
    },
    headingName: {
        fontSize: 20,
        fontWeight: "600",
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 0,
        width: wp(95),
        borderRadius: wp(2),
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(1),
    },
    button: {
        marginVertical: wp(1),
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: wp(3),
        borderRadius: wp(2),
        maxWidth: wp(80),
    },
    icon: {
        marginRight: wp(2),
    },
    buttonText: {
        color: "red",
        fontWeight: "500",
        textAlign: "center",
    },
    mediaContainer: {
        // marginTop: wp(1),
        paddingLeft: wp(1),
    },
    mediaHeader: {
        color: COLORS.white,
        fontSize: 18,
        marginBottom: wp(3),
    },
    mediaItem: {
        marginRight: wp(3),
    },
    mediaImage: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(2),
        borderWidth: 1,
        borderColor: COLORS.white,
    },
});

export default PublicProfile;
