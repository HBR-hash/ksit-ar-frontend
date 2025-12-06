import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, HelperText, Text, TextInput, Card, useTheme } from 'react-native-paper';
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
    <ScreenContainer centerContent>
      <Text style={styles.header}>Forgot password?</Text>
      <Text style={styles.sub}>
        Enter your registered email. We'll send a reset OTP to your phone.
      </Text>

      <Card style={styles.card} mode="elevated">
        <Card.Content>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          {error && <HelperText type="error">{error}</HelperText>}
          {info && <HelperText type="info">{info}</HelperText>}

          <KSITButton
            onPress={handleRequest}
            loading={loading}
            disabled={loading}
            style={styles.primaryBtn}
          >
            Send Reset OTP
          </KSITButton>

          <KSITButton
            mode="text"
            onPress={() => navigation.navigate('ResetPassword')}
            style={styles.linkBtn}
            labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
          >
            Already have OTP? Reset now
          </KSITButton>

        </Card.Content>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#0A1120',
  },
  sub: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    color: '#374151',
  },
  card: {
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  input: {
    marginBottom: 14,
  },
  primaryBtn: {
    marginTop: 6,
    borderRadius: 12,
  },
  linkBtn: {
    marginTop: 4,
    alignSelf: 'center',
  },
});

export default ForgotPasswordScreen;