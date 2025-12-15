import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Alert, Platform, PermissionsAndroid } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  HelperText,
  TextInput,
  useTheme,
  Text,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { ScreenContainer } from '../components/ScreenContainer';
import { KSITButton } from '../components/KSITButton';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type Props = NativeStackScreenProps<AppStackParamList, 'EditProfile'>;

export const EditProfileScreen = ({ navigation }: Props) => {
  const { user, updateProfile } = useAuth();
  const theme = useTheme();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
		profileImage: profileImage,
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

  const handleImagePicker = async () => {
  Alert.alert(
    "Change Profile Picture",
    "Choose an option",
    [
      {
        text: "Take Photo",
        onPress: async () => {
          // Request camera permission for Android
          if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: 'Camera Permission',
                  message: 'App needs access to your camera',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                }
              );
              
              if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission Denied', 'Camera permission is required');
                return;
              }
            } catch (err) {
              console.warn(err);
              return;
            }
          }

          // Open camera
          launchCamera(
            {
              mediaType: 'photo',
              cameraType: 'front',
              quality: 0.8,
              saveToPhotos: false,
            },
            (response) => {
              if (response.didCancel) {
                console.log('User cancelled camera');
              } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
                Alert.alert('Camera Error', response.errorMessage || 'Failed to open camera');
              } else if (response.assets && response.assets[0]) {
                setProfileImage(response.assets[0].uri || null);
              }
            }
          );
        }
      },
      {
        text: "Choose from Gallery",
        onPress: () => {
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 0.8,
            },
            (response) => {
              if (response.didCancel) {
                console.log('User cancelled gallery');
              } else if (response.errorCode) {
                console.log('Gallery Error: ', response.errorMessage);
              } else if (response.assets && response.assets[0]) {
                setProfileImage(response.assets[0].uri || null);
              }
            }
          );
        }
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ]
  );
};

  return (
    <ScreenContainer>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* 🔵 Gradient Header with Avatar */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryContainer || '#1D4ED8']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}>
          
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }} 
                  style={styles.avatarImage}
                />
              ) : (
                <Icon name="user" size={48} color="#FFFFFF" />
              )}
            </View>
            <TouchableOpacity 
              style={styles.editAvatarBtn}
              onPress={handleImagePicker}>
              <Icon name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text variant="headlineSmall" style={styles.headerTitle}>
            Edit Profile
          </Text>
        </LinearGradient>

        {/* ⚪ Form Card */}
        <Card 
          style={[styles.card, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          }]} 
          mode="elevated"
          elevation={6}>
          <Card.Content style={styles.cardContent}>

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
                  onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
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
                  value={form.email}
                  onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                  autoCapitalize="none"
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
                  value={form.phone}
                  onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                  placeholder="Enter your phone number"
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

          </Card.Content>
        </Card>

        {/* Save Button */}
        <KSITButton
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.saveButtonLabel}
          icon={() => <Icon name="check" size={20} color="#FFFFFF" />}
          contentStyle={styles.saveButtonContent}>
          Save Changes
        </KSITButton>

        {/* Cancel */}
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.cancel}
          textColor={theme.colors.onSurfaceVariant}
          compact>
          Cancel
        </Button>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  card: {
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowColor: '#000',
    elevation: 6,
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
    marginBottom: 0,
  },

  saveButton: {
    marginTop: 32,
    marginHorizontal: 20,
    height: 52,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  saveButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  saveButtonContent: {
    height: 52,
    flexDirection: 'row-reverse',
  },

  cancel: {
    marginTop: 12,
    alignSelf: 'center',
  },
});

export default EditProfileScreen;