import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { wp, hp } from "../../resources/dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../resources/Colors";
import { Louis_George_Cafe } from "../../resources/fonts";
import { ActivityIndicator } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from "react-redux";
import { getCallHistoryList } from "../../redux/authActions";

const CallHistory = () => {


    const [loading, setLoading] = useState(true);
    const luserName = useSelector((state) => state.auth.user.username);
    const [calls, setCalls] = useState([]);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    
    useEffect(() => {
        fetchCalls();
    }, []);

    function fetchCalls() {
        setLoading(true)
        dispatch(
            getCallHistoryList(userId, (response) => {
                if (response.success) {
                    setCalls(response.data);
                    setLoading(false)
                }
                else {
                    setLoading(false)
                }
            })
        );
        setLoading(false)
    }

    const HeaderComponent = () => (
        <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
            <View style={styles.textContainer}>
                <Text style={[styles.headingName, Louis_George_Cafe.bold.h3, { color: COLORS.white }]}>
                    Call History
                </Text>
            </View>
        </LinearGradient>
    );

    const renderCallItem = useCallback(({ item }) => {
        const isOutgoing = item.offer === true;
        const isMissed = item?.missed ?? !item.callEnded;
        const type = isOutgoing ? "outgoing" : "incoming";
        const iconName = type === "incoming" ? (isMissed ? "phone-missed" : "phone-incoming") : "phone-outgoing";
        const iconColor = isMissed ? "#E74C3C" : "#4CAF50";
        const statusText = isMissed ? "Missed" : (type === "incoming" ? "Received" : "Outgoing");

        return (
            <TouchableOpacity style={styles.userItem}>
                <Image source={{ uri: item?.image || "https://via.placeholder.com/100" }} style={styles.profilePic} />
                <View style={styles.usernameContainer}>
                    <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, { color: COLORS.white, textTransform: "capitalize" }]}>
                        {item?.username || "Unknown"}
                    </Text>
                    <Text style={{ color: "#AAA", fontSize: wp(3.2), marginTop: hp(0.5) }}>
                        {`${item?.time}`}
                    </Text>
                    <Text style={{ color: iconColor, fontSize: wp(3.2), marginTop: hp(0.5) }}>
                        {statusText}
                    </Text>
                </View>
                <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
            </TouchableOpacity>
        );
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.black, flex: 1 }}>
            <HeaderComponent />
            {
                loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator color="#000" size={wp(8)} />
                        <Text style={[Louis_George_Cafe.regular.h5, { color: "#fff", marginTop: hp(2) }]}>
                            Loading call history...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={calls}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCallItem}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={[Louis_George_Cafe.bold.h4, { color: COLORS.white }]}>
                                    No Call History
                                </Text>
                            </View>
                        )}
                    />
                )
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: hp(2),
        paddingHorizontal: wp(2),
        backgroundColor: "#000",
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
    },
    headingName: {
        fontSize: 20,
        fontWeight: "600",
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        backgroundColor: "#fff",
        marginHorizontal: wp(2),
        marginVertical: hp(0.5),
    },

    usernameContainer: {
        flex: 1,
        marginLeft: wp(3),
    },

    profilePic: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
    },

    listContainer: {
        paddingTop: hp(1),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(2),
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.black,
    },
});

export default CallHistory;
