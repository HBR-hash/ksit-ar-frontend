import React from "react";
import { StyleSheet, View, NativeModules } from "react-native";
import LottieView from "lottie-react-native";
import { Text, Button, Card, useTheme } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../navigation/AppNavigator";

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
      <Card style={styles.card} mode="elevated">
        <View style={styles.animationWrapper}>
          <LottieView
            source={require("../../assets/lottie/ar_scanner.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        <Text variant="headlineSmall" style={styles.title}>
          AR App Required
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          To explore the KSIT 3D Campus, install the AR Experience app.
        </Text>

        <Button
          mode="contained"
          onPress={handleInstall}
          style={styles.downloadBtn}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontWeight: "700" }}
        >
          Install AR App
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.retryBtn}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontWeight: "600" }}
        >
          Retry Launch
        </Button>

        <Text style={styles.note}>
          After installing, return here and press “Retry Launch”.
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  animationWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  title: {
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  downloadBtn: {
    marginTop: 4,
    borderRadius: 12,
  },
  retryBtn: {
    marginTop: 8,
    borderRadius: 12,
  },
  note: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    opacity: 0.7,
  },
});

export default ARInstallRequiredScreen;
