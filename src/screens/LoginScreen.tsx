// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Image, Platform, ScrollView } from 'react-native';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <ScreenContainer centerContent>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* 🟦 Header Section */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/ksit_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Welcome Back
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to explore KSIT campus
          </Text>
        </View>

        {/* ⚪ Form Card */}
        <KSITCardWrapper theme={theme}>
          <Card.Content style={styles.cardContent}>

            {/* Email Input with Icon */}
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                EMAIL ADDRESS
              </Text>
              <View style={styles.inputWrapper}>
                <Icon 
                  name="mail" 
                  size={20} 
                  color={theme.colors.onSurfaceVariant} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  mode="outlined"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="your.email@ksit.edu.in"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon={() => <View style={{ width: 40 }} />} />}
                />
              </View>
            </View>

            {/* Password Input with Icon */}
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                PASSWORD
              </Text>
              <View style={styles.inputWrapper}>
                <Icon 
                  name="lock" 
                  size={20} 
                  color={theme.colors.onSurfaceVariant} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon={() => <View style={{ width: 40 }} />} />}
                  right={
                    <TextInput.Icon 
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </View>
            </View>

            {error && (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            )}

            {/* Login Button */}
            <KSITButton
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.primaryBtnLabel}
              icon={() => <Icon name="arrow-right" size={20} color="#FFFFFF" />}
              contentStyle={styles.primaryBtnContent}
            >
              Sign In
            </KSITButton>

            {/* Forgot Password */}
            <KSITButton
              mode="text"
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgot}
              labelStyle={{ color: theme.colors.primary }}
              compact
            >
              Forgot Password?
            </KSITButton>

          </Card.Content>
        </KSITCardWrapper>

        {/* 📝 Footer */}
        <View style={styles.footer}>
          <Text variant="bodyMedium" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Don't have an account?
          </Text>

          <KSITButton
            mode="outlined"
            onPress={() => navigation.navigate('Register')}
            style={[styles.createBtn, { borderColor: theme.colors.primary }]}
            labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
            contentStyle={styles.createBtnContent}
          >
            Create Account
          </KSITButton>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
};

const KSITCardWrapper: React.FC<{ children: React.ReactNode; theme: any }> = ({ children, theme }) => {
  return (
    <Card 
      style={[styles.card, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.outlineVariant,
      }]} 
      mode="elevated"
      elevation={3}
    >
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32,
    alignItems: 'center',
  },

  logo: {
    width: 100,
    height: 72,
    marginBottom: 16,
  },

  title: {
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  card: {
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardContent: {
    padding: 24,
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 12,
  },

  inputWrapper: {
    position: 'relative',
  },

  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },

  input: {
    marginBottom: 0,
    backgroundColor: 'transparent',
  },

  inputContent: {
    paddingLeft: 8,
  },

  inputOutline: {
    borderRadius: 12,
    borderWidth: 2,
  },

  errorText: {
    marginTop: -8,
    marginBottom: 8,
  },

  primaryBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  primaryBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  primaryBtnContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },

  forgot: {
    marginTop: 8,
    alignSelf: 'center',
  },

  footer: {
    marginTop: 24,
    alignItems: 'center',
  },

  footerText: {
    marginBottom: 16,
  },

  createBtn: {
    borderRadius: 12,
    width: '80%',
    height: 52,
    borderWidth: 2,
  },

  createBtnContent: {
    height: 52,
  },
});