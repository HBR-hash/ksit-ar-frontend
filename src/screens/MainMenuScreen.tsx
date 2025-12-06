import React, { useCallback, useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  NativeModules,
  AppState,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, HelperText, Text } from "react-native-paper";
import { AppStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useARAvailability } from "../hooks/useARAvailability";
import { ENV } from "../config/env";
import { launchARExperience } from "../modules/KSITARLauncher";
import { ScreenContainer } from "../components/ScreenContainer";
import { KSITButton } from "../components/KSITButton";

type Props = NativeStackScreenProps<AppStackParamList, "MainMenu">;

// 🔵 Blue color used in Login page
const BLUE = "#0B5ED7";

export const MainMenuScreen = ({ navigation }: Props) => {
  const { user, logout, refreshProfile } = useAuth();
  const { available, refresh } = useARAvailability();

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
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {user.name}</Text>
          <Text style={styles.sub}>
            Ready to explore the KSIT campus in augmented reality?
          </Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.card}>
          <Card.Title title="Your profile" titleStyle={styles.title} />
          <Card.Content>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Phone: {user.phone}</Text>
          </Card.Content>

          <Card.Actions style={{ gap: 10 }}>
            <Button
              onPress={() => navigation.navigate("EditProfile")}
              style={styles.blueBtn}
              labelStyle={styles.blueLabel}
            >
              Edit
            </Button>

            <Button
              onPress={refreshProfile}
              style={styles.blueBtn}
              labelStyle={styles.blueLabel}
            >
              Refresh
            </Button>
          </Card.Actions>
        </Card>

        {/* AR Section */}
        {Platform.OS === "android" && (
          <Card style={styles.card}>
            <Card.Title title="KSIT AR Experience" titleStyle={styles.title} />
            <Card.Content style={{ marginBottom: 8 }}>
              <Text style={styles.text}>
                Launch the Unreal Engine powered AR campus walkthrough.
              </Text>
            </Card.Content>

            <Card.Actions style={{ flexDirection: "row", gap: 12 }}>
              
              <KSITButton
                onPress={handleInstall}
                style={styles.blueBtn}
                labelStyle={styles.blueLabel}
              >
                Install
              </KSITButton>

              <KSITButton
                onPress={handleLaunch}
                disabled={!available}
                loading={loading}
                style={[
                  styles.blueBtn,
                  !available && { opacity: 0.5 },
                ]}
                labelStyle={styles.blueLabel}
              >
                Launch
              </KSITButton>

            </Card.Actions>
          </Card>
        )}

        {/* Logout */}
        <KSITButton
		mode="contained"
		onPress={logout}
		style={styles.logout}
		labelStyle={{
			color: "#FFFFFF",   // white text
			fontWeight: "700",
			fontSize: 16,
		}}
		>
		Logout
		</KSITButton>


        {error && <HelperText type="error">{error}</HelperText>}
      </ScrollView>
    </ScreenContainer>
  );
};

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  header: {
    marginBottom: 22,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0A1120",
    letterSpacing: 0.3,
  },

  sub: {
    color: "#6B7280",
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 18,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  title: {
    color: "#0A1120",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  text: {
    color: "#374151",
    fontSize: 16,
    marginBottom: 4,
  },

  /* 🔵 UNIVERSAL BLUE BUTTON STYLE */
  blueBtn: {
    backgroundColor: BLUE,
    borderRadius: 12,
    height: 46,
    flex: 1,
    justifyContent: "center",
    elevation: 2,
  },

  blueLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  logout: {
  marginTop: 10,
  borderRadius: 12,
  height: 50,
  backgroundColor: "#0B5ED7", // dark blue
  justifyContent: "center",
  elevation: 3,
},

});

export default MainMenuScreen;




/*import React, { useCallback, useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  NativeModules,
  AppState,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, HelperText, Text, useTheme } from "react-native-paper";
import { AppStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useARAvailability } from "../hooks/useARAvailability";
import { ENV } from "../config/env";
import { launchARExperience } from "../modules/KSITARLauncher";
import { ScreenContainer } from "../components/ScreenContainer";
import { KSITButton } from "../components/KSITButton";

type Props = NativeStackScreenProps<AppStackParamList, "MainMenu">;

export const MainMenuScreen = ({ navigation }: Props) => {
  const { user, logout, refreshProfile } = useAuth();
  const { available, checking, refresh } = useARAvailability();
  const theme = useTheme();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const Installer = NativeModules.KSITInstaller;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Refresh when app comes to foreground (after installation)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // Refresh AR availability when app becomes active
        refresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refresh]);

  if (!user) return null;

  const handleInstall = () => {
    Alert.alert(
      "Install AR App",
      "This will install the KSIT AR 3D Campus Experience on your phone.\nDo you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Install",
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              await Installer.installARApp();
              // Wait a bit longer and check multiple times for installation
              setTimeout(() => {
                refresh();
                // Check again after a longer delay
                setTimeout(() => refresh(), 3000);
              }, 1000);
            } catch (e) {
              console.log("APK Install Error:", e);
              setError("Unable to install the AR app. Please try again.");
              Alert.alert("Installation Failed", "Unable to install the AR app.");
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
      setError(err instanceof Error ? err.message : "Unable to launch AR experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
     
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user.name}</Text>
        <Text style={styles.sub}>
          Ready to explore the KSIT campus in augmented reality?
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Your profile" titleStyle={styles.title} />
        <Card.Content>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Phone: {user.phone}</Text>
        </Card.Content>

        <Card.Actions>
          <Button
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.smallBtn}
            labelStyle={styles.smallLabel}
          >
            Edit
          </Button>

          <Button
            onPress={refreshProfile}
            style={styles.smallBtn}
            labelStyle={styles.smallLabel}
          >
            Refresh
          </Button>
        </Card.Actions>
      </Card>

      
      {Platform.OS === "android" && (
        <Card style={styles.card}>
          <Card.Title title="KSIT AR Experience" titleStyle={styles.title} />
          <Card.Content>
            <Text style={styles.text}>
              Launch the Unreal Engine powered AR campus walkthrough.
            </Text>
          </Card.Content>

          <Card.Actions>
            {available ? (
              <KSITButton
                onPress={handleLaunch}
                loading={loading}
                style={styles.launchBtn}
                labelStyle={{ color: theme.colors.textPrimary, fontWeight: "700" }}
              >
                Launch AR
              </KSITButton>
            ) : (
              <KSITButton
                onPress={handleInstall}
                style={styles.installBtn}
                labelStyle={{ color: theme.colors.textPrimary, fontWeight: "700" }}
              >
                Install AR App
              </KSITButton>
            )}
          </Card.Actions>
        </Card>
      )}

  
      <KSITButton
        mode="outlined"
        onPress={logout}
        style={styles.logout}
        labelStyle={{ color: theme.colors.onSurface }}
      >
        Logout
      </KSITButton>

      {error && <HelperText type="error">{error}</HelperText>}
    </ScrollView>
    </ScreenContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  header: {
    marginBottom: 22,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0A1120",
    letterSpacing: 0.3,
  },

  sub: {
    color: "#6B7280",
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 18,
    borderRadius: 16,

    // Modern premium shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  title: {
    color: "#0A1120",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  text: {
    color: "#374151",
    fontSize: 16,
    marginBottom: 4,
  },

  // Small grey buttons: Edit, Refresh
  smallBtn: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    flex: 1,
  },

  smallLabel: {
    color: "#0A1120",
    fontWeight: "600",
    fontSize: 15,
  },

  // INSTALL button
  installBtn: {
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    height: 46,
    flex: 1,
  },

  // LAUNCH button (highlight action)
  launchBtn: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    height: 46,
    flex: 1,
    justifyContent: "center",
  },

  // Logout upgraded UI
  logout: {
    marginTop: 10,
    borderRadius: 12,
    height: 50,
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#EF4444",
  },
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A1120",
  },
  sub: {
    color: "#374151",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
    borderRadius: 14,
    elevation: 3,
    paddingBottom: 10,
  },
  title: { color: "#0A1120", fontSize: 18, fontWeight: "700" },
  text: { color: "#374151", fontSize: 15, marginBottom: 4 },
  smallBtn: {
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
  },
  smallLabel: {
    color: "#0A1120",
    fontWeight: "600",
  },
  installBtn: {
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    height: 46,
  },
  launchBtn: {
    backgroundColor: "#C0E8FF",
    borderRadius: 10,
    height: 46,
  },
  logout: {
    borderRadius: 10,
    marginTop: 10,
	 backgroundColor: "#E6E6E6",
  },
});

export default MainMenuScreen;*/