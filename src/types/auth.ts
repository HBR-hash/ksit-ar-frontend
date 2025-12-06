export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  splashDone: boolean;
}


