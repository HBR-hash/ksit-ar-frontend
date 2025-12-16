// src/screens/MainMenuScreen.tsx - ENHANCED VERSION WITH PROFILE IMAGE
import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  NativeModules,
  AppState,
  TouchableOpacity,
  Animated,
  Image,  // ✅ ADDED
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, HelperText, Text, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { AppStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useARAvailability } from "../hooks/useARAvailability";
import { ENV } from "../config/env";
import { launchARExperience } from "../modules/KSITARLauncher";
import { ScreenContainer } from "../components/ScreenContainer";
import { KSITButton } from "../components/KSITButton";
import { useThemeContext } from "../context/ThemeContext";

type Props = NativeStackScreenProps<AppStackParamList, "MainMenu">;

export const MainMenuScreen = ({ navigation }: Props) => {
  const { user, logout, refreshProfile } = useAuth();
  const { available, refresh } = useARAvailability();
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeContext();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const Installer = NativeModules.KSITInstaller;

  // ✨ ANIMATION REFS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // ✨ ENTRANCE ANIMATION
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
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

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshProfile(); // ✅ REFRESH USER PROFILE DATA
    }, [refresh, refreshProfile])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  if (!user) return null;

  const handleInstall = () => {
    Alert.alert(
      "Install AR App",
      "This will install the KSIT AR 3D Campus Experience.\nDo you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Install",
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              await Installer.installARApp();

              setTimeout(() => {
                refresh();
                setTimeout(() => refresh(), 3000);
              }, 1000);
            } catch (e) {
              setError("Unable to install the AR app.");
              Alert.alert("Installation Failed", "Unable to install.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLaunch = async () => {
    setError(null);
    setLoading(true);
    try {
      await launchARExperience(ENV.UE_PACKAGE_NAME, ENV.UE_ACTIVITY_NAME);
    } catch (err) {
      setError("Unable to launch AR experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* ✨ ANIMATED HEADER */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          <View style={{ flex: 1 }}>
            <Text variant="headlineLarge" style={[styles.greeting, { color: theme.colors.onBackground }]}>
              Hi, {user.name} 👋
            </Text>
            <Text variant="bodyLarge" style={[styles.sub, { color: theme.colors.onSurfaceVariant }]}>
              Ready to explore the KSIT campus in augmented reality?
            </Text>
          </View>
          
          {/* ✨ THEME TOGGLE with GRADIENT */}
          <TouchableOpacity 
            style={styles.themeToggleContainer}
            onPress={toggleTheme}
            activeOpacity={0.7}>
            <LinearGradient
              colors={isDark ? ['#1E293B', '#334155'] : ['#FFFFFF', '#F8FAFC']}
              style={[styles.themeToggle, { 
                borderColor: theme.colors.outlineVariant,
              }]}>
              <Icon name={isDark ? 'sun' : 'moon'} size={24} color={theme.colors.primary} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* ✨ ANIMATED PROFILE CARD with GRADIENT BORDER */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={['#2563EB', '#3B82F6', '#2563EB']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.gradientBorder}>
              <Card style={[styles.card, { 
                backgroundColor: theme.colors.surface,
              }]}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    {/* ✅ PROFILE IMAGE OR ICON */}
                    {user.profileImage ? (
                      <View style={styles.profileImageContainer}>
                        <Image 
                          source={{ uri: user.profileImage }} 
                          style={styles.profileImage}
                          onError={(error) => {
                            console.log('Profile image load error:', error);
                          }}
                        />
                      </View>
                    ) : (
                      <LinearGradient
                        colors={['#2563EB', '#1E40AF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.profileIcon}>
                        <Icon name="user" size={26} color="#FFFFFF" />
                      </LinearGradient>
                    )}
                    <View style={styles.cardHeaderText}>
                      <Text variant="titleLarge" style={[styles.cardHeaderTitle, { color: theme.colors.onSurface }]}>
                        Your Profile
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        Account Information
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon name="mail" size={18} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={[styles.infoText, { color: theme.colors.onSurface }]}>
                      {user.email}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon name="phone" size={18} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={[styles.infoText, { color: theme.colors.onSurface }]}>
                      {user.phone}
                    </Text>
                  </View>
                </Card.Content>

                <Card.Actions style={styles.cardActions}>
                  <KSITButton
                    mode="outlined"
                    onPress={() => navigation.navigate("EditProfile")}
                    style={[styles.actionBtn, { borderColor: theme.colors.primary }]}
                    labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
                    icon={() => <Icon name="edit-2" size={16} color={theme.colors.primary} />}
                    compact>
                    Edit
                  </KSITButton>

                  <KSITButton
                    mode="outlined"
                    onPress={refreshProfile}
                    style={[styles.actionBtn, { borderColor: theme.colors.primary }]}
                    labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
                    icon={() => <Icon name="refresh-cw" size={16} color={theme.colors.primary} />}
                    compact>
                    Refresh
                  </KSITButton>
                </Card.Actions>
              </Card>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* ✨ ANIMATED AR CARD with GRADIENT BORDER - Android Only */}
        {Platform.OS === "android" && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>
            <View style={styles.cardWrapper}>
              <LinearGradient
                colors={['#8B5CF6', '#A78BFA', '#8B5CF6']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.gradientBorder}>
                <Card style={[styles.card, { 
                  backgroundColor: theme.colors.surface,
                }]}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <LinearGradient
                        colors={['#8B5CF6', '#7C3AED']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.profileIcon}>
                        <Icon name="box" size={26} color="#FFFFFF" />
                      </LinearGradient>
                      <View style={styles.cardHeaderText}>
                        <Text variant="titleLarge" style={[styles.cardHeaderTitle, { color: theme.colors.onSurface }]}>
                          KSIT AR Experience
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          Unreal Engine Powered
                        </Text>
                      </View>
                    </View>

                    <Text variant="bodyMedium" style={[styles.arDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Launch the AR campus walkthrough to explore buildings in augmented reality
                    </Text>

                    {/* ✨ STATUS BADGE */}
                    {available ? (
                      <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                        <Icon name="check-circle" size={16} color="#10B981" />
                        <Text variant="bodySmall" style={[styles.statusText, { color: '#10B981' }]}>
                          AR App Ready
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.statusBadge, { backgroundColor: '#F59E0B20' }]}>
                        <Icon name="alert-circle" size={16} color="#F59E0B" />
                        <Text variant="bodySmall" style={[styles.statusText, { color: '#F59E0B' }]}>
                          AR App not installed
                        </Text>
                      </View>
                    )}
                  </Card.Content>

                  {/* ✨ AR BUTTONS */}
                  <Card.Actions style={styles.cardActions}>
                    {!available && (
                      <KSITButton
                        mode="outlined"
                        onPress={handleInstall}
                        loading={loading && !available}
                        style={[styles.actionBtn, { borderColor: '#8B5CF6' }]}
                        labelStyle={{ color: '#8B5CF6', fontWeight: '600' }}
                        icon={() => <Icon name="download" size={16} color="#8B5CF6" />}
                        compact>
                        Install
                      </KSITButton>
                    )}

                    <LinearGradient
                      colors={available ? ['#8B5CF6', '#7C3AED'] : ['#CBD5E1', '#94A3B8']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={[styles.launchGradient, available ? {} : {opacity: 0.6}]}>
                      <KSITButton
                        mode="contained"
                        onPress={handleLaunch}
                        disabled={!available}
                        loading={loading && available}
                        style={[
                          available ? styles.launchBtnFull : styles.launchBtn,
                          { backgroundColor: 'transparent' }
                        ]}
                        labelStyle={{ 
                          color: '#FFFFFF',
                          fontWeight: '700',
                          fontSize: 15,
                        }}
                        icon={() => <Icon name="zap" size={18} color="#FFFFFF" />}
                        compact>
                        Launch AR
                      </KSITButton>
                    </LinearGradient>
                  </Card.Actions>
                </Card>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* ✨ ANIMATED LOGOUT BUTTON with GRADIENT */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.logoutGradient}>
            <KSITButton
              mode="contained"
              onPress={logout}
              style={styles.logout}
              labelStyle={styles.logoutLabel}
              icon={() => <Icon name="log-out" size={20} color="#FFFFFF" />}
              contentStyle={styles.logoutContent}>
              Logout
            </KSITButton>
          </LinearGradient>
        </Animated.View>

        {error && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={[styles.errorContainer, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="alert-circle" size={18} color="#EF4444" />
              <Text variant="bodyMedium" style={styles.errorTextEnhanced}>
                {error}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },

  greeting: {
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  sub: {
    lineHeight: 24,
    letterSpacing: 0.2,
    fontSize: 16,
  },

  themeToggleContainer: {
    marginLeft: 12,
  },

  themeToggle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowColor: '#2563EB',
    elevation: 4,
  },

  cardWrapper: {
    marginBottom: 20,
  },

  gradientBorder: {
    borderRadius: 18,
    padding: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },

  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  cardContent: {
    padding: 20,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  profileIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // ✅ NEW PROFILE IMAGE STYLES
  profileImageContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  cardHeaderText: {
    flex: 1,
  },

  cardHeaderTitle: {
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 18,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 14,
    paddingVertical: 4,
  },

  infoText: {
    flex: 1,
    fontSize: 15,
  },

  cardActions: {
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  actionBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    height: 44,
  },

  arDescription: {
    lineHeight: 22,
    marginBottom: 16,
    fontSize: 15,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  statusText: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  launchGradient: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  launchBtn: {
    flex: 1,
    borderRadius: 12,
    height: 44,
  },

  launchBtnFull: {
    flex: 1,
    borderRadius: 12,
    height: 44,
  },

  logoutGradient: {
    borderRadius: 14,
    marginTop: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  logout: {
    height: 56,
    backgroundColor: 'transparent',
  },

  logoutLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },

  logoutContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 16,
  },

  errorTextEnhanced: {
    flex: 1,
    color: '#991B1B',
    fontWeight: '600',
  },
});

export default MainMenuScreen;