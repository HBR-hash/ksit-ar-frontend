// src/screens/LoginScreen.tsx - ENHANCED VERSION
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Platform, ScrollView, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  HelperText,
  Text,
  TextInput,
  Card,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { KSITButton } from '../components/KSITButton';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* ✨ ANIMATED HEADER SECTION */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          
          {/* ✨ GLOWING LOGO CONTAINER */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <Image
              source={require('../../assets/images/ksit_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to explore KSIT campus
          </Text>
        </Animated.View>

        {/* ✨ ANIMATED FORM CARD WITH GRADIENT BORDER */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <View style={styles.cardWrapper}>
            {/* ✨ GRADIENT BORDER EFFECT */}
            <LinearGradient
              colors={['#2563EB', '#8B5CF6', '#2563EB']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.gradientBorder}>
              <Card 
                style={[styles.card, { backgroundColor: theme.colors.surface }]} 
                mode="elevated"
                elevation={4}>
                <Card.Content style={styles.cardContent}>

                  {/* ✨ EMAIL INPUT */}
                  <View style={styles.inputContainer}>
                    <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                      EMAIL ADDRESS
                    </Text>
                    <View style={[styles.inputWithIcon, { 
                      borderColor: email ? theme.colors.primary : theme.colors.outline,
                      backgroundColor: theme.colors.surfaceVariant,
                    }]}>
                      <Icon 
                        name="mail" 
                        size={20} 
                        color={email ? theme.colors.primary : theme.colors.onSurfaceVariant} 
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

                  {/* ✨ PASSWORD INPUT */}
                  <View style={styles.inputContainer}>
                    <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                      PASSWORD
                    </Text>
                    <View style={[styles.inputWithIcon, { 
                      borderColor: password ? theme.colors.primary : theme.colors.outline,
                      backgroundColor: theme.colors.surfaceVariant,
                    }]}>
                      <Icon 
                        name="lock" 
                        size={20} 
                        color={password ? theme.colors.primary : theme.colors.onSurfaceVariant} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        mode="flat"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
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
                  </View>

                  {/* ✨ ERROR MESSAGE */}
                  {error && (
                    <View style={styles.errorContainer}>
                      <Icon name="alert-circle" size={16} color={theme.colors.error} />
                      <HelperText type="error" visible={!!error} style={styles.errorText}>
                        {error}
                      </HelperText>
                    </View>
                  )}

                  {/* ✨ GRADIENT SIGN IN BUTTON */}
                  <LinearGradient
                    colors={['#2563EB', '#1E40AF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.gradientButton}>
                    <KSITButton
                      onPress={handleLogin}
                      loading={loading}
                      disabled={loading}
                      style={styles.primaryBtn}
                      labelStyle={styles.primaryBtnLabel}
                      icon={() => <Icon name="arrow-right" size={20} color="#FFFFFF" />}
                      contentStyle={styles.primaryBtnContent}
                    >
                      Sign In
                    </KSITButton>
                  </LinearGradient>

                  {/* ✨ FORGOT PASSWORD */}
                  <KSITButton
                    mode="text"
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgot}
                    labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
                    compact
                  >
                    Forgot Password?
                  </KSITButton>

                </Card.Content>
              </Card>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* ✨ ANIMATED FOOTER */}
        <Animated.View 
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          <Text variant="bodyLarge" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Don't have an account?
          </Text>

          <KSITButton
            mode="outlined"
            onPress={() => navigation.navigate('Register')}
            style={[styles.createBtn, { 
              borderColor: theme.colors.primary,
              backgroundColor: 'transparent',
            }]}
            labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
            contentStyle={styles.createBtnContent}
          >
            Create Account
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
    paddingBottom: 40,
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 40,
    alignItems: 'center',
  },

  logoContainer: {
    position: 'relative',
    marginBottom: 24,
  },

  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563EB',
    opacity: 0.15,
    top: -10,
    left: -10,
  },

  logo: {
    width: 100,
    height: 100,
  },

  title: {
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    letterSpacing: 0.3,
    fontSize: 16,
  },

  cardWrapper: {
    marginBottom: 32,
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
    overflow: 'hidden',
  },

  cardContent: {
    padding: 28,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 10,
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
    marginTop: -8,
    marginBottom: 16,
    gap: 8,
  },

  errorText: {
    margin: 0,
  },

  gradientButton: {
    borderRadius: 14,
    marginTop: 24,
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

  forgot: {
    marginTop: 12,
    alignSelf: 'center',
  },

  footer: {
    marginTop: 16,
    alignItems: 'center',
  },

  footerText: {
    marginBottom: 20,
    fontSize: 15,
  },

  createBtn: {
    borderRadius: 14,
    width: '85%',
    height: 56,
    borderWidth: 2,
  },

  createBtnContent: {
    height: 56,
  },
});
