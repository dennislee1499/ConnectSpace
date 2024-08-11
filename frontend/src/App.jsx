import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import { useAppStore } from './store';
import { useState, useEffect } from 'react';
import apiClient from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const UnauthorizedRoute = ({ children }) => {
  const { userInfo } = useAppStore(); 
  const isAuthorized = !!userInfo; 
  return isAuthorized ? children : <Navigate to="/auth" />
}

const AuthorizedRoute = ({ children }) => {
  const { userInfo } = useAppStore(); 
  const isAuthorized = !!userInfo; 
  return isAuthorized ? <Navigate to="/chat" /> : children; 
}

const App = () => {
  const { userInfo, setUserInfo } = useAppStore(); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        console.log({res});
        if (res.status === 200 && res.data.user) {
          setUserInfo(res.data.user); 
        } else {
          setUserInfo(undefined);
        }
      } catch (err) {
        console.log({err})
      } finally {
        setLoading(false); 
      }
    }
    if (!userInfo) {
      getUserData(); 
    } else {
      setLoading(false); 
    }
  }, [userInfo, setUserInfo]); 

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={ 
            <AuthorizedRoute>
              <Auth />
            </AuthorizedRoute> 
          } 
        />
        <Route 
          path="/profile" 
          element={ 
            <UnauthorizedRoute>
              <Profile />
            </UnauthorizedRoute> 
          } 
        />
        <Route 
          path="/chat" 
          element={ 
            <UnauthorizedRoute>
              <Chat />
            </UnauthorizedRoute> 
          } 
        />
        <Route path="*" element={ <Navigate to="/auth" /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
