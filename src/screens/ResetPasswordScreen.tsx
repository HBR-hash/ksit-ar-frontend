import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
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

  return (
    <ScreenContainer centerContent>
      <Text variant="headlineSmall" style={styles.title}>Reset password</Text>

      <TextInput
        label="Registered Phone"
        mode="outlined"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={v=>handleChange('phone',v)}
        style={styles.input}
      />
      <TextInput
        label="OTP Code"
        mode="outlined"
        keyboardType="number-pad"
        value={form.code}
        onChangeText={v=>handleChange('code',v)}
        style={styles.input}
        maxLength={6}
      />
      <TextInput
        label="New Password"
        mode="outlined"
        secureTextEntry
        value={form.newPassword}
        onChangeText={v=>handleChange('newPassword',v)}
        style={styles.input}
      />
      {error && <HelperText type="error">{error}</HelperText>}
      {status && <HelperText type="info">{status}</HelperText>}

      <KSITButton
        onPress={handleReset}
        loading={loading}
        disabled={loading}
        style={styles.cta}>
        Update Password
      </KSITButton>

      <Button
        mode="text"
        onPress={handleResend}
        disabled={resends>=3}
        textColor={theme.colors.primary}>
        Resend OTP ({3-resends} left)
      </Button>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title:{
    marginBottom:12,
    textAlign: 'center',
  },
  input:{
    marginBottom:12,
  },
  cta:{
    borderRadius:14,
    marginVertical:12,
  },
});
export default ResetPasswordScreen;
