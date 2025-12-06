// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  HelperText,
  Text,
  TextInput,
  Card,
  useTheme,
} from 'react-native-paper';
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
      {/* 🟦 Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/ksit_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome back 👋</Text>
        <Text style={styles.subtitle}>Sign in to explore KSIT Campus</Text>
      </View>

      {/* ⚪ Form Card */}
      <KSITCardWrapper>
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

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {error && <HelperText type="error">{error}</HelperText>}

          <KSITButton
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.primaryBtn}
          >
            Login
          </KSITButton>

          <KSITButton
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgot}
            labelStyle={{ color: theme.colors.primary }}
          >
            Forgot password?
          </KSITButton>

        </Card.Content>
      </KSITCardWrapper>

      {/* 📝 Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>New to KSIT AR Campus Explorer?</Text>

        <KSITButton
          mode="outlined"
          onPress={() => navigation.navigate('Register')}
          style={styles.createBtn}
          labelStyle={{ color: theme.colors.primary, fontWeight: '600' }}
        >
          Create an account
        </KSITButton>
      </View>
    </ScreenContainer>
  );
};

const KSITCardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Card style={styles.card} mode="elevated">{children}</Card>;
};


const styles = StyleSheet.create({
  // ⬆️ Added more vertical breathing space for a premium feel
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 32, // increased
    paddingBottom: 28, // increased
    alignItems: 'center',
  },

  logo: {
    width: 100, // slightly bigger for visual balance
    height: 72,
    marginBottom: 14,
  },

  // 🔤 Improved typography: bigger, more premium looking
  title: {
    fontSize: 28, // was 24
    fontWeight: '700',
    color: '#0A1120',
    marginBottom: 8, // increased
    letterSpacing: 0.3, // added for modern look
    textAlign: 'center',
  },

  // 🔤 Cleaner subtitle for competitive UI
  subtitle: {
    fontSize: 14, // was 13
    color: '#6B7280', // softer grey (was #374151)
    textAlign: 'center',
    paddingHorizontal: 36, // slightly larger padding
    letterSpacing: 0.2, // modern typography
  },

  // 🃏 Card now looks cleaner and more premium with shadows
  card: {
    borderRadius: 22, // slightly smoother corners
    paddingVertical: 14, // increased
    paddingHorizontal: 8,
    marginBottom: 20,
    elevation: 3, // added soft elevation (Android)
    shadowColor: '#000', // added subtle shadow (iOS)
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  input: {
    marginBottom: 16, // slightly increased spacing
  },

  // 🔘 Primary button improved for better touch usability
  primaryBtn: {
    marginTop: 10,
    height: 50, // added
    borderRadius: 14, // added modern rounding
    justifyContent: 'center', // vertically center text
  },

  forgot: {
    marginTop: 6,
    alignSelf: 'center',
  },

  footer: {
    marginTop: 26, // small increase
    alignItems: 'center',
  },

  footerText: {
    fontSize: 15, // slightly bigger
    color: '#6B7280', // modern softer grey
    marginBottom: 10,
  },

  // 🔲 Outlined button looks more modern now
  createBtn: {
    borderRadius: 16, // softer corner
    width: '80%',
    height: 48, // consistent with Login button
    borderWidth: 1.5, // stronger outline
    alignItems: 'center',
    justifyContent: 'center', // vertically center text
  },
});

/*const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 40 : 24,
    paddingBottom: 24,
    alignItems: 'center',
  },

  logo: {
    width: 96,
    height: 68,
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A1120',
    marginBottom: 6,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  card: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 18,
  },

  input: {
    marginBottom: 14,
  },

  primaryBtn: {
    marginTop: 8,
  },

  forgot: {
    marginTop: 4,
    alignSelf: 'center',
  },

  footer: {
    marginTop: 24,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },

  createBtn: {
    borderRadius: 14,
    width: '80%',
	alignItems: 'center',
  },
});
*/
export default LoginScreen;