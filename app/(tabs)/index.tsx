import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Footer from '../../components/Footer/FooterBlue';
import Header from '../../components/Header/HeaderBlue';
import authService from '../../services/authService';
import { ApiError } from '../../types/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redireciona para home se já estiver autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/homePage/home');
    }
  }, [isAuthenticated, isLoading]);

  const handleLogin = async () => {
    if (!user || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {
      // Faz o login via API
      const response = await authService.login(user, password);
      
      // Salva no contexto (que salva no AsyncStorage)
      await login(response);
      
      // Busca dados do perfil do usuário
      try {
        const userProfile = await authService.getUserProfile();
        console.log('Perfil do usuário carregado:', userProfile);
      } catch (profileError) {
        console.warn('Não foi possível carregar o perfil do usuário:', profileError);
        // Não bloqueia o login se falhar ao carregar o perfil
      }
      
      // Login bem-sucedido - navega para home
      Alert.alert(
        'Sucesso', 
        'Login realizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/homePage/home')
          }
        ]
      );
    } catch (error) {
      // Trata erro da API
      const apiError = error as ApiError;
      Alert.alert(
        'Erro no Login', 
        apiError.message || 'Erro desconhecido. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Image 
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>
            Uma Nova Maneira de Jogar e Aprender{'\n'}
            Quiz Interativo com Áudio e Imagem{'\n'}
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            value={user}
            onChangeText={setUser}
            placeholder=""
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder=""
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
          />

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'ENTRANDO...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerSection}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
  },
  logo: {
    width: 325,
    height: 325,
  },
  subtitle: {
    fontSize: 19,
    color: '#1a237e',
    textAlign: 'center',
    lineHeight: 25,
    fontWeight: 'bold',
  },
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loginButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#9e9e9e',
    elevation: 0,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    color: '#1a237e',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});