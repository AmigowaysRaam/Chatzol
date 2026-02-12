import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Animated, PanResponder } from "react-native";
import { wp, hp } from "../../resources/dimensions"; // Assuming you're using these helpers for width and height
import { COLORS } from "../../resources/Colors"; // Your color resource
import { Louis_George_Cafe } from "../../resources/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getStoryToggle, getUpdateStoryList } from "../../redux/authActions";
import LottieView from "lottie-react-native";

const StoryPreviewScreen = ({ route, navigation }) => {

  const userId = useSelector((state) => state.auth.user?._id);
  const { statusArray, initialIndex } = route.params; // Receive the array of stories and initial index
  const [currentIndex, setCurrentIndex] = useState(initialIndex); // Tracks the current story index
  const [imageIndex, setImageIndex] = useState(0); // Tracks the index of the current image
  const [progress, setProgress] = useState(new Animated.Value(0)); // To animate progress
  const [isPaused, setIsPaused] = useState(false); // State to track if the progress is paused
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade effect when changing images
  const [rotateAnim] = useState(new Animated.Value(0)); // For 3D rotation animation
  const profile = useSelector((state) => state.auth.profile);
  const dispatch = useDispatch();
  const [imageLikeAnimation, setImageLikeAnimation] = useState();

  // Initialize liked state based on story data
  const [likedImages, setLikedImages] = useState({}); // To store liked status of images
  const currentStory = statusArray[currentIndex];

  useEffect(() => {
    const timerDuration = 3000; // 3 seconds for each image
    progress.setValue(0); // Reset the progress bar
    let animation;
    let interval;

    if (!isPaused) {
      // Start the progress animation
      animation = Animated.timing(progress, {
        toValue: 1,
        duration: timerDuration,
        useNativeDriver: false,
      });

      interval = setInterval(() => {
        if (!isPaused) {
          goToNextImage(); // Move to the next image if not paused
        }
      }, timerDuration);

      animation.start();
    } else {
      // Pause animation (no need to update progress)
      clearInterval(interval); // Clear the interval when paused
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      clearInterval(interval);
      progress.setValue(0); // Reset progress when the component is unmounted
      animation?.stop(); // Stop any ongoing animation
    };
  }, [imageIndex, isPaused]); // Add isPaused as a dependency


  useEffect(() => {
    // Initialize likedImages state based on the dummyStatusArray
    const initialLikedState = {};
    statusArray.forEach((story) => {
      story.statusImages.forEach((image, index) => {
        initialLikedState[`${story.id}_${index}`] = image.liked;
      });
    });
    setLikedImages(initialLikedState);
  }, []);

  // Toggle like status for the current image
  const toggleLike = (index, sId) => {
    const imageKey = `${currentStory.id}_${index}`;

    // If the image is liked, trigger the animation state
    if (!likedImages[imageKey]) {
      setImageLikeAnimation((prev) => ({
        ...prev,
        [imageKey]: true, // Set animation state to true for the liked image
      }));

      // After 1 second, reset the animation state to false
      setTimeout(() => {
        setImageLikeAnimation((prev) => ({
          ...prev,
          [imageKey]: false, // Reset animation state after 1 second
        }));
      }, 500);
    }


    setLikedImages((prev) => {
      const updatedLikes = { ...prev };
      updatedLikes[imageKey] = !updatedLikes[imageKey]; // Toggle the liked status for the specific image
      return updatedLikes;
    });

    handlerFunctionLike(sId);
  };


  const handlerFunctionLike = (sId) => {

    dispatch(
      getStoryToggle(userId, sId, (response) => {
        console.log(response.message, 'response');
        // setUserStoryArr(response?.data)
      })
    );
  }

  // Handle pause when the user presses on the image
  const handlePressIn = () => {
    setIsPaused(true); // Pause the progress animation
  };

  // Handle resume when the user releases the press
  const handlePressOut = () => {
    setIsPaused(false); // Resume the progress animation
  };

  // Navigate to the previous story
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Go to previous story
      setImageIndex(0); // Reset image to the first one when switching stories
      progress.setValue(0); // Reset progress bar
    } else {
      navigation.goBack();
    }
  };

  // Navigate to the next story
  const goToNext = () => {
    if (currentIndex < statusArray.length - 1) {
      setCurrentIndex(currentIndex + 1); // Go to next story
      setImageIndex(0); // Reset image to the first one when switching stories
      progress.setValue(0); // Reset progress bar
    } else {
      navigation.goBack();
    }
  };

  // Go to the previous image in the current story
  const goToPreviousImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1); // Go to previous image
    } else {
      goToPrevious();
    }
  };


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
        navigation.goBack(); // Or any other action like closing the modal
      }
    },
  });

  // Go to the next image in the current story
  const goToNextImage = () => {
    if (imageIndex < currentStory.statusImages.length - 1) {
      setImageIndex(imageIndex + 1); // Go to next image
    } else {
      goToNext();
    }
  };

  const handleChat = (toId) => {
    console.log(toId)

  }

  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers} >
      <LinearGradient
        colors={["#F0F0F0", "#FFF"]}
        style={{ marginTop: wp(1), padding: wp(1), paddingTop: wp(2), paddingHorizontal: wp(1) }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={profile?.profilepicture ? { uri: currentStory?.statusImages[0].url } : ""}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.textContainer} onPress={() => handleChat(currentStory.username)}>
              <Text numberOfLines={1} style={[{ marginHorizontal: wp(5) }, Louis_George_Cafe.bold.h6]}>
                {currentStory?.name}
              </Text>
              <Text numberOfLines={1} style={[{ marginHorizontal: wp(5) }, Louis_George_Cafe.regular.h9]}>
                {currentStory?.time}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: wp(3) }}>
            <MaterialIcons name="close" size={30} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={{ width: wp(100), flexDirection: 'row', marginVertical: wp(2) }}>
          {currentStory.statusImages.map((image, index) => (
            <View key={index} style={{ marginBottom: wp(3) }}>
              <View
                style={{
                  backgroundColor: index <= imageIndex ? '#999' : '#ccc',
                  width: wp(imageIndex + 1 / currentStory.statusImages.length * 100 - 7),
                  height: wp(1),
                  borderRadius: wp(5),
                  marginHorizontal: wp(2)
                }}
              />
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={[styles.progressContainer, { width: "100%" }]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [`0%`, '100%'],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.storyContainer}>
        <TouchableOpacity
          style={{ zIndex: 99 }}
          onPress={() => toggleLike(imageIndex)} // Toggle like status on press
        >
          <Animated.Image
            resizeMode="cover"
            source={{ uri: currentStory?.statusImages[imageIndex]?.url }}
            style={[styles.storyImage]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.likeIconContainer} onPress={() => toggleLike(imageIndex, currentStory?.statusImages[imageIndex]?._id)}>
          <MaterialIcons
            name={likedImages[`${currentStory.id}_${imageIndex}`] ? 'favorite' : "favorite-outline"}
            size={34}
            color={COLORS.validation}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        // delayLongPress={100}
        onLongPress={() => handlePressIn()}
        onPressOut={() => handlePressOut()}
        style={[styles.navigationButton, { left: 0, width: '50%', height: "80%", alignSelf: 'center' }]}
        onPress={goToPreviousImage}
      >
        {/* Optional icon could go here */}
      </TouchableOpacity>
      <TouchableOpacity
        // delayLongPress={100}
        onLongPress={() => handlePressIn()}
        onPressOut={() => handlePressOut()}
        style={[styles.navigationButton, { right: 0, width: '50%', height: "80%" }]}
        onPress={goToNextImage}
      >
        {/* Optional icon could go here */}
      </TouchableOpacity>
      {
        imageLikeAnimation && likedImages[`${currentStory.id}_${imageIndex}`] &&
        <LottieView
          source={require("../../assets/animations/likeHeart.json")}
          style={{ position: "relative", top: wp(2), width: wp(100), height: hp(12), left: wp(37.5) }}
          autoPlay
          speed={2}
          loop={false}
        />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileImage: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(6),
    borderWidth: 2,
    borderColor: COLORS.white,
    marginHorizontal: wp(1),
  },
  navigationButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: "10%",
    zIndex: 999,
  },
  storyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  storyImage: {
    width: wp(100),
    height: hp(70),
  },
  progressContainer: {
    position: "absolute",
    top: hp(0),
    left: 0,
    height: 4,
    backgroundColor: "white",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.button_bg_color,
  },
  likeIconContainer: {
    backgroundColor: "#DDD",
    padding: wp(2),
    borderRadius: wp(10),
    // position: "relative",
    top: hp(10),
    zIndex: 99,
    left: hp(18)

  },
});

export default StoryPreviewScreen;
