import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0057B8" />

      <Text style={styles.text}>
        Preparing your campus experience...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F0F6FF', // Soft light blue premium background
  },
  text: {
    marginTop: 18,
    fontSize: 15,
    color: '#003E80',
    fontWeight: '500',
  },
});

export default LoadingScreen;