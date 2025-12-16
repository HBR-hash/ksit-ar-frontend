// src/screens/ARInstallRequiredScreen.tsx - ENHANCED VERSION
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, NativeModules, Animated } from "react-native";
import LottieView from "lottie-react-native";
import { Text, Button, Card, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/AppNavigator";
import { KSITButton } from "../components/KSITButton";

const Installer = NativeModules.KSITInstaller;

type Props = NativeStackScreenProps<AppStackParamList, "ARInstallRequired">;

const ARInstallRequiredScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  // ✨ ANIMATION REFS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInstall = async () => {
    try {
      await Installer.installARApp();
    } catch (e) {
      console.log("Local install error:", e);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* ✨ FLOATING PARTICLES */}
      <View style={styles.particlesContainer}>
        <View style={[styles.particle, styles.particle1]} />
        <View style={[styles.particle, styles.particle2]} />
        <View style={[styles.particle, styles.particle3]} />
      </View>

      {/* ✨ ANIMATED CARD with GRADIENT BORDER */}
      <Animated.View
        style={{
          width: '100%',
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}>
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA', '#8B5CF6']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientBorder}>
            <Card 
              style={[styles.card, { 
                backgroundColor: theme.colors.surface,
              }]} 
              mode="elevated"
              elevation={8}>
              
              {/* ✨ ANIMATED LOTTIE */}
              <Animated.View 
                style={[
                  styles.animationWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}>
                <View style={styles.lottieContainer}>
                  <View style={styles.lottieGlow} />
                  <LottieView
                    source={require("../../assets/lottie/ar_scanner.json")}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                </View>
              </Animated.View>

              {/* ✨ ANIMATED ICON BADGE with GRADIENT */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}>
                <LinearGradient
                  colors={['#F59E0B', '#F97316']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.iconBadge}>
                  <Icon name="download-cloud" size={36} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>

              {/* ✨ ANIMATED TITLE */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}>
                <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
                  AR Viewer Required
                </Text>
              </Animated.View>

              {/* ✨ ANIMATED SUBTITLE */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}>
                <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                  To experience AR models, you need to install our companion AR application powered by Unreal Engine
                </Text>
              </Animated.View>

              {/* ✨ ANIMATED FEATURE LIST */}
              <Animated.View
                style={{
                  width: '100%',
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}>
                <View style={styles.featureList}>
                  <View style={styles.feature}>
                    <View style={[styles.featureIconBg, { backgroundColor: '#10B98120' }]}>
                      <Icon name="check" size={18} color="#10B981" />
                    </View>
                    <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                      High-quality 3D models
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <View style={[styles.featureIconBg, { backgroundColor: '#10B98120' }]}>
                      <Icon name="check" size={18} color="#10B981" />
                    </View>
                    <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                      Interactive AR experience
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <View style={[styles.featureIconBg, { backgroundColor: '#10B98120' }]}>
                      <Icon name="check" size={18} color="#10B981" />
                    </View>
                    <Text variant="bodyMedium" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
                      Real-time campus exploration
                    </Text>
                  </View>
                </View>
              </Animated.View>

              {/* ✨ ANIMATED GRADIENT DOWNLOAD BUTTON */}
              <Animated.View
                style={{
                  width: '100%',
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.gradientButton}>
                  <KSITButton
                    mode="contained"
                    onPress={handleInstall}
                    style={styles.downloadBtn}
                    labelStyle={styles.downloadBtnLabel}
                    icon={() => <Icon name="download" size={20} color="#FFFFFF" />}
                    contentStyle={styles.downloadBtnContent}>
                    Download AR Viewer
                  </KSITButton>
                </LinearGradient>
              </Animated.View>

              {/* ✨ ANIMATED BACK BUTTON */}
              <Animated.View
                style={{
                  width: '100%',
                  opacity: fadeAnim,
                }}>
                <KSITButton
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  style={[styles.retryBtn, { 
                    borderColor: theme.colors.outline,
                    backgroundColor: 'transparent',
                  }]}
                  labelStyle={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}
                  icon={() => <Icon name="arrow-left" size={20} color={theme.colors.onSurfaceVariant} />}
                  contentStyle={styles.retryBtnContent}>
                  Back to Menu
                </KSITButton>
              </Animated.View>

              {/* ✨ ANIMATED NOTE */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                }}>
                <View style={[styles.noteContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Icon name="info" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
                    The AR Viewer requires about 150MB of storage
                  </Text>
                </View>
              </Animated.View>

            </Card>
          </LinearGradient>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
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
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },

  particle1: {
    top: '15%',
    left: '10%',
    width: 6,
    height: 6,
  },

  particle2: {
    top: '70%',
    right: '15%',
    width: 10,
    height: 10,
  },

  particle3: {
    bottom: '20%',
    left: '20%',
    width: 7,
    height: 7,
  },

  cardWrapper: {
    width: '100%',
  },

  gradientBorder: {
    borderRadius: 24,
    padding: 2,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  card: {
    width: "100%",
    borderRadius: 22,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
  },

  animationWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  lottieContainer: {
    position: 'relative',
  },

  lottieGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#8B5CF6',
    opacity: 0.1,
    top: -10,
    left: -10,
  },

  lottie: {
    width: 180,
    height: 180,
  },

  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  title: {
    textAlign: "center",
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 26,
    paddingHorizontal: 8,
    fontSize: 16,
    letterSpacing: 0.2,
  },

  featureList: {
    width: '100%',
    marginBottom: 32,
    gap: 16,
  },

  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureText: {
    flex: 1,
    lineHeight: 22,
    fontSize: 15,
  },

  gradientButton: {
    width: '100%',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  downloadBtn: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
  },

  downloadBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },

  downloadBtnContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },

  retryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 20,
  },

  retryBtnContent: {
    height: 56,
    flexDirection: 'row',
  },

  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  note: {
    flex: 1,
    lineHeight: 20,
    fontSize: 13,
  },
});

export default ARInstallRequiredScreen;