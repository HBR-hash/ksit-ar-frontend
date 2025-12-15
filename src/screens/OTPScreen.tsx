import React, { useState, useRef } from "react";
import { StyleSheet, View, ScrollView, TextInput as RNTextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<RNTextInput[]>([]);

  const handleOTPChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Update the main code state
    setCode(newOtp.join(''));

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}20` }]}>
          <Icon name="smartphone" size={32} color={theme.colors.primary} />
        </View>

        {/* Header */}
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Verify Your Phone Number
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          We've sent a 6-digit code to
        </Text>
        <Text variant="bodyMedium" style={[styles.phone, { color: theme.colors.primary }]}>
          {phone}
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputRefs.current[index] = ref as any;
                }
              }}
              mode="outlined"
              value={digit}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={[styles.otpInput, { 
                backgroundColor: theme.colors.surface,
              }]}
              outlineStyle={[styles.otpInputOutline, {
                borderColor: digit ? theme.colors.primary : theme.colors.outline,
                borderWidth: digit ? 2 : 1,
              }]}
              textColor={theme.colors.onSurface}
            />
          ))}
        </View>

        {error && (
          <HelperText type="error" visible={!!error} style={styles.errorText}>
            {error}
          </HelperText>
        )}
        {info && (
          <HelperText type="info" visible={!!info} style={styles.infoText}>
            {info}
          </HelperText>
        )}

        {/* Verify Button */}
        <KSITButton
          onPress={handleVerify}
          loading={loading}
          disabled={loading || code.length !== 6}
          style={[styles.cta, { 
            backgroundColor: theme.colors.primary,
            opacity: code.length !== 6 ? 0.5 : 1,
          }]}
          labelStyle={styles.ctaLabel}
          icon={() => <Icon name="check-circle" size={20} color="#FFFFFF" />}
          contentStyle={styles.ctaContent}>
          Verify Code
        </KSITButton>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Didn't receive code?{' '}
          </Text>
          <Button
            mode="text"
            onPress={handleResend}
            disabled={resends >= 3}
            labelStyle={{
              color: resends >= 3 ? theme.colors.onSurfaceVariant : theme.colors.primary,
              fontWeight: "600",
              fontSize: 14,
            }}
            compact
            style={styles.resendBtn}>
            Resend ({3 - resends} left)
          </Button>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  phone: {
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    width: '100%',
    justifyContent: 'center',
  },
  otpInput: {
    width: 48,
    height: 56,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  otpInputOutline: {
    borderRadius: 12,
  },
  errorText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  cta: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  ctaContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resendBtn: {
    marginLeft: -8,
  },
});