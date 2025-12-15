import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

export const LoadingScreen = () => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primaryContainer || '#3B82F6']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      
      {/* Icon Circle */}
      <View style={styles.iconCircle}>
        <Icon name="box" size={40} color="#FFFFFF" />
      </View>

      {/* Spinner */}
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />

      {/* Loading Text */}
      <Text variant="bodyLarge" style={styles.text}>
        Preparing your campus experience...
      </Text>

      {/* Subtitle */}
      <Text variant="bodySmall" style={styles.subtitle}>
        Please wait a moment
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#E8F1FF',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default LoadingScreen;