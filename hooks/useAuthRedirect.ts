import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para verificar se o usuário está autenticado
 * e redirecionar automaticamente conforme necessário
 */
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Se está autenticado, pode redirecionar para home se necessário
      // Esta lógica pode ser chamada manualmente onde for apropriado
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook para verificar autenticação em páginas protegidas
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};
