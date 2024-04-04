// AuthProvider.js
import React, { useState, useEffect } from 'react';
import { checkAuth} from '../../components/login/services/authApi'
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface AuthValidProvider {
  children: React.ReactNode;
}

const AuthValidator = ({ children }: AuthValidProvider) => {
  const [userState, setUser] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const { user, error } = await checkAuth();
      setUser(user ? true : false);
    };
    initializeAuth();
  }, []);

  if (userState === null) {
    // Maybe some loading indicator while the auth state is unknown
    return <div>
    <div className="loadingPage">
       <FontAwesomeIcon style={{fontSize: '60px'}} icon={faSpinner} spin />
    </div></div>;
  } else if (!userState) {
    // Redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthValidator;
