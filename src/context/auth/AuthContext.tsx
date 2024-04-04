// AuthContext.tsx
import React from 'react';
import { AuthContextProps } from '../../types';
const AuthContext = React.createContext<AuthContextProps>({
    user: null,
    logout: () => {},
    loading: false,
    error: null,
    ormas: null,
    setOrmas: (event) => {},
    updateUser: () => {},
    setViewedEvents: (event) => {},
    event: null,
    fetchName: () => {},
    setEvent: (event) => {},
    userName: '',
    setUserName: (name) => {},
    fetchMyOrmas:()=>{},
    myOrmas:null
});

export default AuthContext;
