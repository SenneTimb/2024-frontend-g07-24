import {
    createContext,
    useState,
    useCallback,
    useEffect,
    useMemo,
    useContext,
  } from 'react';
  import useSWRMutation from 'swr/mutation';
  import * as api from '../api/index';
  
  const JWT_TOKEN_KEY = 'jwtToken';
  const USER_ID_KEY = 'GEBRUIKERID';
  const AuthContext = createContext();
  
  export const useAuth = () => useContext(AuthContext);
  
  export const AuthProvider = ({ children }) => {
    const [ready, setReady] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    const [user, setUser] = useState({ id: storedUserId ? Number(storedUserId) : null });
  
    useEffect(() => {
      api.setAuthToken(token);
      setIsAuthed(Boolean(token));
  
      const storedUser = JSON.parse(localStorage.getItem(USER_ID_KEY));
      if (storedUser) {
        setUser(storedUser);
      }
  
      setReady(true);
    }, [token]);
  
    useEffect(() => {
      if (user && user.rol && user.rol === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }, [user]);
  
    const {
      isMutating: loginLoading,
      error: loginError,
      trigger: doLogin,
    } = useSWRMutation('users/login', api.login);
  
  
    const setSession = useCallback(
      (token, user) => {
        setToken(token);
        setUser(user);
  
        localStorage.setItem(JWT_TOKEN_KEY, token);
        localStorage.setItem(USER_ID_KEY, JSON.stringify(user));
      },
      [],
    );
  
    const login = useCallback(
      async (email, password, rol) => {
        try {
          const { token, user } = await doLogin({
            email,
            password,
            rol
          });
      
          setSession(token, user);
    
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
      [doLogin, setSession]
    );
    
  
    const logout = useCallback(() => {
      api.put('users/logout', {arg: null})
      
      setToken(null);
      setUser(null);
      
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }, []);
  
    const value = useMemo(
      () => ({
        token,
        user,
        error: loginError,
        ready,
        loading: loginLoading,
        isAdmin,
        isAuthed,
        login,
        logout,
      }),
      [token, user, loginError, ready, loginLoading, isAdmin, isAuthed, login, logout]
    );
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };