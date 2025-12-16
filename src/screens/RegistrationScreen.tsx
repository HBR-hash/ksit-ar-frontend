// src/screens/RegistrationScreen.tsx - ENHANCED VERSION
import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, StyleSheet, View, Image, Animated} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {AuthStackParamList} from '../navigation/AppNavigator';
import {useAuth} from '../context/AuthContext';
import {ScreenContainer} from '../components/ScreenContainer';
import {KSITButton} from '../components/KSITButton';
import {KSITCard} from '../components/KSITCard';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegistrationScreen = ({navigation}: Props) => {
  const {register} = useAuth();
  const theme = useTheme();
  const [form, setForm] = useState({name: '', email: '', phone: '', password: ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // ✨ VALIDATION STATES
  const [validation, setValidation] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  // ✨ PASSWORD STRENGTH
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

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

  // ✨ VALIDATE INPUTS
  useEffect(() => {
    setValidation({
      name: form.name.trim().length >= 3,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
      phone: /^\d{10}$/.test(form.phone),
      password: form.password.length >= 8 && /\d/.test(form.password),
    });

    // ✨ CALCULATE PASSWORD STRENGTH
    if (form.password.length === 0) {
      setPasswordStrength('weak');
    } else if (form.password.length < 8) {
      setPasswordStrength('weak');
    } else if (form.password.length >= 8 && /\d/.test(form.password) && /[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  }, [form]);

  const handleChange = (key: string, value: string) => setForm(prev => ({...prev, [key]: value}));

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      setSuccess('OTP sent to your phone. Enter the code to verify.');
      navigation.navigate('OTP', {phone: form.phone.trim()});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
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
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* ✨ ANIMATED HEADER */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          }}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <Image
              source={require('../../assets/images/ksit_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text
            variant="headlineLarge"
            style={[styles.title, {color: theme.colors.onBackground}]}>
            Create Account
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
            Join KSIT AR Campus Explorer
          </Text>
        </Animated.View>

        {/* ✨ ANIMATED FORM CARD */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          }}>
          <View style={styles.cardWrapper}>
            <LinearGradient
              colors={['#2563EB', '#8B5CF6', '#2563EB']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.gradientBorder}>
              <KSITCard style={[styles.card, {
                backgroundColor: theme.colors.surface,
              }]}>
                <KSITCardContent>
                  
                  {/* ✨ FULL NAME with VALIDATION */}
                  <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                      <Text variant="labelLarge" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
                        FULL NAME
                      </Text>
                      {form.name && (
                        <Icon 
                          name={validation.name ? "check-circle" : "x-circle"} 
                          size={16} 
                          color={validation.name ? '#10B981' : '#EF4444'} 
                        />
                      )}
                    </View>
                    <View style={[styles.inputWithIcon, {
                      borderColor: form.name ? (validation.name ? '#10B981' : '#EF4444') : theme.colors.outline,
                      backgroundColor: theme.colors.surfaceVariant,
                    }]}>
                      <Icon 
                        name="user" 
                        size={20} 
                        color={form.name ? (validation.name ? '#10B981' : theme.colors.onSurfaceVariant) : theme.colors.onSurfaceVariant}
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        mode="flat"
                        value={form.name}
                        onChangeText={v => handleChange('name', v)}
                        placeholder="Enter your full name"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        style={styles.input}
                        contentStyle={styles.inputContent}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                      />
                    </View>
                  </View>

                  {/* ✨ EMAIL with VALIDATION */}
                  <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                      <Text variant="labelLarge" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
                        EMAIL ADDRESS
                      </Text>
                      {form.email && (
                        <Icon 
                          name={validation.email ? "check-circle" : "x-circle"} 
                          size={16} 
                          color={validation.email ? '#10B981' : '#EF4444'} 
                        />
                      )}
                    </View>
                    <View style={[styles.inputWithIcon, {
                      borderColor: form.email ? (validation.email ? '#10B981' : '#EF4444') : theme.colors.outline,
                      backgroundColor: theme.colors.surfaceVariant,
                    }]}>
                      <Icon 
                        name="mail" 
                        size={20} 
                        color={form.email ? (validation.email ? '#10B981' : theme.colors.onSurfaceVariant) : theme.colors.onSurfaceVariant}
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        mode="flat"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={v => handleChange('email', v)}
                        placeholder="your.email@ksit.edu.in"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        style={styles.input}
                        contentStyle={styles.inputContent}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                      />
                    </View>
                  </View>

                  {/* ✨ PHONE with VALIDATION */}
                  <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                      <Text variant="labelLarge" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
                        PHONE NUMBER
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
                        onChangeText={v => handleChange('phone', v)}
                        placeholder="Enter your phone number"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        style={styles.input}
                        contentStyle={styles.inputContent}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                      />
                    </View>
                  </View>

                  {/* ✨ PASSWORD with STRENGTH INDICATOR */}
                  <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                      <Text variant="labelLarge" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
                        PASSWORD
                      </Text>
                      {form.password && (
                        <Icon 
                          name={validation.password ? "check-circle" : "x-circle"} 
                          size={16} 
                          color={validation.password ? '#10B981' : '#EF4444'} 
                        />
                      )}
                    </View>
                    <View style={[styles.inputWithIcon, {
                      borderColor: form.password ? (validation.password ? getStrengthColor() : '#EF4444') : theme.colors.outline,
                      backgroundColor: theme.colors.surfaceVariant,
                    }]}>
                      <Icon 
                        name="lock" 
                        size={20} 
                        color={form.password ? (validation.password ? getStrengthColor() : theme.colors.onSurfaceVariant) : theme.colors.onSurfaceVariant}
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        mode="flat"
                        secureTextEntry={!showPassword}
                        value={form.password}
                        onChangeText={v => handleChange('password', v)}
                        placeholder="Create a password"
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
                    {form.password.length > 0 && (
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

                  <HelperText type="info" style={styles.helperText}>
                    Minimum 8 characters with at least 1 number
                  </HelperText>

                  {error && (
                    <View style={styles.errorContainer}>
                      <Icon name="alert-circle" size={16} color={theme.colors.error} />
                      <HelperText type="error" visible={!!error} style={styles.errorText}>
                        {error}
                      </HelperText>
                    </View>
                  )}
                  {success && (
                    <View style={styles.successContainer}>
                      <Icon name="check-circle" size={16} color="#10B981" />
                      <HelperText type="info" visible={!!success} style={styles.successText}>
                        {success}
                      </HelperText>
                    </View>
                  )}

                  {/* ✨ GRADIENT BUTTON */}
                  <LinearGradient
                    colors={['#2563EB', '#1E40AF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.gradientButton}>
                    <KSITButton
                      onPress={handleRegister}
                      loading={loading}
                      disabled={loading || !Object.values(validation).every(v => v)}
                      style={styles.cta}
                      labelStyle={styles.ctaLabel}
                      icon={() => <Icon name="arrow-right" size={20} color="#FFFFFF" />}
                      contentStyle={styles.ctaContent}>
                      Create Account
                    </KSITButton>
                  </LinearGradient>

                </KSITCardContent>
              </KSITCard>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* ✨ ANIMATED FOOTER */}
        <Animated.View 
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Already have an account?
          </Text>
          <Button 
            onPress={() => navigation.navigate('Login')}
            textColor={theme.colors.primary}
            labelStyle={styles.loginBtnLabel}>
            Sign In
          </Button>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
};

const KSITCardContent: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <View style={styles.cardContent}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  logoContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 20,
  },

  logoGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#2563EB',
    opacity: 0.12,
    top: -10,
    left: -10,
  },

  logo: {
    width: 110,
    height: 110,
  },

  title: {
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 0.3,
    fontSize: 16,
  },

  cardWrapper: {
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
    transition: 'all 0.3s ease',
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
    transition: 'width 0.3s ease',
  },

  strengthText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  helperText: {
    marginTop: -8,
    marginBottom: 12,
    fontSize: 12,
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

  successText: {
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

  footer: {
    marginTop: 16,
    alignItems: 'center',
  },

  loginBtnLabel: {
    fontWeight: '700',
    fontSize: 15,
  },
});
