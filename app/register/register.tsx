import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Footer from '../../components/Footer/FooterBlue';
import Header from '../../components/Header/HeaderBlue';

export default function SensoramaRegister() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const countries = ['Brasil', 'Argentina', 'Uruguai', 'Paraguai', 'Chile', 'Bolivia', 'Colombia', 'Venezuela'];
  const states = ['RN', 'CE', 'PB', 'MA', 'PE', 'BA', 'PI', 'AL'];
  const cities = ['Mossoró', 'Natal'];

  const handleRegister = () => {
    if (!user || !email || !password || !confirmPassword || !country || !state || !city) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    Alert.alert('Cadastro', `Cadastro realizado com sucesso!\nUsuário: ${user}\nEmail: ${email}\nPaís: ${country}\nEstado: ${state}\nCidade: ${city}`);
  };

  const handleLogin = () => {
    router.push('/(tabs)');
  };

  const handleImagePicker = () => {
    Alert.alert('Foto de Perfil', 'Funcionalidade será implementada após instalar expo-image-picker');
  };

  const SelectionModal = ({ visible, onClose, title, data, onSelect, placeholder }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1a237e" />
            </TouchableOpacity>
          </View>
          
          {data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma opção disponível</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
        
        <Header/>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleSection}>
            <Text style={styles.title}>CADASTRO</Text>
          </View>

          <View style={styles.formSection}>
            <TouchableOpacity style={styles.imagePickerContainer} onPress={handleImagePicker}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>+</Text>
                <Text style={styles.imagePlaceholderSubtext}>Foto de perfil</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              value={user}
              onChangeText={setUser}
              placeholder=""
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <Text style={styles.label}>País</Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={[styles.selectText, !country && styles.placeholder]}>
                {country || 'Selecione o país'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.label}>Estado</Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowStateModal(true)}
            >
              <Text style={[styles.selectText, !state && styles.placeholder]}>
                {state || 'Selecione o estado'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.label}>Cidade</Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowCityModal(true)}
            >
              <Text style={[styles.selectText, !city && styles.placeholder]}>
                {city || 'Selecione a cidade'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder=""
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Confirme a senha</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder=""
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>CADASTRE-SE</Text>
            </TouchableOpacity>

            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Footer/>

        <SelectionModal
          visible={showCountryModal}
          onClose={() => setShowCountryModal(false)}
          title="Selecionar País"
          data={countries}
          onSelect={setCountry} placeholder={undefined}        />

        <SelectionModal
          visible={showStateModal}
          onClose={() => setShowStateModal(false)}
          title="Selecionar Estado"
          data={states}
          onSelect={setState} placeholder={undefined}        />

        <SelectionModal
          visible={showCityModal}
          onClose={() => setShowCityModal(false)}
          title="Selecionar Cidade"
          data={cities}
          onSelect={setCity} placeholder={undefined}        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  header: {
    height: 60,
    backgroundColor: '#1a237e',
  },
  footer: {
    height: 60,
    backgroundColor: '#1a237e',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a237e',
    letterSpacing: 2,
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
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    color: '#999',
  },
  registerButton: {
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
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    fontSize: 14,
    color: '#1a237e',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 30,
    color: '#999999',
    fontWeight: '300',
  },
  imagePlaceholderSubtext: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '60%',
    borderRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});