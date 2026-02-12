import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { useFonts } from 'expo-font';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import InitialRouter from './src/navigations/initial-router';
import { WallpaperProvider } from './src/context/WallpaperContext';

if (!firebase.apps.length) {
  firebase.initializeApp();
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Louis_George_Cafe: require('./assets/fonts/Louis_George_Cafe.ttf'),
    Louis_George_Cafe_Bold: require('./assets/fonts/Louis_George_Cafe_Bold.ttf'),
    Louis_George_Cafe_Regular: require('./assets/fonts/Louis_George_Cafe_Regular.ttf'),
    Louis_George_Cafe_Light: require('./assets/fonts/Louis_George_Cafe_Light.ttf'),
  });

  const [token, setToken] = useState('');
  const [ws, setWs] = useState(null);
  const [wsMessage, setWsMessage] = useState('');



  useEffect(() => {
    const setupChannel = async () => {
      await notifee.createChannel({
        id: 'calls',
        name: 'Incoming Calls',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    };

    setupChannel();
  }, []);


  // CallFunction

  // Fetch FCM Token
  useEffect(() => {
    // alert(JSON.stringify())

    const fetchFCMToken = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Notification permission granted');
        } else {
          console.warn('Notification permission not granted');
        }

        const token = await messaging().getToken();
        console.log('FCM Token:', token);

        if (token) {
          setToken(token);
          await AsyncStorage.setItem('fcm_token', token);
        } else {
          console.warn('FCM token not received');
        }
      } catch (error) {
        console.error('Error fetching FCM token:', error);
        // Alert.alert('Error', 'There was an issue fetching the FCM token.');
      }
    };

    fetchFCMToken();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken(); // call token function here
    }
  }

  async function getFcmToken() {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {

        console.log('FCM Token:', fcmToken);
        // Store or send the token to your server here
      } else {
        console.log('Failed to get FCM token');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }


  // Handle Foreground and Background Notification Logic
  useEffect(() => {
    requestUserPermission();
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
      Toast.show({
        type: 'info',
        position: 'top',
        text1: remoteMessage.notification?.title || 'New Notification',
        text2: remoteMessage.notification?.body || 'You have a new message!',
        visibilityTime: 4000,
        autoHide: true,
      });
    });

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Background message:', remoteMessage);
    //   Toast.show({
    //     type: 'info',
    //     position: 'top',
    //     text1: remoteMessage.notification?.title || 'New Notification',
    //     text2: remoteMessage.notification?.body || 'You have a new message!',
    //     visibilityTime: 4000,
    //     autoHide: true,
    //   });
    // });


    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background:', remoteMessage);
      Toast.show({
        type: 'info',
        position: 'top',
        text1: remoteMessage.notification?.title || 'New Notification',
        text2: remoteMessage.notification?.body || 'You have a new message!',
        visibilityTime: 4000,
        autoHide: true,
      });
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from a cold start:', remoteMessage);
          Toast.show({
            type: 'info',
            position: 'top',
            text1: remoteMessage.notification?.title || 'New Notification',
            text2: remoteMessage.notification?.body || 'You have a new message!',
            visibilityTime: 4000,
            autoHide: true,
          });
        }
      });

    // return () => unsubscribeOnMessage();
    return () => {
      // messaging().setBackgroundMessageHandler(null);
      unsubscribeOnMessage()
    };

  }, []);

  // useEffect(() => {
  //   const unsubscribe = firestore()
  //     .collection('calls')
  //     .where('targetUserId', '==', "USER_1234")
  //     .onSnapshot(snapshot => {
  //       snapshot.forEach(doc => {
  //         const data = doc.data();
  //         if (data?.offer) {
  //           navigation.navigate('AnswerCallScreen', {
  //             callId: doc.id
  //           });
  //         }
  //       });
  //     });
  //   return () => unsubscribe();
  // }, []);

  return fontsLoaded ? (
    <Provider store={store}>
      <WallpaperProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
            <InitialRouter />
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </SafeAreaView>
        </SafeAreaProvider>
      </WallpaperProvider>
    </Provider>
  ) : (
    <Text>Loading Fonts...</Text>
  );
}
