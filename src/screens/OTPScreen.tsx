import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { ScreenContainer } from "../components/ScreenContainer";
import { KSITButton } from "../components/KSITButton";

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

export const OTPScreen = ({ route, navigation }: Props) => {
  const { phone } = route.params;
  const { verifyRegistration, resendOtp } = useAuth();

  const theme = useTheme();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resends, setResends] = useState(0);

  const handleVerify = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      await verifyRegistration(phone, code);
      // After verification, user is set in auth context and AppNavigator
      // will switch to the private stack. We can just return to the root
      // of the auth stack.
      navigation.replace("Login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resends >= 3) {
      setError("Resend limit reached. Try again later.");
      return;
    }

    try {
      await resendOtp(phone, "register");
      setResends((prev) => prev + 1);
      setInfo("OTP resent. Please check your SMS inbox.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to resend OTP"
      );
    }
  };

  return (
    <ScreenContainer centerContent>
      <Text style={styles.title}>Verify your phone</Text>
      <Text style={styles.subtitle}>OTP sent to {phone}</Text>

      {/* OTP Input */}
      <TextInput
        label="Enter 6-digit OTP"
        mode="outlined"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />

      {error && <HelperText type="error">{error}</HelperText>}
      {info && <HelperText type="info">{info}</HelperText>}

      {/* Verify Button */}
      <KSITButton
        onPress={handleVerify}
        loading={loading}
        disabled={loading}
        style={styles.cta}
      >
        Verify & Continue
      </KSITButton>

      {/* Resend OTP */}
      <Button
        mode="text"
        onPress={handleResend}
        disabled={resends >= 3}
        labelStyle={{
          color: theme.colors.primary,
          fontWeight: "600",
        }}
      >
        Resend OTP ({3 - resends} left)
      </Button>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#0A1120",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#374151",
    marginBottom: 18,
  },
  input: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cta: {
    marginTop: 8,
    borderRadius: 14,
  },
});

export default OTPScreen;