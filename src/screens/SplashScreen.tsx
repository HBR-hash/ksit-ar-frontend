import React, {useEffect} from 'react';
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
      
      {/* Card with Lottie Animation */}
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

      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        KSIT AR Explorer
      </Text>

      {/* Subtitle */}
      <Text variant="bodyLarge" style={styles.subtitle}>
        Explore Campus in Augmented Reality
      </Text>

      {/* Loading Spinner */}
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