'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import Axios from '../../utils/Axios';
import summeryApi from '../common/summeryApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize the router

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setLoading(false);
    router.push('/login'); // Redirect to login page
  }, [router]);

  const fetchUserDetails = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      setLoading(false);
      setUser(null);
      // Optional: if you want to force login when no token is found
      // router.push('/login'); 
      return;
    }

    try {
      const response = await Axios(summeryApi.userDetails);

      if (response.data.success) {
        // Correctly drilling into the nested data from your console logs
        setUser(response.data.data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Authentication Error:", error?.response?.data?.message || error.message);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserDetails, loading, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};