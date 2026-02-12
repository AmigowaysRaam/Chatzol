import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    Switch,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../resources/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { hp, wp } from '../../resources/dimensions';
import { Louis_George_Cafe } from '../../resources/fonts';
import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator, Avatar, Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { getListConversation, getSearchUser } from '../../redux/authActions';

const AddSubgroup = () => {

    const navigation = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');
    const route = useRoute();
    const { groupId, groupData } = route.params;

    // const users = useSelector((state) => state.auth.searchedUsers || []);
    const [users, setusersList] = useState(null);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupImage, setGroupImage] = useState(null);
    const userId = useSelector((state) => state.auth.user?._id);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [canSendMessages, setCanSendMessages] = useState(null); // State for the toggle switch
    const [page, setPage] = useState(1);  // Track the current page
    const [hasMore, setHasMore] = useState(true);
    // const filteredUsers = users.filter((user) =>
    //     user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    useEffect(() => {
        // alert(groupId)
    }, [])

    const toggleSelection = (userId) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };


    useEffect(() => {
        if (!searchTerm) return;
        setIsLoading(true);
        const lettersOnly = searchTerm.replace(/[^a-zA-Z]/g, '');
        if (lettersOnly.length >= 3) {
            dispatch(getSearchUser(userId, searchTerm, page, '', (response) => {
                if (response.success) {
                    const flag = response?.data
                    setusersList(flag)
                    setIsLoading(false)
                }
            })
            );
        }
        else {
            setIsLoading(false)
        }

    }, [searchTerm]);
    const handleCreateGroup = async () => {
        setIsLoading(true);

        // Check if group name is entered
        if (!groupName.trim()) {
            alert('Please enter a Sub group name.');
            setIsLoading(false);
            return;
        }

        // Prepare FormData for the POST request
        const formData = new FormData();
        formData.append('name', groupName);
        formData.append('userid', userId);
        formData.append('membersid', selectedUsers);
        formData.append('allow_send_message', canSendMessages ? 1 : 0)
        formData.append('groupid', groupId);


        // Ensure group image is correctly formatted
        if (groupImage) {
            formData.append('image', {
                uri: groupImage,
                type: 'image/jpeg',
                name: 'groupImage.jpg',
            });
        }

        try {
            const response = await fetch('https://chatzol.scriptzol.in/api/?url=app-create-group', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            // alert(JSON.stringify(data));
            if (data.success) {
                dispatch(getListConversation(userId));
                Toast.show({
                    text1: 'Success!',
                    text2: data.message,
                    type: 'success',
                    position: 'top',
                });

                setIsLoading(false);
                setTimeout(() => {
                    navigation.goBack();
                }, 1000);
            } else {
                Toast.show({
                    text1: 'Error!',
                    text2: data.message,
                    type: 'error',
                    position: 'top',
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error during API call:', error);
            Toast.show({
                text1: 'Error!',
                text2: 'Something went wrong, please try again later.',
                type: 'error',
                position: 'top',
            });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setGroupImage(response.assets[0].uri);
            }
        });
    };

    const HeaderComponent = ({ onBackPress }) => (
        <LinearGradient colors={["#F0F0F0", "#FFF"]} style={styles.headContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
                <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={[Louis_George_Cafe.bold.h6, { color: COLORS.white, alignSelf: "center", textTransform: "capitalize" }]}>
                    {groupData?.name}
                </Text>
            </View>
        </LinearGradient>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <HeaderComponent onBackPress={() => navigation.goBack()} />
            <View style={[styles.header, {
                backgroundColor: COLORS.search_bg_color
            }]}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: wp(4),
                    }}
                >
                    <Feather
                        name="camera"
                        onPress={pickImage}
                        size={24}
                        style={{
                            backgroundColor: COLORS.input_background,
                            padding: wp(3),
                            marginHorizontal: wp(4),
                            borderRadius: wp(7),
                        }}
                        color={COLORS.button_bg_color}
                    />
                    <TextInput
                        style={{
                            backgroundColor: COLORS.black,
                            width: wp(70),
                            paddingVertical: wp(2),
                            paddingHorizontal: wp(2),
                            borderRadius: wp(2),
                        }}
                        placeholder="Sub Group Name"
                        placeholderTextColor={COLORS.white}
                        color={COLORS.white}
                        value={groupName}
                        onChangeText={setGroupName}
                    />
                </TouchableOpacity>
                <View style={styles.toggleSwitchContainer}>
                    <Text
                        style={[
                            // styles.headingName,
                            Louis_George_Cafe.regular.h8,
                            { color: COLORS.white, marginHorizontal: wp(1) },
                        ]}
                    >Allow others to send messages</Text>
                    <Switch
                        value={canSendMessages}
                        onValueChange={(value) => setCanSendMessages(value)}
                        trackColor={{ false: '#fff', true: COLORS.primary }} // Customize track color when off and on
                        thumbColor={canSendMessages ? COLORS.button_bg_color : '#ffffff'} // Customize thumb color when switched on or off
                        style={{
                            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 },
                            ],
                        }}
                    />
                </View>

                {groupImage && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp(2) }}>
                        <Image
                            source={groupImage ? { uri: groupImage } : ""}
                            style={{ width: wp(20), height: wp(20), borderRadius: 8 }}
                            accessibilityLabel="Group Image"
                            onError={() => console.log('Image failed to load')}
                        />
                        <TouchableOpacity
                            onPress={() => setGroupImage(null)}
                            accessibilityLabel="Remove group image"
                            style={{ marginLeft: wp(1) }}
                        >
                            <MaterialIcons name="close" size={28} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <Toast ref={(ref) => Toast.setRef(ref)} />
            <View style={[styles.searchContainer, { backgroundColor: COLORS.search_bg_color }]}>
                <TouchableOpacity style={styles.iconContainer}>
                    <MaterialIcons name="search" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    value={searchTerm}
                    onChange={() => { setPage(1) }}
                    onChangeText={setSearchTerm}
                    placeholder="Search..."
                    placeholderTextColor={COLORS.white}
                    color={COLORS.white}
                />
            </View>
            {isLoading ?
                <ActivityIndicator color='#FFF' />
                :
                <FlatList
                    style={{ marginBottom: wp(10) }}
                    data={users}
                    keyExtractor={(item) => item._id.toString()} // Use unique IDs directly
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => toggleSelection(item._id)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: wp(2) }}>
                                <Checkbox
                                    color={COLORS.button_bg_color}
                                    status={selectedUsers.includes(item._id) ? 'checked' : 'unchecked'}
                                />
                                <Avatar.Image
                                    size={48}
                                    style={{ marginStart: wp(2) }}
                                    source={{ uri: item.image }}
                                />
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={[styles.headingName, Louis_George_Cafe.medium.h7, { color: COLORS.white, marginStart: wp(4) }]}>
                                        {item?.fullname}
                                    </Text>
                                    <Text style={[styles.headingName, Louis_George_Cafe.medium.h7, { color: COLORS.white, marginStart: wp(4) }]}>
                                        {item?.username}
                                    </Text>

                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    onEndReached={() => {
                        if (!isLoading && hasMore) {
                            setPage(prevPage => prevPage + 1);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                />


            }



            {/* <ButtonComponent title="Create Group" onPress={handleCreateGroup} isLoading={isLoading} /> */}
            <TouchableOpacity
                onPress={() => handleCreateGroup()}  // Assuming this is the onPress handler
                style={[styles.senButton, {
                    backgroundColor: COLORS.button_bg_color,
                    width: wp(95),        // Button width is full screen width
                    height: hp(5),              // Increase height to 6% of screen height for better visibility
                    alignSelf: "center",        // Center button horizontally within the container
                    justifyContent: "center",   // Center the text vertically
                    alignItems: "center",       // Ensure the text is centered horizontally as well
                    borderRadius: wp(1),
                    position: "absolute",
                    bottom: wp(5),
                    borderRadius: wp(10)
                }]}
            >
                {
                    isLoading ?
                        <ActivityIndicator color='#FFF' />
                        :
                        <Text style={[styles.buttonText, Louis_George_Cafe.bold.h6, , { color: "#FFF", fontWeight: "600", }]}>{"Create Sub Group"}</Text>
                }
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
};

export default AddSubgroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        padding: wp(1),
    },
    header: {
        width: wp(95),
        marginHorizontal: wp(1),
        // backgroundColor: '#343434',
        paddingVertical: wp(2),
        borderRadius: wp(2),
        marginVertical: wp(2),
    },
    headContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: hp(2),
    },
    toggleSwitchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignSelf: "flex-end",
        marginVertical: wp(3),
        width: wp(80)
    },

    textContainer: {
        flex: 1,
        // marginHorizontal: wp(2),
    },
    headingName: {
        fontSize: 18, // Default style, modify as per your font styles
    },
    searchContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        width: wp(95),
        height: hp(5),
        borderRadius: wp(50),
        paddingHorizontal: wp(2),
        marginVertical: wp(1),
        marginBottom: wp(4),
        padding: wp(2),
    },
    textInput: {
        flex: 1,
    },
    iconContainer: {
        marginRight: wp(1),
    },
});




// AddSubgroup