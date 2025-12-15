import React from "react";
import { StyleSheet, View, NativeModules } from "react-native";
import LottieView from "lottie-react-native";
import { Text, Button, Card, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/AppNavigator";
import { KSITButton } from "../components/KSITButton";

const Installer = NativeModules.KSITInstaller;

type Props = NativeStackScreenProps<AppStackParamList, "ARInstallRequired">;

const ARInstallRequiredScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const handleInstall = async () => {
    try {
      await Installer.installARApp(); // Local APK installer
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
      <Card 
        style={[styles.card, { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        }]} 
        mode="elevated"
        elevation={6}>
        
        {/* Lottie Animation */}
        <View style={styles.animationWrapper}>
          <LottieView
            source={require("../../assets/lottie/ar_scanner.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        {/* Icon Badge */}
        <View style={[styles.iconBadge, { backgroundColor: '#F59E0B20' }]}>
          <Icon name="download-cloud" size={32} color="#F59E0B" />
        </View>

        {/* Title */}
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          AR Viewer Required
        </Text>

        {/* Subtitle */}
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          To experience AR models, you need to install our companion AR application powered by Unreal Engine
        </Text>

        {/* Feature List */}
        <View style={styles.featureList}>
          <View style={styles.feature}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text variant="bodySmall" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
              High-quality 3D models
            </Text>
          </View>
          <View style={styles.feature}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text variant="bodySmall" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
              Interactive AR experience
            </Text>
          </View>
          <View style={styles.feature}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text variant="bodySmall" style={[styles.featureText, { color: theme.colors.onSurfaceVariant }]}>
              Real-time campus exploration
            </Text>
          </View>
        </View>

        {/* Install Button */}
        <KSITButton
          mode="contained"
          onPress={handleInstall}
          style={[styles.downloadBtn, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.downloadBtnLabel}
          icon={() => <Icon name="download" size={20} color="#FFFFFF" />}
          contentStyle={styles.downloadBtnContent}>
          Download AR Viewer
        </KSITButton>

        {/* Retry Button */}
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

        {/* Note */}
        <Text variant="bodySmall" style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
          Note: The AR Viewer is a separate application and requires about 150MB of storage
        </Text>
      </Card>
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
  card: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowColor: '#000',
    elevation: 6,
    alignItems: 'center',
  },
  animationWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  featureList: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    lineHeight: 20,
  },
  downloadBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  downloadBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  downloadBtnContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },
  retryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  retryBtnContent: {
    height: 52,
    flexDirection: 'row',
  },
  note: {
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.8,
  },
});