import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ResponseDTO, ApiError } from '../types/api';
import { getStoredToken } from '../context/AuthContext';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Configure a URL base da API - ajuste conforme seu ambiente
    this.baseURL = 'http://localhost:8080/sensorama/api'; // Ajuste para sua URL

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor para requests
    this.api.interceptors.request.use(
      async (config: any) => {
        // Adiciona token se existir
        const token = await getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'Erro desconhecido',
          status: error.response?.status || 500,
          code: error.code,
        };

        if (error.response?.data) {
          // Se o backend retornar uma mensagem de erro estruturada
          const backendError = error.response.data as any;
          apiError.message = backendError.message || backendError.error || apiError.message;
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Método genérico para extrair dados do ResponseDTO
   */
  private extractData<T>(response: AxiosResponse<ResponseDTO<T>>): T {
    return response.data.data;
  }

  /**
   * Método GET genérico
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.api.get<ResponseDTO<T>>(endpoint);
    return this.extractData(response);
  }

  /**
   * Método POST genérico
   */
  async post<T, D = any>(endpoint: string, data?: D): Promise<T> {
    const response = await this.api.post<ResponseDTO<T>>(endpoint, data);
    return this.extractData(response);
  }

  /**
   * Método PUT genérico
   */
  async put<T, D = any>(endpoint: string, data?: D): Promise<T> {
    const response = await this.api.put<ResponseDTO<T>>(endpoint, data);
    return this.extractData(response);
  }

  /**
   * Método DELETE genérico
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<ResponseDTO<T>>(endpoint);
    return this.extractData(response);
  }

  /**
   * Método PATCH genérico
   */
  async patch<T, D = any>(endpoint: string, data?: D): Promise<T> {
    const response = await this.api.patch<ResponseDTO<T>>(endpoint, data);
    return this.extractData(response);
  }

  /**
   * Método para atualizar o token
   */
  setToken(token: string): void {
    this.api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * Método para remover o token
   */
  removeToken(): void {
    delete this.api.defaults.headers.Authorization;
  }
}

// Exporta uma instância única (singleton)
export const apiService = new ApiService();
export default apiService;
