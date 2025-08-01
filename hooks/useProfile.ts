import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import authService, { UpdateProfileData } from '../services/authService';
import { Profile } from '../types/api';
import { useAuth } from '../context/AuthContext';

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuth();

  const refreshProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await authService.getUserProfile();
      setProfile(profileData);
    } catch (err) {
      const errorMessage = 'Erro ao carregar perfil';
      setError(errorMessage);
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await authService.updateUserProfile(data);
      setProfile(updatedProfile);
      
      // Atualiza o contexto se o nome foi alterado
      if (data.name && user) {
        updateUser({
          ...user,
          username: data.name,
        });
      }
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      const errorMessage = 'Erro ao atualizar perfil';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao atualizar perfil:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  const updateProfileName = useCallback(async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.updateUserName(name);
      
      // Atualiza o state local
      if (profile) {
        setProfile({ ...profile, name });
      }
      
      // Atualiza o contexto
      if (user) {
        updateUser({
          ...user,
          username: name,
        });
      }
      
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (err) {
      const errorMessage = 'Erro ao atualizar nome';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao atualizar nome:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, user, updateUser]);

  // Carrega o perfil quando o component monta
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
    updateProfile,
    updateProfileName,
  };
}

// Hook para buscar perfil de outros usuários
interface UseOtherProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  loadProfile: (userId: string) => Promise<void>;
  updateOtherProfile: (userId: string, data: UpdateProfileData) => Promise<void>;
  updateOtherProfileName: (userId: string, name: string) => Promise<void>;
}

export function useOtherProfile(): UseOtherProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await authService.getProfileById(userId);
      setProfile(profileData);
    } catch (err) {
      const errorMessage = 'Erro ao carregar perfil';
      setError(errorMessage);
      console.error('Erro ao carregar perfil:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOtherProfile = useCallback(async (userId: string, data: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await authService.updateProfileById(userId, data);
      setProfile(updatedProfile);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      const errorMessage = 'Erro ao atualizar perfil';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao atualizar perfil:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOtherProfileName = useCallback(async (userId: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.updateProfileNameById(userId, name);
      
      // Atualiza o state local
      if (profile) {
        setProfile({ ...profile, name });
      }
      
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (err) {
      const errorMessage = 'Erro ao atualizar nome';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao atualizar nome:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateOtherProfile,
    updateOtherProfileName,
  };
}
