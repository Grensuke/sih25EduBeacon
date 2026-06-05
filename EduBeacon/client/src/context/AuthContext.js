import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Ensure cookies are sent with every request
axios.defaults.withCredentials = true;

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false
      };
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem('token');

  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: !!initialToken,
    user: null,
    token: initialToken,
    loading: true
  });

  // Setup Axios Interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Fallback: still send token in header if we have it in state
        if (state.token) {
          config.headers['Authorization'] = `Bearer ${state.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Centralized 401 handler
          dispatch({ type: 'LOGOUT' });
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [state.token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!state.token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const res = await axios.get('/api/auth/me');
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: res.data, token: state.token }
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        dispatch({ type: 'LOGIN_FAIL' });
      }
    };

    checkAuth();
  }, [state.token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        '/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const registerAdmin = async (name, email, password, organizationName) => {
    try {
      const res = await axios.post(
        '/api/auth/admin-register',
        { name, email, password, organizationName },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        registerAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
