import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    SafeAreaView,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Animated, PanResponder
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { wp, hp } from "../../resources/dimensions";
import { COLORS } from "../../resources/Colors";
import { useNavigation } from "@react-navigation/native";
import { Louis_George_Cafe } from "../../resources/fonts";
import { deleteOwnStory, getOwnUpdate } from "../../redux/authActions";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

const OwnStatusView = () => {
    const userId = useSelector((state) => state.auth.user?._id);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusList, setStatusList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = () => {
        if (userId) {
            dispatch(
                getOwnUpdate(userId, (response) => {
                    console.log(response, 'getOwnStatus');
                    setStatusList(response?.data);
                    setIsLoading(false); // Set loading to false after data is fetched
                })
            );
        }
    };

    // Refresh data when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true); // Start loading when screen is focused
            fetchData(); // Fetch data on focus
        }, [userId])
    );


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return Math.abs(gestureState.dy) > 10; // Only respond to vertical movements
        },
        onPanResponderMove: (evt, gestureState) => {
            // You can track the swipe distance here if needed
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 50) {

                // Swipe down detected with enough movement, go back or close the story
                navigation.goBack();
            }
        },
    });

    const handleDelete = (statusId) => {
        Alert.alert(
            "Delete Status",
            "Are you sure you want to delete this status?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        fnDeleteApiCall(statusId)
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const fnDeleteApiCall = (statusId) => {
        dispatch(
            deleteOwnStory(userId, statusId, (response) => {
                Toast.show({
                    text1: response.message,
                    type: 'success',
                    position: 'top',
                });
                onRefresh();
            })
        );
    };

    const onRefresh = () => {
        fetchData();
    };

    const handleOnPressItem = (item) => {
        setSelectedStatus(item);
        setShowModal(!showModal);
    };

    const onGestureEvent = (event) => {
        const { translationY } = event.nativeEvent;
        // If the swipe down exceeds a threshold, close the modal
        if (translationY > 80) {
            // setModalVisible(false);
        }
    };

    const onHandlerStateChange = (event) => {
        const { state, translationY, velocityY } = event.nativeEvent;
        // Handle the state change event: if the gesture is completed, check if we reached the threshold
        // if (state === 5) { // 5 means gesture has ended
        if (translationY > 50 || velocityY > 5) { // A swipe up threshold (adjust as necessary)
            setShowModal(false); // Close the modal if swipe is large enough
            // }
        }
    };

    const renderStatusItem = ({ item }) => (
        <TouchableOpacity style={styles.statusItem} onPress={() => handleOnPressItem(item)}>
            <Image source={{ uri: item?.image }} style={styles.statusImage} />
            <View style={styles.statusInfo}>
                <Text numberOfLines={1} style={[styles.caption, Louis_George_Cafe.bold.h6, {
                    width: wp(65)
                }]}>{item.caption}</Text>
                <Text style={[styles.viewCount, Louis_George_Cafe.bold.h9]}>{item?.views || 0} views</Text>
                <Text style={[styles.viewCount, Louis_George_Cafe.regular.h9]}>{item?.createddatetime} </Text>
            </View>
            <TouchableOpacity
                onPress={() => handleDelete(item._id)}
                style={styles.deleteButton}
            >
                <MaterialIcons name="delete" size={18} color={COLORS.black} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, Louis_George_Cafe.regular.h4]}>My Updates</Text>
            </View>

            {/* Loader displayed while data is being fetched */}
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                // List of statuses displayed after data is fetched
                <FlatList
                    data={statusList}
                    renderItem={renderStatusItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.flatListContainer}
                    ListEmptyComponent={<View style={{ marginVertical: wp(20), alignSelf: 'center' }}>
                        <Text style={[
                            Louis_George_Cafe.regular.h4
                        ]}>No updates </Text>
                    </View>}
                />
            )}
            <Toast zIndex={1} />

            {/* Floating + Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate("CreateStory")}
                style={styles.addButton}
            >
                <MaterialIcons name="add" size={30} color={COLORS.black} />
            </TouchableOpacity>

            {/* Modal for viewing status details */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="none"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <GestureHandlerRootView style={styles.modalContainer}>
                        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                            <View style={styles.modalOverlay}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.modalContent}>
                                        {/* <TouchableOpacity
                                            onPress={() => { setShowModal(false), setSelectedStatus(null) }}
                                            style={styles.closeButton}
                                        >
                                            <MaterialIcons name="close" size={34} color={COLORS.black} />
                                        </TouchableOpacity> */}
                                        {selectedStatus && (
                                            <View style={styles.modalBody}>
                                                <Image
                                                    resizeMode='contain'
                                                    source={{ uri: selectedStatus?.image }}
                                                    style={styles.modalImage}
                                                />
                                                <Text style={[Louis_George_Cafe.regular.h6, styles.modalCaption]}>
                                                    {selectedStatus?.caption}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </PanGestureHandler>
                    </GestureHandlerRootView >
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },

    backButton: {
    },
    headerTitle: {
        color: COLORS.white,
        textAlign: "center",
        flex: 1
    },
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: wp(2),
        paddingHorizontal: wp(4),
    },
    statusImage: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        marginRight: wp(4),
    },
    statusInfo: {
        flex: 1,
    },
    caption: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.white,
    },
    viewCount: {
        color: COLORS.gray,
    },
    deleteButton: {
        backgroundColor: COLORS.button_bg_color,
        padding: wp(1),
        borderRadius: wp(5),
    },

    flatListContainer: {
        paddingBottom: wp(2), // Add bottom padding to avoid content touching the bottom of the screen
    },
    addButton: {
        position: "absolute",
        bottom: hp(4),
        right: wp(5),
        backgroundColor: COLORS.button_bg_color,
        padding: wp(3),
        borderRadius: wp(10),
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#808080",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 1)",
    },
    modalContent: {
        width: wp(90),
        height: hp(90),
        borderRadius: wp(4),
        padding: wp(4),
        alignItems: "center",
        justifyContent: "center"
    },
    closeButton: {
        position: "absolute",
        top: hp(1),
        right: wp(2),
    },
    modalBody: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalImage: {
        width: wp(90),
        height: hp(80),
        marginBottom: wp(4),
    },
    modalCaption: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.black,
        textAlign: "center",
    },
});

export default OwnStatusView;
