import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = 'stepwise_admin_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function authRequest(path, options = {}) {
  try {
    const { headers, ...restOptions } = options;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(headers ?? {}),
      },
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || 'Authentication request failed');
    }

    return payload;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Cannot connect to API at ${API_BASE_URL}. Make sure the local server is running.`);
    }

    throw error;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(AUTH_STORAGE_KEY) || '');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(token));
  const [authError, setAuthError] = useState('');

  const persistSession = (nextToken, nextUser) => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken('');
    setUser(null);
  };

  const login = async (username, password) => {
    setAuthError('');
    const payload = await authRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    persistSession(payload.token, payload.user);
    return payload.user;
  };

  const logout = () => {
    clearSession();
    setAuthError('');
  };

  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      return;
    }

    let active = true;

    const restoreSession = async () => {
      setAuthLoading(true);

      try {
        const payload = await authRequest('/auth/session', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (active) {
          setUser(payload.user);
          setAuthError('');
        }
      } catch (error) {
        if (active) {
          clearSession();
          setAuthError(error.message);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      authLoading,
      authError,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, authLoading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
