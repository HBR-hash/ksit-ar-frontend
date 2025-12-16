// src/screens/ForgotPasswordScreen.tsx - ENHANCED VERSION
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, HelperText, Text, TextInput, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { KSITButton } from '../components/KSITButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = ({ navigation }: Props) => {
  const { forgotPassword } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✨ VALIDATION
  const [isValidEmail, setIsValidEmail] = useState(false);

  // ✨ ANIMATION REFS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ✨ VALIDATE EMAIL
  useEffect(() => {
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  const handleRequest = async () => {
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setInfo('OTP sent to your registered phone number.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* ✨ ANIMATED ICON CIRCLE with GRADIENT */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#2563EB', '#8B5CF6']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.iconCircle}>
              <Icon name="key" size={40} color="#FFFFFF" />
            </LinearGradient>
            {/* ✨ PULSE RING */}
            <View style={styles.pulseRing} />
          </View>
        </Animated.View>

        {/* ✨ ANIMATED HEADER */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <Text variant="headlineLarge" style={[styles.header, { color: theme.colors.onBackground }]}>
            Forgot Password?
          </Text>
          <Text variant="bodyLarge" style={[styles.sub, { color: theme.colors.onSurfaceVariant }]}>
            Enter your email address and we'll send you a verification code
          </Text>
        </Animated.View>

        {/* ✨ ANIMATED FORM CARD with GRADIENT BORDER */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={['#2563EB', '#8B5CF6', '#2563EB']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.gradientBorder}>
              <Card 
                style={[styles.card, { 
                  backgroundColor: theme.colors.surface,
                }]} 
                mode="elevated"
                elevation={4}>
                <Card.Content style={styles.cardContent}>

                  {/* ✨ EMAIL INPUT with VALIDATION */}
                  <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                        EMAIL ADDRESS
                      </Text>
                      {email && (
                        <Icon 
                          name={isValidEmail ? "check-circle" : "x-circle"} 
                          size={16} 
                          color={isValidEmail ? '#10B981' : '#EF4444'} 
                        />
                      )}
                    </View>
                    <View style={[styles.inputWithIcon, {
                      borderColor: email ? (isValidEmail ? '#10B981' : '#EF4444') : theme.colors.outline,
                      backgroundColor: theme.colors.surfaceVariant,
                    }]}>
                      <Icon 
                        name="mail" 
                        size={20} 
                        color={email ? (isValidEmail ? '#10B981' : theme.colors.onSurfaceVariant) : theme.colors.onSurfaceVariant}
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        mode="flat"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="your.email@ksit.edu.in"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        style={styles.input}
                        contentStyle={styles.inputContent}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                      />
                    </View>
                  </View>

                  {error && (
                    <View style={styles.errorContainer}>
                      <Icon name="alert-circle" size={16} color={theme.colors.error} />
                      <HelperText type="error" visible={!!error} style={styles.errorText}>
                        {error}
                      </HelperText>
                    </View>
                  )}
                  {info && (
                    <View style={styles.successContainer}>
                      <Icon name="check-circle" size={16} color="#10B981" />
                      <HelperText type="info" visible={!!info} style={styles.infoText}>
                        {info}
                      </HelperText>
                    </View>
                  )}

                  {/* ✨ GRADIENT SEND BUTTON */}
                  <LinearGradient
                    colors={['#2563EB', '#1E40AF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.gradientButton}>
                    <KSITButton
                      onPress={handleRequest}
                      loading={loading}
                      disabled={loading || !isValidEmail}
                      style={styles.primaryBtn}
                      labelStyle={styles.primaryBtnLabel}
                      icon={() => <Icon name="send" size={20} color="#FFFFFF" />}
                      contentStyle={styles.primaryBtnContent}>
                      Send Verification Code
                    </KSITButton>
                  </LinearGradient>

                  {/* ✨ LINK BUTTON */}
                  <KSITButton
                    mode="text"
                    onPress={() => navigation.navigate('ResetPassword')}
                    style={styles.linkBtn}
                    labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
                    compact>
                    Already have OTP? Reset now
                  </KSITButton>

                </Card.Content>
              </Card>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* ✨ BACK TO LOGIN */}
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}>
          <KSITButton
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            labelStyle={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}
            icon={() => <Icon name="arrow-left" size={18} color={theme.colors.onSurfaceVariant} />}
            contentStyle={styles.backBtnContent}
            compact>
            Back to Login
          </KSITButton>
        </Animated.View>

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

  iconContainer: {
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

  header: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  sub: {
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontSize: 16,
  },

  cardWrapper: {
    width: '100%',
    marginBottom: 24,
  },

  gradientBorder: {
    borderRadius: 20,
    padding: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  card: {
    borderRadius: 18,
  },

  cardContent: {
    padding: 28,
  },

  inputContainer: {
    marginBottom: 20,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  label: {
    fontWeight: '700',
    letterSpacing: 0.8,
    fontSize: 13,
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 16,
    height: 56,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 56,
  },

  inputContent: {
    paddingHorizontal: 0,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },

  errorText: {
    margin: 0,
  },

  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },

  infoText: {
    margin: 0,
    color: '#10B981',
  },

  gradientButton: {
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  primaryBtn: {
    height: 56,
    backgroundColor: 'transparent',
  },

  primaryBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },

  primaryBtnContent: {
    height: 56,
    flexDirection: 'row-reverse',
  },

  linkBtn: {
    marginTop: 12,
    alignSelf: 'center',
  },

  backBtn: {
    marginTop: 8,
    alignSelf: 'center',
  },

  backBtnContent: {
    flexDirection: 'row',
  },
});

export default ForgotPasswordScreen;