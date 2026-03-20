import React, { useEffect, useState, useRef } from 'react';
import {  Text,  StatusBar,Platform,  Linking,  BackHandler,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  PanResponder,Modal
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InitialRouter from './src/navigations/initial-router';
import { WallpaperProvider } from './src/context/WallpaperContext';
import { COLORS } from './src/resources/Colors';
import NetInfo from '@react-native-community/netinfo';
import { hp, wp } from './src/resources/dimensions';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigations/NavigationRef';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp();
}

// Notification handler for Expo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Louis_George_Cafe: require('./assets/fonts/Louis_George_Cafe.ttf'),
    Louis_George_Cafe_Bold: require('./assets/fonts/Louis_George_Cafe_Bold.ttf'),
    Louis_George_Cafe_Regular: require('./assets/fonts/Louis_George_Cafe_Regular.ttf'),
    Louis_George_Cafe_Light: require('./assets/fonts/Louis_George_Cafe_Light.ttf'),
  });

     // -------------------- Version Check --------------------

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  useEffect(() => {
    const compareVersions = (v1, v2) => {
      const a = v1.split('.').map(Number);
      const b = v2.split('.').map(Number);
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const diff = (a[i] || 0) - (b[i] || 0);
        if (diff !== 0) return diff;
      }
      return 0;
    };

    const checkVersion = async () => {
      const appVersion = DeviceInfo.getVersion();
      setCurrentVersion(appVersion);
      try {
        const storeVersion = await VersionCheck.getLatestVersion({ forceUpdate: false });
        setLatestVersion(storeVersion);
        console.log("app version",appVersion)
        if (compareVersions(appVersion, storeVersion) < 0) setShowUpdateModal(true);
      } catch (err) {
        console.warn('Version check error:', err);
      }
    };

    checkVersion();
  }, []);

  const updateApp = async () => {
    const url = await VersionCheck.getStoreUrl({ appID:'com.chatZol' });
    Linking.openURL(url);
  };

  const [network, setNetwork] = useState(true);

  // In-app notification state
  const [inAppNotification, setInAppNotification] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  // PanResponder for swipe-to-dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) pan.setValue({ x: 0, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -50) hideNotification();
        else Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  // Show in-app notification
  const showNotification = (title, body) => {
    setInAppNotification({
      title,
      body,
      icon: require('./assets/ic_launcher.jpg'),
    });

    Animated.timing(slideAnim, {
      toValue: 40,
      duration: 350,
      useNativeDriver: false,
    }).start();

    setTimeout(() => hideNotification(), 4000);
  };

  // Hide notification
  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setInAppNotification(null));
  };

  // Network listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetwork(state.isConnected && state.isInternetReachable);
    });
    return unsubscribe;
  }, []);

  // FCM permission and token
  useEffect(() => {
    const setupFCM = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) console.log('✅ Notification permission granted');
      else console.log('❌ Notification permission denied');

      const fcmToken = await messaging().getToken();
      console.log('🔥 FCM TOKEN:', fcmToken);
      if (fcmToken) await AsyncStorage.setItem('fcm_token', fcmToken);
    };

    setupFCM();
  }, []);

  // Notification listeners
  useEffect(() => {
    // Foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      showNotification(
        remoteMessage.notification?.title || 'New Message',
        remoteMessage.notification?.body || 'You have a new message'
      );
    });

    // Background open
    const unsubscribeOnOpen = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📲 Opened from background:', JSON.stringify(remoteMessage, null, 2));
    });

    // Quit state open
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage)
        console.log('🚀 Opened from quit state:', JSON.stringify(remoteMessage, null, 2));
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpen();
    };
  }, []);

  // Android notification channel
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Chat Messages',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

  // Auto-trigger simulated FCM notification on app start
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     showNotification('Welcome!', 'This is a test notification to check your UI');
  //   }, 2000); // 2 seconds after app launch
  //   return () => clearTimeout(timer);
  // }, []);

  if (!fontsLoaded) return <Text>Loading Fonts...</Text>;

  return (
    <Provider store={store}>
      <WallpaperProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" translucent={false} backgroundColor="#F0F0F0" />
          <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
            <NavigationContainer ref={navigationRef}>
                <InitialRouter />
            </NavigationContainer>
           

            {/* In-app notification */}
            {inAppNotification && (
              <Animated.View
                {...panResponder.panHandlers}
                style={[styles.customNotification, { top: slideAnim, transform: pan.getTranslateTransform() }]}
              >
                <Image source={inAppNotification.icon} style={styles.notificationIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notificationTitle}>{inAppNotification.title}</Text>
                  <Text style={styles.notificationBody}>{inAppNotification.body}</Text>
                </View>
              </Animated.View>
            )}

            {/* Network overlay */}
            {!network && (
              <View style={styles.networkContainer}>
                <MaterialIcons name="wifi-off" size={wp(40)} color="#ff0000" />
                <Text style={styles.networkTitle}>No Internet Connection</Text>
                <Text style={styles.networkSubtitle}>Please enable WiFi or Mobile Data</Text>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => {
                    if (Platform.OS === 'android') {
                      Linking.sendIntent('android.settings.DATA_ROAMING_SETTINGS');
                    } else {
                      Linking.openURL('App-Prefs:root=MOBILE_DATA_SETTINGS');
                    }
                  }}
                >
                  <Text style={styles.settingsText}>Open Settings</Text>
                </TouchableOpacity>
                {Platform.OS === 'android' && (
                  <TouchableOpacity onPress={() => BackHandler.exitApp()}>
                    <Text style={styles.closeText}>Close App</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
        <Modal visible={showUpdateModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <MaterialCommunityIcons name="system-update" size={hp('8%')} color="#000" />
              <Text style={styles.modalTitle}>Update Available</Text>
              <Text style={styles.modalSubtitle}>
                {`A new version (${latestVersion}) is available. You are currently using version (${currentVersion}). Please update to continue.`}
              </Text>
              <TouchableOpacity style={styles.updateBtn} onPress={updateApp}>
                <Text style={styles.updateText}>Update Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
          </SafeAreaView>
        </SafeAreaProvider>
      </WallpaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  networkContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    zIndex: 9999,
  },
  networkTitle: {
    fontSize: wp(6),
    color: '#fff',
    fontWeight: 'bold',
    marginTop: hp(3),
    marginBottom: hp(1.5),
  },
  networkSubtitle: {
    fontSize: wp(4),
    color: '#ccc',
    textAlign: 'center',
    marginBottom: hp(4),
    paddingHorizontal: wp(5),
  },
  settingsButton: {
    backgroundColor: COLORS.button_bg_color,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(10),
    borderRadius: wp(3),
    marginBottom: hp(2.5),
  },
  settingsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(4),
  },
  closeText: {
    color: '#ff4d4d',
    fontSize: wp(3.8),
    marginTop: hp(1),
  },
  customNotification: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#661480',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    zIndex: 10000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  notificationTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationBody: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
  closeBtn: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: wp('5%') },
  modalContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 15, paddingVertical: hp('4%'), paddingHorizontal: wp('5%'), alignItems: 'center' },
  modalTitle: { fontSize: hp('3%'), fontWeight: 'bold', marginTop: hp('2%'), textAlign: 'center' },
  modalSubtitle: { fontSize: hp('2%'), color: '#555', textAlign: 'center', marginVertical: hp('2%') },
  updateBtn: { backgroundColor: '#000', paddingVertical: hp('1.5%'), paddingHorizontal: wp('10%'), borderRadius: 8, marginTop: hp('2%') },
  updateText: { color: '#fff', fontWeight: 'bold', fontSize: hp('2%') },
});