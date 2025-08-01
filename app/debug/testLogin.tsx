import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export default function TestLoginScreen() {
  const [username, setUsername] = useState('dev');
  const [password, setPassword] = useState('dev');
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      
      // Chama o serviço de login
      const loginResponse = await authService.login(username, password);
      
      // Usa o contexto para processar o login
      await login(loginResponse);
      
      Alert.alert(
        'Sucesso',
        'Login realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/profile/mainProfile'),
          },
        ]
      );
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestProfile = async () => {
    try {
      setLoading(true);
      const profile = await authService.getUserProfile();
      Alert.alert(
        'Perfil Carregado',
        JSON.stringify(profile, null, 2),
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      Alert.alert('Erro', 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDebug = async () => {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const { TokenUtils } = await import('../../utils/tokenUtils');
      
      const token = await AsyncStorage.default.getItem('@sensorama_token');
      if (token) {
        const decoded = TokenUtils.decodeToken(token);
        Alert.alert(
          'Token Debug',
          JSON.stringify(decoded, null, 2),
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Debug', 'Token não encontrado');
      }
    } catch (error) {
      console.error('Erro ao debug do token:', error);
      Alert.alert('Erro', 'Erro ao debug do token');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Teste de Login com Token JWT</Text>

      {isAuthenticated && user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoTitle}>Usuário Logado:</Text>
          <Text style={styles.userInfoText}>ID: {user.id}</Text>
          <Text style={styles.userInfoText}>Username: {user.username}</Text>
          <Text style={styles.userInfoText}>ProfileId: {user.profileId || 'N/A'}</Text>
          <Text style={styles.userInfoText}>Roles: {user.roles?.join(', ') || 'N/A'}</Text>
        </View>
      )}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Fazer Login'}
          </Text>
        </TouchableOpacity>

        {isAuthenticated && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={handleTestProfile}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Carregando...' : 'Testar Perfil'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.debugButton]}
              onPress={handleGoToDebug}
            >
              <Text style={styles.buttonText}>Ver Debug do Token</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.profileButton]}
              onPress={() => router.push('/profile/mainProfile')}
            >
              <Text style={styles.buttonText}>Ir para Perfil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  userInfo: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d2e',
  },
  userInfoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2e7d2e',
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#2196F3',
  },
  testButton: {
    backgroundColor: '#4CAF50',
  },
  debugButton: {
    backgroundColor: '#FF9800',
  },
  profileButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
