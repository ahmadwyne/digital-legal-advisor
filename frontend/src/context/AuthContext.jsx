// import { createContext, useState, useEffect } from 'react';
// import { authApi } from '@/api/authApi';
// import { setTokens, clearTokens, getUser, isAuthenticated } from '@/utils/tokenManager';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(getUser());
//   const [loading, setLoading] = useState(true);
//   const [isAuth, setIsAuth] = useState(isAuthenticated());

//   // Check auth status on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       if (isAuthenticated()) {
//         try {
//           const response = await authApi.getCurrentUser();
//           setUser(response.data. user);
//           setIsAuth(true);
//         } catch (error) {
//           console.error('Auth check failed:', error);
//           clearTokens();
//           setUser(null);
//           setIsAuth(false);
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await authApi.login(email, password);
//       const { user, token, refreshToken } = response.data;
      
//       setTokens(token, refreshToken, user);
//       setUser(user);
//       setIsAuth(true);
      
//       return { success: true, user };
//     } catch (error) {
//       return { success: false, error };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await authApi. register(userData);
//       const { user, token, refreshToken } = response.data;
      
//       setTokens(token, refreshToken, user);
//       setUser(user);
//       setIsAuth(true);
      
//       return { success: true, user };
//     } catch (error) {
//       return { success: false, error };
//     }
//   };

//   const logout = async () => {
//     try {
//       await authApi.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       clearTokens();
//       setUser(null);
//       setIsAuth(false);
//     }
//   };

//   const updateUser = (updatedUser) => {
//     setUser(updatedUser);
//     setTokens(null, null, updatedUser);
//   };

//   const value = {
//     user,
//     isAuth,
//     loading,
//     login,
//     register,
//     logout,
//     updateUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { createContext, useState, useEffect } from 'react';
import { authApi } from '@/api/authApi';
import { setTokens, clearTokens, getUser, isAuthenticated, setUser as persistUser } from '@/utils/tokenManager';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await authApi.getCurrentUser();
          setUser(response.data. user);
          setIsAuth(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          clearTokens();
          setUser(null);
          setIsAuth(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      
      // Handle response structure from your backend
      const userData = response.data?. user || response.user;
      const token = response.data?.token || response.token;
      const refreshToken = response.data?.refreshToken || response.refreshToken;
      
      setTokens(token, refreshToken, userData);
      setUser(userData);
      setIsAuth(true);
      
      return { success: true, user:  userData };
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      // Return error details for toast handling
      return { 
        success: false, 
        error: {
          message: error.response?. data?.message || error.message,
          status: error.response?. status,
          response: error.response
        }
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      
      // Handle response structure from your backend
      const user = response.data?.user || response.user;
      const token = response.data?.token || response. token;
      const refreshToken = response.data?.refreshToken || response.refreshToken;
      
      setTokens(token, refreshToken, user);
      setUser(user);
      setIsAuth(true);
      
      return { success: true, user };
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      // Return error details for toast handling
      return { 
        success: false, 
        error:  {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          response: error.response
        }
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      setIsAuth(false);
    }
  };

  const loginWithGoogle = async (accessToken, refreshToken) => {
    try {
      setTokens(accessToken, refreshToken);
      const response = await authApi.getCurrentUser();
      const userData = response.data.user;
      persistUser(userData);
      setUser(userData);
      setIsAuth(true);
      return { success: true, user: userData };
    } catch (error) {
      clearTokens();
      setUser(null);
      setIsAuth(false);
      return { success: false };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    persistUser(updatedUser);
  };

  const value = {
    user,
    isAuth,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};