'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from '../../utils/Axios';
import summeryApi from '../common/summeryApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Assuming you have a 'userDetails' endpoint in your summaryApi
        const response = await Axios({
            ...summeryApi.userDetails, 
            headers: { 
            // Make sure 'Authorization' is spelled correctly and includes 'Bearer '
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
            }
        });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem('accessToken'); // Clear invalid tokens
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserDetails, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);