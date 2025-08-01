import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenUtils } from '../../utils/tokenUtils';

const TOKEN_KEY = '@sensorama_token';

export default function TokenDebugScreen() {
  const [tokenData, setTokenData] = useState<any>(null);
  const [rawToken, setRawToken] = useState<string>('');

  useEffect(() => {
    loadAndDecodeToken();
  }, []);

  const loadAndDecodeToken = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        setRawToken(token);
        const decoded = TokenUtils.decodeToken(token);
        setTokenData(decoded);
        
        console.log('Token completo:', token);
        console.log('Token decodificado:', decoded);
      }
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  };

  const handleRefresh = () => {
    loadAndDecodeToken();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug do Token JWT</Text>
      
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Recarregar Token</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Token Raw (primeiros 50 chars):</Text>
        <Text style={styles.tokenText}>
          {rawToken ? `${rawToken.substring(0, 50)}...` : 'Token não encontrado'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Token Decodificado:</Text>
        {tokenData ? (
          <View>
            <Text style={styles.dataText}>Sub (userId): {tokenData.sub || 'N/A'}</Text>
            <Text style={styles.dataText}>Username: {tokenData.username || 'N/A'}</Text>
            <Text style={styles.dataText}>ProfileId: {tokenData.profileId || 'N/A'}</Text>
            <Text style={styles.dataText}>Roles: {tokenData.roles ? tokenData.roles.join(', ') : 'N/A'}</Text>
            <Text style={styles.dataText}>Issued At: {tokenData.iat ? new Date(tokenData.iat * 1000).toLocaleString() : 'N/A'}</Text>
            <Text style={styles.dataText}>Expires At: {tokenData.exp ? new Date(tokenData.exp * 1000).toLocaleString() : 'N/A'}</Text>
          </View>
        ) : (
          <Text style={styles.dataText}>Token não decodificado</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados Completos do Token:</Text>
        <Text style={styles.jsonText}>
          {tokenData ? JSON.stringify(tokenData, null, 2) : 'Nenhum dado'}
        </Text>
      </View>
    </ScrollView>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  refreshButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  dataText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  jsonText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
  },
});
