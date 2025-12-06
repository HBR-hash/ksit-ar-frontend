import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {checkARAvailability} from '../modules/KSITARLauncher';
import {ENV} from '../config/env';

export const useARAvailability = () => {
  const [available, setAvailable] = useState(false);
  const [checking, setChecking] = useState(true);

  const evaluate = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setAvailable(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    const installed = await checkARAvailability(ENV.UE_PACKAGE_NAME);
    setAvailable(installed);
    setChecking(false);
  }, []);

  useEffect(() => {
    evaluate();
  }, [evaluate]);

  return {available, checking, refresh: evaluate};
};
