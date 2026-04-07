import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialData } from '../data/dashboardData';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

const initialModalState = {
  purchase: false,
  stock: false,
  customer: false,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  try {
    const { headers, ...restOptions } = options;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(headers ?? {}),
      },
    });

    const responseText = await response.text();
    let payload = null;

    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(payload?.message || responseText || 'Request failed');
    }

    return payload;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Cannot connect to API at ${API_BASE_URL}. Make sure the local server is running.`);
    }

    throw error;
  }
}

export function AppProvider({ children }) {
  const { token, isAuthenticated, logout } = useAuth();
  const [modalState, setModalState] = useState(initialModalState);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openModal = (name) => setModalState((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModalState((prev) => ({ ...prev, [name]: false }));

  const refreshData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const payload = await request('/bootstrap', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(payload);
      setError('');
    } catch (fetchError) {
      if (fetchError.message.includes('session') || fetchError.message.includes('Authentication')) {
        logout();
      }
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAuthenticated, token]);

  const submitResource = async (path, payload, modalName) => {
    setSaving(true);

    try {
      await request(path, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      await refreshData();
      closeModal(modalName);
    } catch (submitError) {
      if (submitError.message.includes('session') || submitError.message.includes('Authentication')) {
        logout();
      }
      setError(submitError.message);
      throw submitError;
    } finally {
      setSaving(false);
    }
  };

  const createPurchase = (payload) => submitResource('/purchases', payload, 'purchase');
  const createStock = (payload) => submitResource('/stocks', payload, 'stock');
  const createCustomer = (payload) => submitResource('/shops', payload, 'customer');

  const markCreditAsPaid = async (invoice) => {
    setSaving(true);

    try {
      await request(`/credits/${encodeURIComponent(invoice)}/pay`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await refreshData();
      setError('');
    } catch (submitError) {
      if (submitError.message.includes('session') || submitError.message.includes('Authentication')) {
        logout();
      }
      setError(submitError.message);
      throw submitError;
    } finally {
      setSaving(false);
    }
  };

  const value = useMemo(
    () => ({
      modalState,
      openModal,
      closeModal,
      data,
      loading,
      saving,
      error,
      refreshData,
      createPurchase,
      createStock,
      createCustomer,
      markCreditAsPaid,
    }),
    [modalState, data, loading, saving, error],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
}
