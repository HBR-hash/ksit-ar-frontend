import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import LottieView from 'lottie-react-native';
import {Text, useTheme} from 'react-native-paper';
import {useAuth} from '../context/AuthContext';

export const SplashScreen = () => {
  const {completeSplash} = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => completeSplash(), 2400);
    return () => clearTimeout(timer);
  }, [completeSplash]);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.primary}]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            shadowColor:
              (theme.colors as any).shadowSoft ?? theme.colors.primary,
          },
        ]}>
        <LottieView
          source={require('../../assets/lottie/ksit_splash.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <Text variant="headlineMedium" style={styles.title}>
        KSIT AR Campus Explorer
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Immerse yourself in the future of campus navigation.
      </Text>
    </View>
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
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 14},
    marginBottom: 24,
  },
  lottie: {
    width: 210,
    height: 210,
  },
  title: {
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#E8F1FF',
    marginTop: 8,
    textAlign: 'center',
  },
});
export default SplashScreen;
