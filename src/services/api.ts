import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENV} from '../config/env';

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 60000,
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('@ksit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // ✅ Better error handling
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout - server might be waking up. Please try again.'));
    }
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Cannot connect to server. Check your internet connection.'));
    }
    return Promise.reject(error);
  },
);


