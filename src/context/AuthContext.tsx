import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";
import { AuthState, UserProfile } from "../types/auth";
import { clearSession, getSession, saveSession } from "../utils/storage";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  verifyRegistration: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendOtp: (phone: string, purpose: "register" | "reset") => Promise<void>;
  resetPassword: (payload: {
    phone: string;
    code: string;
    newPassword: string;
  }) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeSplash: () => void;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  splashDone: false,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const bootstrap = useCallback(async () => {
    try {
      const session = await getSession();
      if (session.token) {
        const { data } = await api.get("/user");
        setState({ user: data, loading: false, splashDone: false });
        return;
      }
    } catch (error) {
      await clearSession();
    }
    setState({ user: null, loading: false, splashDone: false });
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    await saveSession(data.token, data.user);
    setState((prev) => ({ ...prev, user: data.user }));
  };

  const register = async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    await api.post("/auth/register", payload);
  };

  const verifyRegistration = async (phone: string, code: string) => {
    const { data } = await api.post("/auth/verify-otp", {
      phone,
      code,
      purpose: "register",
    });
    await saveSession(data.token, data.user);
    setState((prev) => ({ ...prev, user: data.user }));
  };

  const logout = async () => {
    await clearSession();
    setState((prev) => ({ ...prev, user: null }));
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/user");
    const session = await getSession();
    if (session.token) {
      await saveSession(session.token, data);
    }
    setState((prev) => ({ ...prev, user: data }));
  };

  const forgotPassword = async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  };

  const resendOtp = async (phone: string, purpose: "register" | "reset") => {
    await api.post("/auth/send-otp", { phone, purpose });
  };

  const resetPassword = async (payload: {
    phone: string;
    code: string;
    newPassword: string;
  }) => {
    await api.post("/auth/reset-password", payload);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const { data } = await api.put("/user/update", updates);
    setState((prev) => ({ ...prev, user: data }));
    const session = await getSession();
    if (session.token) {
      await saveSession(session.token, data);
    }
  };

  const completeSplash = () => {
    setState((prev) => ({ ...prev, splashDone: true }));
  };

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    verifyRegistration,
    logout,
    refreshProfile,
    forgotPassword,
    resendOtp,
    resetPassword,
    updateProfile,
    completeSplash,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};









