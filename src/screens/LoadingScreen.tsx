import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

const BLUE = "#0B5ED7"; // Same dark blue used in Login

export const LoadingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <ActivityIndicator size="large" color={BLUE} />

      <Text style={styles.text}>
        Preparing your campus experience...
      </Text>

      {/* CREATE ACCOUNT BUTTON */}
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation?.navigate("Register")}
      >
        <Text style={styles.createLabel}>Create an account</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F0F6FF',
  },

  text: {
    marginTop: 18,
    fontSize: 15,
    color: '#003E80',
    fontWeight: '500',
  },

  // 🔵 Create Account Button (same style as login page)
  createBtn: {
    marginTop: 30,
    width: "80%",
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  createLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default LoadingScreen;


/*import React from 'react';
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

export default LoadingScreen;*/