'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Axios from '../../utils/Axios';
import summeryApi from '../common/summeryApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Use a ref to prevent multiple simultaneous fetches
  const isFetching = useRef(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setLoading(false);
    router.push('/login');
  }, [router]);

  const fetchUserDetails = useCallback(async () => {
    // Prevent overlapping requests
    if (isFetching.current) return;
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      isFetching.current = true;
      
      // Add a timestamp to bypass the 304 cache and get a fresh 200 OK
      const response = await Axios({
        ...summeryApi.userDetails,
        url: `${summeryApi.userDetails.url}?t=${Date.now()}` 
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        
        // Only update state if the data is actually different to prevent unnecessary renders
        setUser(prev => JSON.stringify(prev) === JSON.stringify(userData) ? prev : userData);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Auth Error:", error?.response?.data?.message || error.message);
      handleLogout();
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [handleLogout]); // router is indirectly here via handleLogout

  useEffect(() => {
    fetchUserDetails();
    // We only want this to run ONCE when the app mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserDetails, loading, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};