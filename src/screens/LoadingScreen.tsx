// src/screens/LoadingScreen.tsx - ENHANCED VERSION
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

export const LoadingScreen = () => {
  const theme = useTheme();

  // ✨ ANIMATION REFS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // ✨ ENTRANCE ANIMATION
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // ✨ PULSE ANIMATION
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={['#1E40AF', '#2563EB', '#8B5CF6']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      
      {/* ✨ FLOATING PARTICLES */}
      <View style={styles.particlesContainer}>
        <View style={[styles.particle, styles.particle1]} />
        <View style={[styles.particle, styles.particle2]} />
        <View style={[styles.particle, styles.particle3]} />
        <View style={[styles.particle, styles.particle4]} />
      </View>

      {/* ✨ ANIMATED ICON CIRCLE with GLASSMORPHISM */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}>
        <Animated.View
          style={[
            styles.iconCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}>
          <View style={styles.glassCircle}>
            <Icon name="box" size={44} color="#FFFFFF" />
          </View>
          {/* ✨ GLOW RING */}
          <View style={styles.glowRing} />
        </Animated.View>
      </Animated.View>

      {/* ✨ ANIMATED SPINNER */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          marginVertical: 24,
        }}>
        <ActivityIndicator size={50} color="#FFFFFF" />
      </Animated.View>

      {/* ✨ ANIMATED TEXT */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          alignItems: 'center',
        }}>
        <Text variant="headlineSmall" style={styles.text}>
          Preparing your campus experience...
        </Text>

        <Text variant="bodyLarge" style={styles.subtitle}>
          Please wait a moment
        </Text>

        {/* ✨ LOADING DOTS */}
        <View style={styles.dotsContainer}>
          <Animated.View 
            style={[
              styles.dot,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 0.7],
                }),
              },
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.4],
                }),
              },
            ]} 
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },

  particle1: {
    top: '15%',
    left: '10%',
    width: 6,
    height: 6,
  },

  particle2: {
    top: '25%',
    right: '15%',
    width: 10,
    height: 10,
  },

  particle3: {
    bottom: '30%',
    left: '20%',
    width: 7,
    height: 7,
  },

  particle4: {
    bottom: '20%',
    right: '25%',
    width: 9,
    height: 9,
  },

  iconCircle: {
    position: 'relative',
    marginBottom: 8,
  },

  glassCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },

  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    top: -10,
    left: -10,
  },

  text: {
    marginTop: 8,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: '#E8F1FF',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});

export default LoadingScreen;