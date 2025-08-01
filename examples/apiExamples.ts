/**
 * Exemplo de como testar a integração com a API
 * Este arquivo demonstra como usar os serviços criados
 */

import authService from '../services/authService';
import apiService from '../services/apiService';

// Exemplo 1: Teste de Login
export const testLogin = async () => {
  try {
    console.log('Testando login...');
    const result = await authService.login('test_user', 'test_password');
    console.log('Login bem-sucedido:', result);
    return result;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Exemplo 2: Teste de Registro
export const testRegister = async () => {
  try {
    console.log('Testando registro...');
    const userData = {
      username: 'novo_usuario',
      email: 'novo@exemplo.com',
      password: 'senha123'
    };
    
    const result = await authService.register(userData);
    console.log('Registro bem-sucedido:', result);
    return result;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

// Exemplo 3: Chamada direta ao apiService
export const testDirectApiCall = async () => {
  try {
    console.log('Testando chamada direta à API...');
    // Exemplo: buscar dados do usuário atual
    const userData = await apiService.get('/users/current');
    console.log('Dados do usuário:', userData);
    return userData;
  } catch (error) {
    console.error('Erro na chamada à API:', error);
    throw error;
  }
};

// Exemplo 4: Como configurar a URL da API dinamicamente
export const configureApiUrl = (newUrl: string) => {
  console.log(`Configurando nova URL da API: ${newUrl}`);
  // Você pode implementar lógica para mudar a URL base se necessário
  // Por exemplo, para alternar entre desenvolvimento e produção
};

// Exemplo 5: Como verificar se está autenticado
export const checkAuthStatus = () => {
  const isAuth = authService.isAuthenticated();
  console.log('Usuário autenticado:', isAuth);
  return isAuth;
};

// Exemplo 6: Como fazer logout
export const performLogout = () => {
  console.log('Fazendo logout...');
  authService.logout();
  console.log('Logout realizado');
};
