// AuthProvider.js
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AuthContext from './AuthContext';
import { User, AuthProviderProps, OrmaEvent } from '../../types';
import { checkAuth } from '../../components/login/services/authApi'
import axiosInstance from '../../api';
const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ormas, setOrmas] = useState<OrmaEvent[] | null>(null)
  const [event, setEvent] = useState<OrmaEvent | null>(null);
  const [userName, setUserName] = useState<string>(user?.name || 'Loading...');

  const [myOrmas,setMyOrmas] = useState<OrmaEvent[] | null>(null);

  useEffect(() => {setUserName(userName)}, [userName]);
  
  const fetchMyOrmas = async() =>{
    setLoading(true);
    try{
      const token = Cookies.get('token');
      const response = await axiosInstance.get(API_URL + '/users/allevents',{
        headers:{Authorization: `${token}`}
      });
      if(response.status === 200){
        setMyOrmas(response.data.allevents)
        setLoading(false)
      }
    }catch(err){
      console.log(err)
    }
  }
  
  const fetchName = async () => {
    const token = Cookies.get('token');    
    try {
      const response = await axiosInstance.get(API_URL + '/users/getProfile', {
        headers: { Authorization: `${token}` },
      });
      if (response) {
        setUserName(response.data.user.name.toString());
      } else {
        setUserName('Loading...');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { user, error } = await checkAuth();
      setUser(user);
      setError(error);
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const updateUser = async () => {
    setLoading(true);
    const { user, error } = await checkAuth();
    setLoading(false);
    setUser(user);
    setError(error);
  }

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    localStorage.removeItem('recent_viewed_api');
  };


  const setViewedEvents = (event: OrmaEvent | null) => {
    if (event === null) {
      setOrmas(null);
      localStorage.clear();
      return;
    }
    let local_ormas = localStorage.getItem('recent_ormas');
    if (local_ormas !== null) {
      let local_ormas_json: [OrmaEvent] = JSON.parse(local_ormas);
      let found = local_ormas_json.find((orma) => orma?.id === event?.id);
      if (!found) {
        let newOrmas = [event, ...local_ormas_json];
        setOrmas(newOrmas);
        localStorage.setItem('recent_ormas', JSON.stringify(newOrmas));
      }
    } else {
      let cookieString = JSON.stringify([event]);
      localStorage.setItem('recent_ormas', cookieString);
      setOrmas([event]);
    }
  }

  return (
    <AuthContext.Provider value={{ user, ormas, logout, loading, error, updateUser, setViewedEvents, fetchMyOrmas , event, setEvent, userName, setUserName, myOrmas, setOrmas, fetchName}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
