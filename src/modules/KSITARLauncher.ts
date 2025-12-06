import {NativeModules, Platform} from 'react-native';

type LauncherModule = {
  isAppInstalled: (packageName: string) => Promise<boolean>;
  launchExperience: (
    packageName: string,
    activityName: string,
  ) => Promise<void>;
};

const getModule = (): LauncherModule | null => {
  if (Platform.OS !== 'android') {
    return null;
  }
  const module = NativeModules.KSITARLauncher as LauncherModule | undefined;
  return module ?? null;
};

export const checkARAvailability = async (packageName: string) => {
  const module = getModule();
  if (!module || !packageName) {
    return false;
  }
  try {
    return await module.isAppInstalled(packageName);
  } catch (error) {
    console.warn('AR availability check failed', error);
    return false;
  }
};

export const launchARExperience = async (
  packageName: string,
  activityName: string,
) => {
  const module = getModule();
  if (!module) {
    throw new Error('AR launcher not available on this platform.');
  }
  return module.launchExperience(packageName, activityName);
};
