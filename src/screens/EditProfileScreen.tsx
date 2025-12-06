import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  HelperText,
  TextInput,
  useTheme,
  Text,
  Card,
} from 'react-native-paper';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { KSITButton } from '../components/KSITButton';

type Props = NativeStackScreenProps<AppStackParamList, 'EditProfile'>;

export const EditProfileScreen = ({ navigation }: Props) => {
  const { user, updateProfile } = useAuth();
  const theme = useTheme();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      navigation.goBack();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      {/* 🔵 Soft Gradient Header */}
      <View style={styles.headerGradient}>
        <Image
          source={require('../../assets/images/ksit_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Edit profile</Text>
      </View>

      {/* ⚪ Main Card */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>

          <TextInput
            label="Full Name"
            mode="outlined"
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
            style={styles.input}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={form.email}
            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Phone Number"
            mode="outlined"
            value={form.phone}
            onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
            style={styles.input}
          />

          {error && <HelperText type="error">{error}</HelperText>}
        </Card.Content>
      </Card>

      {/* Save Button */}
      <KSITButton
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        Save Changes
      </KSITButton>

      {/* Cancel */}
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.cancel}
        textColor={theme.colors.primary}
      >
        Cancel
      </Button>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: '#0057B8',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  logo: {
    width: 75,
    height: 55,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  card: {
    marginHorizontal: 20,
    marginTop: -20, // pulls card upward
    borderRadius: 20,
    paddingVertical: 6,
  },

  input: {
    marginBottom: 14,
  },

  saveButton: {
    marginTop: 24,
    marginHorizontal: 20,
    borderRadius: 14,
  },
  cancel: {
    marginTop: 8,
    alignSelf: 'center',
  },
});

export default EditProfileScreen;