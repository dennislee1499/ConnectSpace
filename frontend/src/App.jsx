import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import { useAppStore } from './store';

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
