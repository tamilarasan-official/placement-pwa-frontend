import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    department: string,
    roll_number: string
  ) => Promise<{ message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authService.getMe()
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
      } else {
        throw new Error(res.error || 'Login failed');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        // HTTP error (4xx/5xx) — extract server error message
        const axiosErr = err as { response?: { data?: { error?: string; status?: string } } };
        const errMsg = axiosErr.response?.data?.error || 'Login failed';
        throw new Error(errMsg);
      }
      if (err && typeof err === 'object' && 'request' in err) {
        // Network error — request was made but no response received
        throw new Error('Network error: Unable to reach server. Please try again.');
      }
      throw err instanceof Error ? err : new Error('Login failed');
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    department: string,
    roll_number: string
  ): Promise<{ message: string }> => {
    try {
      const res = await authService.register(name, email, password, department, roll_number);
      if (res.success) {
        // No auto-login for students - account is pending approval
        return { message: res.message || 'Registration successful. Your account is pending TPO approval.' };
      } else {
        throw new Error(res.error || 'Registration failed');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        const errMsg = axiosErr.response?.data?.error || 'Registration failed';
        throw new Error(errMsg);
      }
      if (err && typeof err === 'object' && 'request' in err) {
        throw new Error('Network error: Unable to reach server. Please try again.');
      }
      throw err instanceof Error ? err : new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
