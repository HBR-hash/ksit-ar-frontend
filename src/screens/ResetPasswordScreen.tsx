// src/screens/ResetPasswordScreen.tsx - ENHANCED VERSION
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, ScrollView, Animated} from 'react-native';
import {Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../context/AuthContext';
import {ScreenContainer} from '../components/ScreenContainer';
import {KSITButton} from '../components/KSITButton';

export const ResetPasswordScreen = () => {
  const {resetPassword, resendOtp} = useAuth();
  const theme = useTheme();
  const [form, setForm] = useState({phone:'', code:'', newPassword:''});
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resends, setResends] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // ✨ VALIDATION STATES
  const [validation, setValidation] = useState({
    phone: false,
    code: false,
    password: false,
  });

  // ✨ PASSWORD STRENGTH
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

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

  // ✨ VALIDATE INPUTS
  useEffect(() => {
    setValidation({
      phone: /^\d{10}$/.test(form.phone),
      code: /^\d{6}$/.test(form.code),
      password: form.newPassword.length >= 8 && /\d/.test(form.newPassword),
    });

    // ✨ CALCULATE PASSWORD STRENGTH
    if (form.newPassword.length === 0) {
      setPasswordStrength('weak');
    } else if (form.newPassword.length < 8) {
      setPasswordStrength('weak');
    } else if (form.newPassword.length >= 8 && /\d/.test(form.newPassword) && /[a-z]/.test(form.newPassword) && /[A-Z]/.test(form.newPassword)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  }, [form]);

  const handleChange = (key:string, value:string) => setForm(prev=>({...prev,[key]:value}));

  const handleReset = async () => {
    setError(null); setStatus(null); setLoading(true);
    try {
      await resetPassword(form);
      setStatus('Password updated. Please login again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!form.phone) { setError('Enter your registered phone number first.'); return; }
    if (resends >= 3) { setError('Resend limit reached.'); return; }
    try {
      await resendOtp(form.phone, 'reset');
      setResends(prev=>prev+1);
      setStatus('OTP resent to your phone.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend OTP');
    }
  };

  // ✨ PASSWORD STRENGTH COLORS
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'strong': return '#10B981';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
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
              <Icon name="lock" size={40} color="#FFFFFF" />
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
          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
            Reset Password
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Enter the OTP sent to your phone and create a new password
          </Text>
        </Animated.View>

        {/* ✨ ANIMATED FORM */}
        <Animated.View
          style={{
            width: '100%',
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>

          {/* ✨ PHONE INPUT with VALIDATION */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                REGISTERED PHONE
              </Text>
              {form.phone && (
                <Icon 
                  name={validation.phone ? "check-circle" : "x-circle"} 
                  size={16} 
                  color={validation.phone ? '#10B981' : '#EF4444'} 
                />
              )}
            </View>
            <View style={[styles.inputWithIcon, {
              borderColor: form.phone ? (validation.phone ? '#10B981' : '#EF4444') : theme.colors.outline,
              backgroundColor: theme.colors.surfaceVariant,
            }]}>
              <Icon 
                name="phone" 
                size={20} 
                color={form.phone ? (validation.phone ? '#10B981' : theme.colors.onSurfaceVariant) : theme.colors.onSurfaceVariant}
                style={styles.inputIcon} 
              />
              <TextInput
                mode="flat"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={v=>handleChange('phone',v)}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                style={styles.input}
                contentStyle={styles.inputContent}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </View>

          {/* ✨ OTP INPUT with VALIDATION */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                OTP CODE
              </Text>
              {form.code && (
                <Icon 
                  name={validation.code ? "check-circle" : "x-circle"} 
                  size={16} 
                  color={validation.code ? '#10B981' : '#EF4444'} 
                />
              )}
            </View>
            <View style={[styles.inputWithIcon, {
              borderColor: form.code ? (validation.code ? '#10B981' : '#EF4444') : theme.colors.outline,
              backgroundColor: theme.colors.surfaceVariant,
            }]}>
              <Icon 
                name="shield" 
                size={20} 
                color={form.code ? (validation.code ? '#10B981' : theme.colors.onSurfaceVariant) : theme.colors.onSurfaceVariant}
                style={styles.inputIcon} 
              />
              <TextInput
                mode="flat"
                keyboardType="number-pad"
                value={form.code}
                onChangeText={v=>handleChange('code',v)}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                style={styles.input}
                contentStyle={styles.inputContent}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </View>

          {/* ✨ PASSWORD INPUT with STRENGTH INDICATOR */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                NEW PASSWORD
              </Text>
              {form.newPassword && (
                <Icon 
                  name={validation.password ? "check-circle" : "x-circle"} 
                  size={16} 
                  color={validation.password ? '#10B981' : '#EF4444'} 
                />
              )}
            </View>
            <View style={[styles.inputWithIcon, {
              borderColor: form.newPassword ? (validation.password ? getStrengthColor() : '#EF4444') : theme.colors.outline,
              backgroundColor: theme.colors.surfaceVariant,
            }]}>
              <Icon 
                name="lock" 
                size={20} 
                color={form.newPassword ? (validation.password ? getStrengthColor() : theme.colors.onSurfaceVariant) : theme.colors.onSurfaceVariant}
                style={styles.inputIcon} 
              />
              <TextInput
                mode="flat"
                secureTextEntry={!showPassword}
                value={form.newPassword}
                onChangeText={v=>handleChange('newPassword',v)}
                placeholder="Create a new password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                style={styles.input}
                contentStyle={styles.inputContent}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                    color={theme.colors.onSurfaceVariant}
                  />
                }
              />
            </View>

            {/* ✨ PASSWORD STRENGTH BAR */}
            {form.newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill, 
                      { 
                        width: getStrengthWidth(), 
                        backgroundColor: getStrengthColor() 
                      }
                    ]} 
                  />
                </View>
                <Text variant="bodySmall" style={[styles.strengthText, { color: getStrengthColor() }]}>
                  {passwordStrength.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={16} color={theme.colors.error} />
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            </View>
          )}
          {status && (
            <View style={styles.successContainer}>
              <Icon name="check-circle" size={16} color="#10B981" />
              <HelperText type="info" visible={!!status} style={styles.statusText}>
                {status}
              </HelperText>
            </View>
          )}

          {/* ✨ GRADIENT UPDATE BUTTON */}
          <LinearGradient
            colors={['#2563EB', '#1E40AF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientButton}>
            <KSITButton
              onPress={handleReset}
              loading={loading}
              disabled={loading || !Object.values(validation).every(v => v)}
              style={styles.cta}
              labelStyle={styles.ctaLabel}
              icon={() => <Icon name="check-circle" size={20} color="#FFFFFF" />}
              contentStyle={styles.ctaContent}>
              Update Password
            </KSITButton>
          </LinearGradient>

          {/* ✨ RESEND OTP */}
          <View style={styles.resendContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Didn't receive OTP?{' '}
            </Text>
            <Button
              mode="text"
              onPress={handleResend}
              disabled={resends>=3}
              textColor={resends >= 3 ? theme.colors.onSurfaceVariant : theme.colors.primary}
              labelStyle={styles.resendLabel}
              compact>
              Resend ({3-resends} left)
            </Button>
          </View>

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

  title: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    fontSize: 16,
  },

  inputContainer: {
    width: '100%',
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

  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },

  strengthBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },

  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },

  strengthText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
    width: '100%',
  },

  errorText: {
    margin: 0,
    flex: 1,
  },

  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
    width: '100%',
  },

  statusText: {
    margin: 0,
    flex: 1,
    color: '#10B981',
  },

  gradientButton: {
    width: '100%',
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  resendLabel: {
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ResetPasswordScreen;