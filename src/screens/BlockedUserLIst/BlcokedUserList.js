import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Image,
    Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { useDispatch, useSelector } from "react-redux";
import { getBlockedUserList, userUnblock } from "../../redux/authActions";
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from "react-native-paper";

const BlcokedUserList = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    const profile = useSelector((state) => state.auth.profile);
    const [blcokedUserList, setSBLockedList] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fnGetUserBlockedList()
        }
    }, [userId]);

    function fnGetUserBlockedList() {
        setLoading(true)
        dispatch(
            getBlockedUserList(userId, (response) => {
                // alert(JSON.stringify())
                if (response.success) {
                    setSBLockedList(response.data);
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            })
        );

        setLoading(false)
    }

    const HeaderComponent = () => {
        
        return (
            <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={[styles.headingName, Louis_George_Cafe.bold.h3, { color: COLORS.white }]}>
                        Blocked List
                    </Text>
                </View>
            </LinearGradient>
        );
    };

    const unblockUser = (touserId) => {
        Alert.alert("Unblock User", `Are you sure you want to unblock?`, [
            {
                text: "Cancel",

                style: "cancel",
            },
            {
                text: "Yes", onPress: () =>
                    dispatch(
                        userUnblock(userId, touserId, (response) => {
                            setLoading(true)
                            console.log(response, "response")
                            if (response.success) {
                                Toast.show({
                                    text1: 'Success!',
                                    text2: response.message,
                                    type: 'success',
                                    position: 'top',
                                });
                                fnGetUserBlockedList();
                                setLoading(false)
                            }
                            else {
                                setLoading(false)
                            }

                        })
                    )
            },
        ]);
    };

    const renderBlockedUser = ({ item }) => (
        <View style={styles.userItem}>
            <Image source={item.image ? { uri: item?.image } : ""} style={[styles.profilePic, { borderColor: COLORS.button_bg_color }]} />

            <View style={styles.usernameContainer}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h7, { color: COLORS.white, maxWidth: wp(40) }]}>
                    {item?.username}
                </Text>
            </View>
            <TouchableOpacity
                style={[styles.unblockButton, { backgroundColor: COLORS.button_bg_color }]}
                onPress={() => unblockUser(item._id)}
            >
                <Text style={styles.unblockText}>Unblock</Text>
            </TouchableOpacity>
        </View>
    );




    return (
        <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
            <HeaderComponent />
            {
                loading ?
                    <ActivityIndicator color="#FFF" style={{ marginTop: wp(10) }} />
                    :
                    <FlatList
                        data={blcokedUserList}  // Make sure to use the actual data here
                        keyExtractor={(item) => item.id}
                        renderItem={renderBlockedUser}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={[Louis_George_Cafe.bold.h4, { color: COLORS.white }]}>
                                    No Users
                                </Text>
                            </View>
                        )}
                    />
            }
            <Toast />
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

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(2),
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

    userItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: wp(1),
        paddingHorizontal: wp(4),
        backgroundColor: "#C1C1C1",
        borderBottomWidth: 1,
        borderBottomColor: "#444",
        marginVertical: wp(1),
        borderRadius: wp(3),
        flex: 1,
        marginHorizontal: wp(2)
    },

    usernameContainer: {
        flex: 1,
        marginLeft: wp(3),
    },

    profilePic: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(6),
        marginLeft: wp(1),
        borderWidth: wp(0.5)
    },

    unblockButton: {
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        borderRadius: 5,
    },

    unblockText: {
        color: "#FFF",
    },
    listContainer: {
        paddingTop: hp(2),
    },
});


export default BlcokedUserList;
