/**
 * Configurações de ambiente para a API
 * Este arquivo centraliza as configurações da API para diferentes ambientes
 */

// Configurações para diferentes ambientes
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8080/sensorama/api',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://sua-api-producao.com/sensorama/api',
    timeout: 15000,
  },
  staging: {
    baseURL: 'https://staging-api.com/sensorama/api',
    timeout: 12000,
  }
};

// Função para detectar o ambiente atual
export const getCurrentEnvironment = (): keyof typeof API_CONFIG => {
  // Em React Native/Expo, você pode usar diferentes formas de detectar o ambiente
  // Por exemplo, através de variáveis de ambiente ou configurações
  
  // Para desenvolvimento local, você pode usar:
  if (__DEV__) {
    return 'development';
  }
  
  // Para produção, você pode verificar outras condições
  // Como o domínio atual, variáveis de ambiente, etc.
  return 'production';
};

// Função para obter a configuração atual
export const getApiConfig = () => {
  const env = getCurrentEnvironment();
  return API_CONFIG[env];
};

// Função para configurar a URL da API manualmente (útil para testes)
export const setCustomApiUrl = (url: string) => {
  // Esta função pode ser usada para sobrescrever a URL da API temporariamente
  console.log(`Configurando URL customizada da API: ${url}`);
  return {
    baseURL: url,
    timeout: 10000,
  };
};

/**
 * IMPORTANTE: Para usar essas configurações, modifique o arquivo apiService.ts:
 * 
 * import { getApiConfig } from '../config/apiConfig';
 * 
 * constructor() {
 *   const config = getApiConfig();
 *   this.baseURL = config.baseURL;
 *   
 *   this.api = axios.create({
 *     baseURL: this.baseURL,
 *     timeout: config.timeout,
 *     headers: {
 *       'Content-Type': 'application/json',
 *     },
 *   });
 * }
 */
