import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Button, HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}20` }]}>
          <Icon name="lock" size={32} color={theme.colors.primary} />
        </View>

        {/* Header */}
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          Reset Password
        </Text>
        <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Enter the OTP sent to your phone and create a new password
        </Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            REGISTERED PHONE
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
              onChangeText={v=>handleChange('phone',v)}
              placeholder="Enter your phone number"
              style={styles.input}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon={() => <View style={{ width: 40 }} />} />}
            />
          </View>
        </View>

        {/* OTP Input */}
        <View style={styles.inputContainer}>
          <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            OTP CODE
          </Text>
          <View style={styles.inputWrapper}>
            <Icon 
              name="shield" 
              size={20} 
              color={theme.colors.onSurfaceVariant} 
              style={styles.inputIcon} 
            />
            <TextInput
              mode="outlined"
              keyboardType="number-pad"
              value={form.code}
              onChangeText={v=>handleChange('code',v)}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              style={styles.input}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon={() => <View style={{ width: 40 }} />} />}
            />
          </View>
        </View>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            NEW PASSWORD
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
              value={form.newPassword}
              onChangeText={v=>handleChange('newPassword',v)}
              placeholder="Create a new password"
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
        {status && (
          <HelperText type="info" visible={!!status} style={styles.statusText}>
            {status}
          </HelperText>
        )}

        {/* Update Button */}
        <KSITButton
          onPress={handleReset}
          loading={loading}
          disabled={loading}
          style={[styles.cta, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.ctaLabel}
          icon={() => <Icon name="check-circle" size={20} color="#FFFFFF" />}
          contentStyle={styles.ctaContent}>
          Update Password
        </KSITButton>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
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

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  inputContainer: {
    width: '100%',
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
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
  statusText: {
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
  cta: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    marginTop: 8,
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
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resendLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
});