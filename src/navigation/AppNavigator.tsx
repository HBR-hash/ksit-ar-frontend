import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { enableScreens } from "react-native-screens";
import { useAuth } from "../context/AuthContext";

import { SplashScreen } from "../screens/SplashScreen";
import { LoadingScreen } from "../screens/LoadingScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegistrationScreen } from "../screens/RegistrationScreen";
import { OTPScreen } from "../screens/OTPScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { ResetPasswordScreen } from "../screens/ResetPasswordScreen";
import { MainMenuScreen } from "../screens/MainMenuScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen";
import ARInstallRequiredScreen from "../screens/ARInstallRequiredScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTP: { phone: string };
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

export type AppStackParamList = {
  MainMenu: undefined;
  EditProfile: undefined;
  ARInstallRequired: undefined;
};

enableScreens(true);

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const PrivateStack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  const { user, loading, splashDone } = useAuth();
  const scheme = useColorScheme();

  if (!splashDone) return <SplashScreen />;
  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      {user ? (
        <PrivateStack.Navigator>
          <PrivateStack.Screen
            name="MainMenu"
            component={MainMenuScreen}
            options={{ headerShown: false }}
          />
          <PrivateStack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Edit Profile" }}
          />
          <PrivateStack.Screen
            name="ARInstallRequired"
            component={ARInstallRequiredScreen}
            options={{ headerShown: false }}
          />
        </PrivateStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegistrationScreen} />
          <AuthStack.Screen name="OTP" component={OTPScreen} />
          <AuthStack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <AuthStack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};
