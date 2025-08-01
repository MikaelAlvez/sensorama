import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse } from '../types/api';
import { TokenUtils } from '../utils/tokenUtils';

interface User {
  id: string;
  username: string;
  email?: string;
  profileId?: string;
  roles?: string[];
  // Adicione outros campos do usuário conforme necessário
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginData: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@sensorama_token';
const USER_KEY = '@sensorama_user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados salvos no AsyncStorage ao inicializar
  useEffect(() => {
    loadStoredAuthData();
  }, []);

  const loadStoredAuthData = async () => {
    try {
      setIsLoading(true);
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
      // Se houver erro, limpa os dados possivelmente corrompidos
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginData: LoginResponse) => {
    try {
      setIsLoading(true);
      
      // Salva o token
      await AsyncStorage.setItem(TOKEN_KEY, loginData.token);
      setToken(loginData.token);

      // Extrai dados do usuário do token JWT
      const tokenPayload = TokenUtils.decodeToken(loginData.token);
      
      if (tokenPayload) {
        const userData: User = {
          id: tokenPayload.sub,
          username: tokenPayload.username,
          profileId: tokenPayload.profileId,
          roles: tokenPayload.roles,
        };
        
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
      } else if (loginData.user) {
        // Fallback para dados do usuário vindos diretamente da resposta
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(loginData.user));
        setUser(loginData.user);
      }

      console.log('Login realizado com sucesso. Token salvo:', loginData.token);
    } catch (error) {
      console.error('Erro ao salvar dados de login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Remove dados do AsyncStorage
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);

      // Limpa o estado
      setToken(null);
      setUser(null);
      
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    // Salva os dados atualizados
    AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)).catch(error => {
      console.error('Erro ao atualizar dados do usuário:', error);
    });
  };

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = Boolean(token && user);

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  }), [user, token, isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Função utilitária para obter o token (para usar nos serviços)
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
};
