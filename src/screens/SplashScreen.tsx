// src/screens/SplashScreen.tsx - ENHANCED VERSION
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, StatusBar, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import {Text, useTheme} from 'react-native-paper';
import {useAuth} from '../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

export const SplashScreen = () => {
  const {completeSplash} = useAuth();
  const theme = useTheme();

  // ✨ ANIMATION REFS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ✨ ENTRANCE ANIMATIONS
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // ✨ SPINNER ROTATION
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => completeSplash(), 2400);
    return () => clearTimeout(timer);
  }, [completeSplash]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#1E40AF', '#2563EB', '#8B5CF6']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* ✨ ANIMATED CARD with GLASSMORPHISM */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <View style={styles.glassCard}>
          <LottieView
            source={require('../../assets/lottie/ksit_splash.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        
        {/* ✨ GLOW EFFECT */}
        <View style={styles.glowRing} />
      </Animated.View>

      {/* ✨ ANIMATED TITLE */}
      <Animated.View style={{opacity: fadeAnim}}>
        <Text variant="headlineLarge" style={styles.title}>
          KSIT AR Explorer
        </Text>
      </Animated.View>

      {/* ✨ ANIMATED SUBTITLE */}
      <Animated.View style={{opacity: fadeAnim}}>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Explore Campus in Augmented Reality
        </Text>
      </Animated.View>

      {/* ✨ ANIMATED ROTATING SPINNER */}
      <Animated.View style={[styles.loader, {opacity: fadeAnim}]}>
        <Animated.View 
          style={[
            styles.spinner,
            {transform: [{rotate: spin}]}
          ]} 
        />
        <Text variant="bodySmall" style={styles.loadingText}>
          Initializing AR Engine...
        </Text>
      </Animated.View>

      {/* ✨ FLOATING PARTICLES */}
      <View style={styles.particlesContainer}>
        <View style={[styles.particle, styles.particle1]} />
        <View style={[styles.particle, styles.particle2]} />
        <View style={[styles.particle, styles.particle3]} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  card: {
    width: 260,
    height: 260,
    marginBottom: 32,
    position: 'relative',
  },

  glassCard: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
    // Backdrop blur effect (iOS)
    overflow: 'hidden',
  },

  lottie: {
    width: 220,
    height: 220,
  },

  glowRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    top: -10,
    left: -10,
  },

  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },

  subtitle: {
    color: '#E8F1FF',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.95,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },

  loader: {
    marginTop: 48,
    alignItems: 'center',
  },

  spinner: {
    width: 48,
    height: 48,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 12,
  },

  loadingText: {
    color: '#E8F1FF',
    opacity: 0.85,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },

  // ✨ FLOATING PARTICLES
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  particle1: {
    top: '20%',
    left: '15%',
  },

  particle2: {
    top: '70%',
    right: '20%',
  },

  particle3: {
    bottom: '25%',
    left: '25%',
  },
});

export default SplashScreen;





/*import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import LottieView from 'lottie-react-native';
import {Text, useTheme} from 'react-native-paper';
import {useAuth} from '../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

export const SplashScreen = () => {
  const {completeSplash} = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => completeSplash(), 2400);
    return () => clearTimeout(timer);
  }, [completeSplash]);

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary || '#8B5CF6']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
   
      <View
        style={[
          styles.card,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            shadowColor: '#000000',
          },
        ]}>
        <LottieView
          source={require('../../assets/lottie/ksit_splash.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

     
      <Text variant="headlineLarge" style={styles.title}>
        KSIT AR Explorer
      </Text>

   
      <Text variant="bodyLarge" style={styles.subtitle}>
        Explore Campus in Augmented Reality
      </Text>

      <View style={styles.loader}>
        <View style={styles.spinner} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: 240,
    height: 240,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowOffset: {width: 0, height: 14},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: 'blur(10px)',
  },
  lottie: {
    width: 210,
    height: 210,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#E8F1FF',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
  },
  loader: {
    marginTop: 32,
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: 20,
    // Note: You'll need to add rotation animation using Animated API
  },
});

export default SplashScreen;
*/