import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
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

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <Image
          source={require('../../assets/images/ksit_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text
          variant="headlineMedium"
          style={[styles.title, {color: theme.colors.onBackground}]}>
          Create Account
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          Join KSIT AR Campus Explorer
        </Text>

        {/* Form Card */}
        <KSITCard style={[styles.card, {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        }]}>
          <KSITCardContent>
            
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
                FULL NAME
              </Text>
              <View style={styles.inputWrapper}>
                <Icon 
                  name="user" 
                  size={20} 
                  color={theme.colors.onSurfaceVariant} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  mode="outlined"
                  value={form.name}
                  onChangeText={v => handleChange('name', v)}
                  placeholder="Enter your full name"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon={() => <View style={{ width: 40 }} />} />}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={v => handleChange('email', v)}
                  placeholder="your.email@ksit.edu.in"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon={() => <View style={{ width: 40 }} />} />}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
                PHONE NUMBER
              </Text>
              <View style={styles.inputWrapper}>
                <Icon 
                  name="phone" 
                  size={20} 
                  color={theme.colors.onSurfaceVariant} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  mode="outlined"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={v => handleChange('phone', v)}
                  placeholder="Enter your phone number"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon={() => <View style={{ width: 40 }} />} />}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text variant="labelMedium" style={[styles.label, {color: theme.colors.onSurfaceVariant}]}>
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
                  value={form.password}
                  onChangeText={v => handleChange('password', v)}
                  placeholder="Create a password"
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

            <HelperText type="info" style={styles.helperText}>
              Minimum 8 characters with at least 1 number
            </HelperText>

            {error && (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            )}
            {success && (
              <HelperText type="info" visible={!!success} style={styles.successText}>
                {success}
              </HelperText>
            )}

            {/* Register Button */}
            <KSITButton
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={[styles.cta, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.ctaLabel}
              icon={() => <Icon name="arrow-right" size={20} color="#FFFFFF" />}
              contentStyle={styles.ctaContent}>
              Create Account
            </KSITButton>

          </KSITCardContent>
        </KSITCard>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Already have an account?
          </Text>
          <Button 
            onPress={() => navigation.navigate('Login')}
            textColor={theme.colors.primary}
            labelStyle={styles.loginBtnLabel}>
            Sign In
          </Button>
        </View>
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
    paddingBottom: 32,
  },
  logo: {
    width: 110,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  card: {
    borderRadius: 16,
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
  helperText: {
    marginTop: -8,
    marginBottom: 8,
  },
  errorText: {
    marginTop: 0,
    marginBottom: 8,
  },
  successText: {
    marginTop: 0,
    marginBottom: 8,
  },
  cta: {
    borderRadius: 12,
    marginTop: 16,
    height: 52,
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
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginBtnLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
});