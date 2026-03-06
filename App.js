import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  Platform,
  Linking,
  BackHandler,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
// import firebase from '@react-native-firebase/app';

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp();
// }

// Foreground notification behavior
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

  const [network, setNetwork] = useState(true);

  //  Network Listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetwork(state.isConnected && state.isInternetReachable);
    });
    return unsubscribe;
  }, []);

  // //   Request Notification Permission + Get FCM Token
  // useEffect(() => {
  //   const setupFCM = async () => {
  //     const authStatus = await messaging().requestPermission();

  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('✅ Notification permission granted');
  //     } else {
  //       console.log('❌ Notification permission denied');
  //     }

  //     const fcmToken = await messaging().getToken();
  //     console.log('🔥 FCM TOKEN:', fcmToken);

  //     if (fcmToken) {
  //       await AsyncStorage.setItem('fcm_token', fcmToken);
  //     }
  //   };

  //   setupFCM();
  // }, []);

  // 📩 Notification Listeners
  // useEffect(() => {
  //   // Foreground
  //   const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
  //     // console.log('📩 Foreground Message:', JSON.stringify(remoteMessage, null, 2));

  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title:
  //           remoteMessage.data?.title ||
  //           remoteMessage.notification?.title ||
  //           'New Message',
  //         body:
  //           remoteMessage.data?.body ||
  //           remoteMessage.notification?.body ||
  //           'You have a new message',
  //         data: remoteMessage.data,
  //         sound: true,
  //       },
  //       trigger: null,
  //     });
  //   });

  //   // Background open
  //   const unsubscribeOnOpen = messaging().onNotificationOpenedApp(
  //     async remoteMessage => {
  //       console.log(
  //         '📲 Opened from background:',
  //         JSON.stringify(remoteMessage, null, 2)
  //       );
  //     }
  //   );

  //   // Quit state open
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           '🚀 Opened from quit state:',
  //           JSON.stringify(remoteMessage, null, 2)
  //         );
  //       }
  //     });

  //   return () => {
  //     unsubscribeOnMessage();
  //     unsubscribeOnOpen();
  //   };
  // }, []);

  //  Android Channel
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

  if (!fontsLoaded) return <Text>Loading Fonts...</Text>;

  return (
    <Provider store={store}>
      <WallpaperProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar backgroundColor={COLORS.next_bg_color} />
            <InitialRouter />

            {!network && (
              <View style={styles.networkContainer}>
                <StatusBar backgroundColor="#000" barStyle="light-content" />
                <MaterialIcons name="wifi-off" size={wp(40)} color="#ff0000" />

                <Text style={styles.networkTitle}>
                  No Internet Connection
                </Text>

                <Text style={styles.networkSubtitle}>
                  Please enable WiFi or Mobile Data
                </Text>

                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => {
                    if (Platform.OS === 'android') {
                      Linking.sendIntent(
                        'android.settings.DATA_ROAMING_SETTINGS'
                      );
                    } else {
                      Linking.openURL(
                        'App-Prefs:root=MOBILE_DATA_SETTINGS'
                      );
                    }
                  }}
                >
                  <Text style={styles.settingsText}>Open Settings</Text>
                </TouchableOpacity>

                {Platform.OS === 'android' && (
                  <TouchableOpacity
                    onPress={() => BackHandler.exitApp()}
                  >
                    <Text style={styles.closeText}>Close App</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
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
});