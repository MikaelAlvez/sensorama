import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';

import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Footer from '../../components/Footer/FooterBlue';
import Header from '../../components/Header/HeaderBlue';

const CategorySelectionScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionData, setQuestionData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: ''
  });

  const categories = [
    { 
      id: 'qual-objeto', 
      name: 'Qual Objeto', 
      isSelected: false,
      optionType: 'audio',
      optionLabel: 'Arquivo de Áudio'
    },
    { 
      id: 'pixelado', 
      name: 'Pixelado', 
      isSelected: false,
      optionType: 'image',
      optionLabel: 'Imagem'
    },
    { 
      id: 'mapa-mental', 
      name: 'Mapa Mental', 
      isSelected: false,
      optionType: 'audio',
      optionLabel: 'Arquivo de Áudio'
    },
    { 
      id: 'zoom-enigma', 
      name: 'Zoom Enigma', 
      isSelected: false,
      optionType: 'image',
      optionLabel: 'Imagem'
    },
    { 
      id: 'eco-logico', 
      name: 'Eco Lógico', 
      isSelected: false,
      optionType: 'audio',
      optionLabel: 'Arquivo de Áudio'
    }
  ];

  const handleCategorySelect = (categoryId: React.SetStateAction<string>) => {
    setSelectedCategory(categoryId);
    setShowQuestionForm(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setQuestionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (questionData.question && questionData.option1 && questionData.option2 && 
        questionData.option3 && questionData.option4 && questionData.correctAnswer) {
      
      const selectedCategoryData = categories.find(c => c.id === selectedCategory);
      
      console.log('Pergunta criada:', {
        category: selectedCategory,
        categoryName: selectedCategoryData?.name,
        optionType: selectedCategoryData?.optionType,
        ...questionData
      });
      
      Alert.alert('Sucesso', 'Pergunta criada com sucesso!');
      setQuestionData({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: ''
      });
      setShowQuestionForm(false);
      setSelectedCategory('');
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione a resposta correta.');
    }
  };

  const handleBack = () => {
    setShowQuestionForm(false);
    setSelectedCategory('');
    setQuestionData({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: ''
    });
  };

  const handleCancel = () => {
        router.push('/homePage/home');
    };

  const getCurrentCategory = () => {
    return categories.find(c => c.id === selectedCategory);
  };

  const renderOptionInput = (num: React.Key | null | undefined, currentCategory: { id: string; name: string; isSelected: boolean; optionType: string; optionLabel: string; } | undefined) => {
    const isAudioType = currentCategory?.optionType === 'audio';
    const isImageType = currentCategory?.optionType === 'image';

    return (
      <View key={num} style={styles.optionRow}>
        <TouchableOpacity
          onPress={() => handleInputChange('correctAnswer', `option${num}`)}
          style={styles.radioButton}
        >
          <View style={[
            styles.radioCircle,
            questionData.correctAnswer === `option${num}` && styles.radioCircleSelected
          ]}>
            {questionData.correctAnswer === `option${num}` && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.optionInputContainer}>
          {isAudioType ? (
            <View style={styles.fileInputContainer}>
              <TouchableOpacity style={styles.fileButton}>
                <Ionicons name="musical-note" size={20} color="#1a237e" />
                <Text style={styles.fileButtonText}>Selecionar Áudio</Text>
              </TouchableOpacity>
              <TextInput
                value={questionData[`option${num}`]}
                onChangeText={(value) => handleInputChange(`option${num}`, value)}
                style={styles.fileNameInput}
                placeholder={`Nome do áudio ${num}`}
              />
            </View>
          ) : isImageType ? (
            <View style={styles.fileInputContainer}>
              <TouchableOpacity style={styles.fileButton}>
                <Ionicons name="image" size={20} color="#1a237e" />
                <Text style={styles.fileButtonText}>Selecionar Imagem</Text>
              </TouchableOpacity>
              <TextInput
                value={questionData[`option${num}`]}
                onChangeText={(value) => handleInputChange(`option${num}`, value)}
                style={styles.fileNameInput}
                placeholder={`Nome da imagem ${num}`}
              />
            </View>
          ) : (
            <TextInput
              value={questionData[`option${num}`]}
              onChangeText={(value) => handleInputChange(`option${num}`, value)}
              style={styles.optionInput}
              placeholder={`Opção ${num}`}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header />
      <ScrollView style={styles.content}>
        {!showQuestionForm ? (
          <>
            <Text style={styles.title}>Escolha a Categoria</Text>

            {/* Lista de categorias */}
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategorySelect(category.id)}
                  style={[
                    styles.categoryButton,
                    category.isSelected ? styles.categoryButtonSelected : styles.categoryButtonDefault
                  ]}
                >
                  <View style={styles.categoryContent}>
                    <Text style={[
                      styles.categoryText,
                      category.isSelected ? styles.categoryTextSelected : styles.categoryTextDefault
                    ]}>
                      {category.name}
                    </Text>
                    <View style={styles.categoryTypeContainer}>
                      <Ionicons 
                        name={category.optionType === 'audio' ? 'headset' : 'image'} 
                        size={16} 
                        color={category.isSelected ? 'white' : '#1565c0'} 
                      />
                      <Text style={[
                        styles.categoryTypeText,
                        category.isSelected ? styles.categoryTextSelected : styles.categoryTextDefault
                      ]}>
                        {category.optionLabel}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.startButton}>
                <Ionicons name="play" size={24} color="white" style={styles.playIcon} />
                <Text style={styles.startButtonText}>INICIAR</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Formulário de pergunta */}
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  Criar Pergunta - {getCurrentCategory()?.name}
                </Text>
                <TouchableOpacity onPress={handleBack}>
                  <Text style={styles.backButton}>← Voltar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Pergunta:</Text>
                <TextInput
                  value={questionData.question}
                  onChangeText={(value) => handleInputChange('question', value)}
                  style={styles.questionInput}
                  placeholder="Digite sua pergunta aqui..."
                  multiline
                />
              </View>

              <Text style={styles.helpText}>
                * Selecione o círculo ao lado da opção correta
              </Text>

              {/* Opções de resposta */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Opções de Resposta ({getCurrentCategory()?.optionLabel}):
                </Text>
                
                {[1, 2, 3, 4].map((num) => renderOptionInput(num, getCurrentCategory()))}
              </View>


              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleBack} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Criar Pergunta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <Footer/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    height: 64,
  },
  menuButton: {
    width: 64,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorStrips: {
    flex: 1,
    flexDirection: 'row',
  },
  colorStrip: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    textAlign: 'center',
    color: '#1a237e',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 32,
  },
  categoriesContainer: {
    marginBottom: 32,
  },
  categoryButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
  },
  categoryButtonDefault: {
    backgroundColor: '#e3f2fd',
    borderColor: '#90caf9',
  },
  categoryButtonSelected: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  categoryContent: {
    flexDirection: 'column',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: 4,
  },
  categoryTextDefault: {
    color: '#1565c0',
  },
  categoryTextSelected: {
    color: 'white',
  },
  categoryTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTypeText: {
    fontSize: 12,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  buttons: {
    gap: 15,
  },
  startButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    marginRight: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    color: '#1a237e',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  backButton: {
    color: '#1565c0',
    fontSize: 16,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  questionInput: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  radioButton: {
    marginRight: 12,
    marginTop: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1565c0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#1a237e',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1a237e',
  },
  optionInputContainer: {
    flex: 1,
  },
  optionInput: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 16,
  },
  fileInputContainer: {
    flex: 1,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e3ff',
    marginBottom: 8,
  },
  fileButtonText: {
    marginLeft: 8,
    color: '#1a237e',
    fontSize: 14,
    fontWeight: '500',
  },
  fileNameInput: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1a237e',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategorySelectionScreen;