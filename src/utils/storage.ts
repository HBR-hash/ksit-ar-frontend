import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@ksit_token';
const PROFILE_KEY = '@ksit_profile';

export const saveSession = async (
  token: string,
  profile: Record<string, unknown>,
) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [PROFILE_KEY, JSON.stringify(profile)],
  ]);
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, PROFILE_KEY]);
};

export const getSession = async () => {
  const [[, token], [, profileStr]] = await AsyncStorage.multiGet([
    TOKEN_KEY,
    PROFILE_KEY,
  ]);
  return {
    token,
    profile: profileStr ? JSON.parse(profileStr) : null,
  };
};


