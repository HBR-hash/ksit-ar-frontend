import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, HelperText, Text, TextInput, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}20` }]}>
          <Icon name="key" size={32} color={theme.colors.primary} />
        </View>

        {/* Header */}
        <Text variant="headlineMedium" style={[styles.header, { color: theme.colors.onBackground }]}>
          Forgot Password?
        </Text>
        <Text variant="bodyMedium" style={[styles.sub, { color: theme.colors.onSurfaceVariant }]}>
          Enter your email address and we'll send you a verification code
        </Text>

        {/* Form Card */}
        <Card 
          style={[styles.card, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          }]} 
          mode="elevated"
          elevation={3}>
          <Card.Content style={styles.cardContent}>

            {/* Email Input */}
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

            {error && (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            )}
            {info && (
              <HelperText type="info" visible={!!info} style={styles.infoText}>
                {info}
              </HelperText>
            )}

            {/* Send OTP Button */}
            <KSITButton
              onPress={handleRequest}
              loading={loading}
              disabled={loading}
              style={[styles.primaryBtn, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.primaryBtnLabel}
              icon={() => <Icon name="send" size={20} color="#FFFFFF" />}
              contentStyle={styles.primaryBtnContent}>
              Send Verification Code
            </KSITButton>

            {/* Link Button */}
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

        {/* Back to Login */}
        <KSITButton
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          labelStyle={{ color: theme.colors.onSurfaceVariant }}
          icon={() => <Icon name="arrow-left" size={18} color={theme.colors.onSurfaceVariant} />}
          contentStyle={styles.backBtnContent}
          compact>
          Back to Login
        </KSITButton>

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
  header: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sub: {
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  card: {
    width: '100%',
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
  errorText: {
    marginTop: -8,
    marginBottom: 8,
  },
  infoText: {
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
  linkBtn: {
    marginTop: 8,
    alignSelf: 'center',
  },
  backBtn: {
    marginTop: 24,
    alignSelf: 'center',
  },
  backBtnContent: {
    flexDirection: 'row',
  },
});