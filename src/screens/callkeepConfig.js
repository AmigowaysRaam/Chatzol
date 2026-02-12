// callkeepConfig.js
import RNCallKeep from 'react-native-callkeep';

export const setupCallKeep = () => {
  const options = {
    ios: {
      appName: 'ChatZol',
    },
    android: {
      alertTitle: 'Permissions Required',
      alertDescription: 'This app needs access to your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'OK',
      foregroundService: {
        channelId: 'com.yourapp.calls',
        channelName: 'Incoming Calls',
        notificationTitle: 'Calling...',
        notificationIcon: 'ic_launcher',
      },
    },
  };

  RNCallKeep.setup(options).then(accepted => {
    if (!accepted) {
      console.warn('CallKeep setup failed');
    }
  });
};
