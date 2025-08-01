import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
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
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estados para dados das APIs
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  
  // Estados de loading
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const genders = ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'];
  const roles = ['DEV', 'ADMIN', 'USER'];
  const statuses = ['ACTIVE', 'INACTIVE'];

  // Carregar países quando o componente é montado
  useEffect(() => {
    loadCountries();
  }, []);

  // Carregar estados quando um país é selecionado
  useEffect(() => {
    if (selectedCountryCode) {
      loadStates(selectedCountryCode);
      // Reset state e city quando país muda
      setState('');
      setCity('');
      setSelectedStateCode('');
      setCities([]);
    }
  }, [selectedCountryCode]);

  // Carregar cidades quando um estado é selecionado
  useEffect(() => {
    if (selectedStateCode) {
      loadCities(selectedStateCode);
      // Reset city quando estado muda
      setCity('');
    }
  }, [selectedStateCode]);

  // Função para carregar países
  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
      const data = await response.json();
      
      // Ordenar países por nome
      const sortedCountries = data
        .map(country => ({
          name: country.name.common,
          code: country.cca2
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setCountries(sortedCountries);
    } catch (error) {
      console.error('Erro ao carregar países:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de países');
    } finally {
      setLoadingCountries(false);
    }
  };

  // Função para carregar estados (específico para Brasil)
  const loadStates = async (countryCode) => {
    if (countryCode !== 'BR') {
      // Para outros países, usar uma lista genérica ou API diferente
      setStates([]);
      return;
    }

    setLoadingStates(true);
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const data = await response.json();
      
      // Ordenar estados por nome
      const sortedStates = data
        .map(state => ({
          name: state.nome,
          code: state.id
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setStates(sortedStates);
    } catch (error) {
      console.error('Erro ao carregar estados:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de estados');
    } finally {
      setLoadingStates(false);
    }
  };

  // Função para carregar cidades
  const loadCities = async (stateCode) => {
    setLoadingCities(true);
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios`);
      const data = await response.json();
      
      // Ordenar cidades por nome
      const sortedCities = data
        .map(city => city.nome)
        .sort((a, b) => a.localeCompare(b));
      
      setCities(sortedCities);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de cidades');
    } finally {
      setLoadingCities(false);
    }
  };

  // Função para formatar telefone
  const formatPhone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]}-${match[3]}`;
    }
    return text;
  };

  // Função para formatar CPF
  const formatCPF = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return text;
  };

  // Função para validar CPF
  const isValidCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleaned)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    
    return firstDigit === parseInt(cleaned[9]) && secondDigit === parseInt(cleaned[10]);
  };

  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setPhone(formatPhone(cleaned));
    }
  };

  const handleCPFChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setCpf(formatCPF(cleaned));
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  // Handlers para seleção
  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry.name);
    setSelectedCountryCode(selectedCountry.code);
  };

  const handleStateSelect = (selectedState) => {
    setState(selectedState.name);
    setSelectedStateCode(selectedState.code);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
  };

  const handleRegister = () => {
    if (!user || !email || !password || !confirmPassword || !country || !state || !city || !gender || !phone || !cpf || !role || !status) {
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

    // Validação de telefone
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      Alert.alert('Erro', 'Por favor, insira um telefone válido (11 dígitos)');
      return;
    }

    // Validação de CPF
    if (!isValidCPF(cpf)) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido');
      return;
    }

    Alert.alert('Cadastro', `Cadastro realizado com sucesso!\nUsuário: ${user}\nEmail: ${email}\nGênero: ${gender}\nTelefone: ${phone}\nData de Nascimento: ${formatDate(birthDate)}\nCPF: ${cpf}\nPaís: ${country}\nEstado: ${state}\nCidade: ${city}\nPapel: ${role}\nStatus: ${status}`);
  };

  const handleLogin = () => {
    router.push('/(tabs)');
  };

  const handleImagePicker = async () => {
    try {
      // Solicitar permissões
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar sua galeria de fotos.'
        );
        return;
      }

      Alert.alert(
        'Selecionar Foto',
        'Escolha uma opção:',
        [
          {
            text: 'Câmera',
            onPress: () => openCamera(),
          },
          {
            text: 'Galeria',
            onPress: () => openGallery(),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao acessar as imagens.');
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar sua câmera.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao abrir a câmera.');
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao abrir a galeria.');
    }
  };

  const SelectionModal = ({ visible, onClose, title, data, onSelect, loading, isCountryModal = false, isStateModal = false }) => (
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
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1a237e" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isCountryModal 
                  ? 'Nenhum país disponível' 
                  : isStateModal 
                    ? 'Selecione um país primeiro'
                    : 'Selecione um estado primeiro'
                }
              </Text>
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
                  <Text style={styles.modalItemText}>
                    {isCountryModal || isStateModal ? item.name : item}
                  </Text>
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
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>+</Text>
                  <Text style={styles.imagePlaceholderSubtext}>Foto de perfil</Text>
                </View>
              )}
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

            <Text style={styles.label}>Gênero</Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={[styles.selectText, !gender && styles.placeholder]}>
                {gender || 'Selecione o gênero'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="xx xxxxx-xxxx"
              keyboardType="numeric"
              maxLength={13}
            />

            <Text style={styles.label}>Data de Nascimento</Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.selectText}>
                {formatDate(birthDate)}
              </Text>
              <Ionicons name="calendar" size={20} color="#666" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={handleCPFChange}
              placeholder="xxx.xxx.xxx-xx"
              keyboardType="numeric"
              maxLength={14}
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
              style={[styles.selectInput, !selectedCountryCode && styles.disabledInput]} 
              onPress={() => selectedCountryCode && setShowStateModal(true)}
              disabled={!selectedCountryCode}
            >
              <Text style={[styles.selectText, !state && styles.placeholder]}>
                {state || (selectedCountryCode ? 'Selecione o estado' : 'Selecione um país primeiro')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={selectedCountryCode ? "#666" : "#ccc"} />
            </TouchableOpacity>

            <Text style={styles.label}>Cidade</Text>
            <TouchableOpacity 
              style={[styles.selectInput, !selectedStateCode && styles.disabledInput]} 
              onPress={() => selectedStateCode && setShowCityModal(true)}
              disabled={!selectedStateCode}
            >
              <Text style={[styles.selectText, !city && styles.placeholder]}>
                {city || (selectedStateCode ? 'Selecione a cidade' : 'Selecione um estado primeiro')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={selectedStateCode ? "#666" : "#ccc"} />
            </TouchableOpacity>

            <Text style={styles.label}>Papel</Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowRoleModal(true)}
            >
              <Text style={[styles.selectText, !role && styles.placeholder]}>
                {role || 'Selecione o papel'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.label}>Status</Text>
            <TouchableOpacity 
              style={styles.selectInput} 
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={[styles.selectText, !status && styles.placeholder]}>
                {status || 'Selecione o status'}
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
          onSelect={handleCountrySelect}
          loading={loadingCountries}
          isCountryModal={true}
        />

        <SelectionModal
          visible={showStateModal}
          onClose={() => setShowStateModal(false)}
          title="Selecionar Estado"
          data={states}
          onSelect={handleStateSelect}
          loading={loadingStates}
          isStateModal={true}
        />

        <SelectionModal
          visible={showCityModal}
          onClose={() => setShowCityModal(false)}
          title="Selecionar Cidade"
          data={cities}
          onSelect={handleCitySelect}
          loading={loadingCities}
        />

        <SelectionModal
          visible={showGenderModal}
          onClose={() => setShowGenderModal(false)}
          title="Selecionar Gênero"
          data={genders}
          onSelect={setGender} loading={undefined}        />

        <SelectionModal
          visible={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          title="Selecionar Papel"
          data={roles}
          onSelect={setRole} loading={undefined}        />

        <SelectionModal
          visible={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title="Selecionar Status"
          data={statuses}
          onSelect={setStatus} loading={undefined}        />
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
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
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#1a237e',
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});