import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
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
        keyboardShouldPersistTaps="handled">
        <Image
          source={require('../../assets/images/ksit_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text
          variant="headlineMedium"
          style={[styles.title, {color: theme.colors.onSurface}]}>
          Create your account
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, {color: theme.colors.onSurface}]}>
          Register to unlock AR-powered campus exploration.
        </Text>

        <KSITCard>
          <KSITCardContent>
            <TextInput
              label="Full Name"
              mode="outlined"
              value={form.name}
              onChangeText={v => handleChange('name', v)}
              style={styles.input}
            />
            <TextInput
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={v => handleChange('email', v)}
              style={styles.input}
            />
            <TextInput
              label="Phone Number"
              mode="outlined"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={v => handleChange('phone', v)}
              style={styles.input}
            />
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              value={form.password}
              onChangeText={v => handleChange('password', v)}
              style={styles.input}
              right={<TextInput.Icon icon="shield-key" />}
            />
            <HelperText type="info">
              Minimum 8 characters with at least 1 number.
            </HelperText>

            {error && <HelperText type="error">{error}</HelperText>}
            {success && <HelperText type="info">{success}</HelperText>}

            <KSITButton
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.cta}>
              Send OTP
            </KSITButton>
          </KSITCardContent>
        </KSITCard>

        <View style={styles.footer}>
          <Text>Already registered?</Text>
          <Button onPress={() => navigation.navigate('Login')}>
            Login
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const KSITCardContent: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingBottom: 32,
  },
  logo: {
    width: 110,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  cta: {
    borderRadius: 14,
    marginTop: 10,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
export default RegistrationScreen;
