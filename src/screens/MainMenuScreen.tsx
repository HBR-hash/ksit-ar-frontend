import React, { useCallback, useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  NativeModules,
  AppState,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, HelperText, Text, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
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

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
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

        {/* Header with Theme Toggle */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="headlineMedium" style={[styles.greeting, { color: theme.colors.onBackground }]}>
              Hi, {user.name} 👋
            </Text>
            <Text variant="bodyMedium" style={[styles.sub, { color: theme.colors.onSurfaceVariant }]}>
              Ready to explore the KSIT campus in augmented reality?
            </Text>
          </View>
          
          {/* Theme Toggle Button */}
          <TouchableOpacity 
            style={[styles.themeToggle, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outlineVariant,
            }]}
            onPress={toggleTheme}
            activeOpacity={0.7}>
            <Icon name={isDark ? 'sun' : 'moon'} size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <Card style={[styles.card, { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={[styles.profileIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Icon name="user" size={24} color={theme.colors.primary} />
              </View>
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
              <Icon name="mail" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[styles.infoText, { color: theme.colors.onSurface }]}>
                {user.email}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="phone" size={16} color={theme.colors.onSurfaceVariant} />
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

        {/* AR Section - Android Only */}
        {Platform.OS === "android" && (
          <Card style={[styles.card, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          }]}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={[styles.profileIcon, { backgroundColor: '#8B5CF620' }]}>
                  <Icon name="box" size={24} color="#8B5CF6" />
                </View>
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

              {!available && (
                <View style={[styles.statusBadge, { backgroundColor: '#F59E0B20' }]}>
                  <Icon name="alert-circle" size={16} color="#F59E0B" />
                  <Text variant="bodySmall" style={[styles.statusText, { color: '#F59E0B' }]}>
                    AR App not installed
                  </Text>
                </View>
              )}
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
			<KSITButton
				mode="outlined"
				onPress={handleInstall}
				style={[styles.actionBtn, { borderColor: '#8B5CF6' }]}
				labelStyle={{ color: '#8B5CF6', fontWeight: '600' }}
				icon={() => <Icon name="download" size={16} color="#8B5CF6" />}
				compact>
				Install
			</KSITButton>

			<KSITButton
				mode="contained"
				onPress={handleLaunch}
				disabled={!available}
				loading={loading}
				style={[styles.launchBtn, { 
				backgroundColor: available ? '#8B5CF6' : '#CBD5E1',
				}]}
				labelStyle={{ 
				color: '#FFFFFF',
				fontWeight: '600' 
				}}
				icon={() => <Icon name="zap" size={16} color="#FFFFFF" />}
				compact>
				Launch
			</KSITButton>
			</Card.Actions>
          </Card>
        )}

        {/* Logout Button */}
        <KSITButton
          mode="contained"
          onPress={logout}
          style={[styles.logout, { backgroundColor: theme.colors.error }]}
          labelStyle={styles.logoutLabel}
          icon={() => <Icon name="log-out" size={20} color="#FFFFFF" />}
          contentStyle={styles.logoutContent}>
          Logout
        </KSITButton>

        {error && (
          <HelperText type="error" visible={!!error} style={styles.errorText}>
            {error}
          </HelperText>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  greeting: {
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 8,
  },

  sub: {
    lineHeight: 22,
  },

  themeToggle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowColor: '#000',
    elevation: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  cardHeaderText: {
    flex: 1,
  },

  cardHeaderTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  infoText: {
    flex: 1,
  },

  cardActions: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  actionBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.5,
  },

  arDescription: {
    lineHeight: 22,
    marginBottom: 12,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },

  launchBtn: {
    flex: 1,
    borderRadius: 10,
  },

  logout: {
    height: 52,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop: 8,
  },

  logoutLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  logoutContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },

  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MainMenuScreen;