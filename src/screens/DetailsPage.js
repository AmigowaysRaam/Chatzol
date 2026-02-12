// DetailsPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DetailsPage;
