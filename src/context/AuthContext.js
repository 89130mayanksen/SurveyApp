import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AdminUserlogout } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // for splash/loader

  useEffect(() => {
    const loadRole = async () => {
      try {
        const role = await AsyncStorage.getItem('role');
        const token = await AsyncStorage.getItem('jwtToken');

        if (role && token) {
          setUserRole(role); // restore session
        }
      } catch (e) {
        console.log('Error loading session:', e);
      } finally {
        setLoading(false); // done checking
      }
    };

    loadRole();
  }, []);

  const login = async (role, token) => {
    console.log(role);
    await AsyncStorage.setItem('jwtToken', token);
    await AsyncStorage.setItem('role', role);
    setUserRole(role);
  };

  const logout = async () => {
    const result = await AdminUserlogout();
    console.log('====================================');
    console.log(result.success);
    console.log('====================================');
    if (result.success) {
      await AsyncStorage.removeItem('jwtToken');
      await AsyncStorage.removeItem('role');
      setUserRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
