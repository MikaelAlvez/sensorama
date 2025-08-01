import { AuthRequestDTO, LoginResponse, UserRegistrationRequest } from '../types/api';
import apiService from './apiService';
import { TokenUtils } from '../utils/tokenUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@sensorama_token';

export class AuthService {
  /**
   * Realiza o login do usuário
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const authRequest: AuthRequestDTO = {
      username,
      password,
    };

    try {
      const response = await apiService.post<LoginResponse, AuthRequestDTO>(
        '/public/users/login',
        authRequest
      );
      
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Realiza o registro de um novo usuário
   */
  async register(userInfo: UserRegistrationRequest): Promise<any> {
    try {
      const response = await apiService.post<any, UserRegistrationRequest>(
        '/public/users/register',
        userInfo
      );
      
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  /**
   * Busca os dados do perfil do usuário atual usando o profileId do token
   */
  async getUserProfile(): Promise<any> {
    try {
      // Busca o token salvo
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Extrai o profileId do token
      const profileId = TokenUtils.getProfileIdFromToken(token);
      if (!profileId) {
        throw new Error('ProfileId não encontrado no token');
      }

      // Busca o perfil usando o profileId
      const response = await apiService.get(`/profiles/${profileId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados do perfil do usuário usando o profileId do token
   */
  async updateUserProfile(userData: any): Promise<any> {
    try {
      // Busca o token salvo
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Extrai o profileId do token
      const profileId = TokenUtils.getProfileIdFromToken(token);
      if (!profileId) {
        throw new Error('ProfileId não encontrado no token');
      }

      // Atualiza o perfil usando o profileId
      const response = await apiService.put(`/profiles/${profileId}`, userData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza apenas o nome do usuário usando o profileId do token
   */
  async updateUserName(newName: string): Promise<any> {
    try {
      // Busca o token salvo
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Extrai o profileId do token
      const profileId = TokenUtils.getProfileIdFromToken(token);
      if (!profileId) {
        throw new Error('ProfileId não encontrado no token');
      }

      // Atualiza apenas o nome usando o profileId
      const response = await apiService.patch(`/profiles/${profileId}/update-name?newName=${encodeURIComponent(newName)}`);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar nome do usuário:', error);
      throw error;
    }
  }

  /**
   * Busca perfil por ID específico
   */
  async getProfileById(profileId: string): Promise<any> {
    try {
      const response = await apiService.get(`/profiles/${profileId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar perfil por ID:', error);
      throw error;
    }
  }

  /**
   * Atualiza perfil por ID (admin)
   */
  async updateProfileById(profileId: string, userData: UpdateProfileData): Promise<any> {
    try {
      const response = await apiService.put(`/profiles/${profileId}`, userData);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar perfil por ID:', error);
      throw error;
    }
  }

  /**
   * Atualiza nome de perfil por ID (admin)
   */
  async updateProfileNameById(profileId: string, newName: string): Promise<any> {
    try {
      const response = await apiService.patch(`/profiles/${profileId}/update-name?newName=${encodeURIComponent(newName)}`);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar nome do perfil por ID:', error);
      throw error;
    }
  }
}

// Interface para dados de atualização de perfil
export interface UpdateProfileData {
  name?: string;
  phone?: string;
  birthDate?: string; // formato: YYYY-MM-DD
  photo?: string;
}

// Exporta uma instância única
export const authService = new AuthService();
export default authService;
