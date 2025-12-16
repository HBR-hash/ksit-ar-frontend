// src/screens/OTPScreen.tsx - ENHANCED VERSION
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, ScrollView, TextInput as RNTextInput, Animated } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
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

  // ✨ ANIMATION REFS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    ]).start();
  }, []);

  // ✨ SHAKE ANIMATION ON ERROR
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  const handleOTPChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    setCode(newOtp.join(''));

    // ✨ AUTO FOCUS NEXT INPUT
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // ✨ AUTO VERIFY WHEN COMPLETE
    if (newOtp.join('').length === 6) {
      setTimeout(() => {
        handleVerify(newOtp.join(''));
      }, 300);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      await verifyRegistration(phone, otpCode || code);
      navigation.replace("Login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "OTP verification failed"
      );
      // ✨ CLEAR OTP ON ERROR
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
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
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to resend OTP"
      );
    }
  };

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* ✨ ANIMATED ICON CIRCLE */}
        <Animated.View 
          style={[
            styles.iconCircleContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <LinearGradient
            colors={['#2563EB', '#8B5CF6']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.iconCircle}>
            <Icon name="smartphone" size={40} color="#FFFFFF" />
          </LinearGradient>
          {/* ✨ PULSE RING */}
          <View style={styles.pulseRing} />
        </Animated.View>

        {/* ✨ ANIMATED HEADER */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: scaleAnim.interpolate({
              inputRange: [0.9, 1],
              outputRange: [20, 0],
            })}],
          }}>
          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
            Verify Your Phone Number
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            We've sent a 6-digit code to
          </Text>
          <View style={styles.phoneContainer}>
            <Icon name="smartphone" size={16} color={theme.colors.primary} />
            <Text variant="bodyLarge" style={[styles.phone, { color: theme.colors.primary }]}>
              {phone}
            </Text>
          </View>
        </Animated.View>

        {/* ✨ ANIMATED OTP INPUT BOXES */}
        <Animated.View 
          style={[
            styles.otpContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateX: shakeAnim },
              ],
            },
          ]}>
          {otp.map((digit, index) => (
            <View key={index} style={styles.otpBoxWrapper}>
              <LinearGradient
                colors={digit ? ['#2563EB', '#8B5CF6'] : ['transparent', 'transparent']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={[styles.otpGradient, { opacity: digit ? 1 : 0 }]}>
                <View style={styles.otpGradientInner} />
              </LinearGradient>
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
                  borderColor: digit ? 'transparent' : theme.colors.outline,
                  borderWidth: digit ? 0 : 2,
                }]}
                textColor={theme.colors.onSurface}
              />
            </View>
          ))}
        </Animated.View>

        {/* ✨ ERROR/INFO MESSAGES */}
        {error && (
          <Animated.View 
            style={[
              styles.messageContainer,
              { opacity: fadeAnim },
            ]}>
            <View style={[styles.errorBox, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="alert-circle" size={20} color="#EF4444" />
              <Text variant="bodyMedium" style={styles.errorTextEnhanced}>
                {error}
              </Text>
            </View>
          </Animated.View>
        )}
        {info && (
          <Animated.View 
            style={[
              styles.messageContainer,
              { opacity: fadeAnim },
            ]}>
            <View style={[styles.infoBox, { backgroundColor: '#DBEAFE' }]}>
              <Icon name="info" size={20} color="#2563EB" />
              <Text variant="bodyMedium" style={styles.infoTextEnhanced}>
                {info}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* ✨ GRADIENT VERIFY BUTTON */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}>
          <LinearGradient
            colors={['#2563EB', '#1E40AF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.gradientButton, { opacity: code.length !== 6 ? 0.5 : 1 }]}>
            <KSITButton
              onPress={() => handleVerify()}
              loading={loading}
              disabled={loading || code.length !== 6}
              style={styles.cta}
              labelStyle={styles.ctaLabel}
              icon={() => <Icon name="check-circle" size={20} color="#FFFFFF" />}
              contentStyle={styles.ctaContent}>
              Verify Code
            </KSITButton>
          </LinearGradient>
        </Animated.View>

        {/* ✨ RESEND OTP */}
        <Animated.View 
          style={[
            styles.resendContainer,
            { opacity: fadeAnim },
          ]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Didn't receive code?{' '}
          </Text>
          <Button
            mode="text"
            onPress={handleResend}
            disabled={resends >= 3}
            labelStyle={{
              color: resends >= 3 ? theme.colors.onSurfaceVariant : theme.colors.primary,
              fontWeight: "700",
              fontSize: 15,
            }}
            compact
            style={styles.resendBtn}>
            Resend ({3 - resends} left)
          </Button>
        </Animated.View>

        {/* ✨ PROGRESS DOTS */}
        <View style={styles.progressDots}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: otp[index] ? theme.colors.primary : theme.colors.outlineVariant,
                },
              ]}
            />
          ))}
        </View>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },

  iconCircleContainer: {
    position: 'relative',
    marginBottom: 32,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },

  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(37, 99, 235, 0.3)',
    top: -10,
    left: -10,
  },

  title: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
    marginBottom: 8,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },

  phone: {
    fontWeight: '700',
    fontSize: 17,
  },

  otpContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
    width: '100%',
    justifyContent: 'center',
  },

  otpBoxWrapper: {
    position: 'relative',
  },

  otpGradient: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    zIndex: -1,
  },

  otpGradientInner: {
    flex: 1,
    borderRadius: 12,
  },

  otpInput: {
    width: 52,
    height: 64,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
  },

  otpInputOutline: {
    borderRadius: 12,
  },

  messageContainer: {
    width: '100%',
    marginBottom: 24,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },

  errorTextEnhanced: {
    flex: 1,
    color: '#991B1B',
    fontWeight: '600',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },

  infoTextEnhanced: {
    flex: 1,
    color: '#1E40AF',
    fontWeight: '600',
  },

  gradientButton: {
    width: '100%',
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },

  cta: {
    height: 56,
    backgroundColor: 'transparent',
  },

  ctaLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },

  ctaContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },

  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },

  resendBtn: {
    marginLeft: -8,
  },

  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
