import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import FooterRed from '@/components/Footer/FooterRed';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import HeaderRed from '../../components/Header/HeaderRed';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuizImageScreenProps {
  question?: string;
  options?: Option[];
  timeLimit?: number;
  imageSource?: any;
}

const QuizImageScreen: React.FC<QuizImageScreenProps> = ({
  question = "pixelado",
  options = [
    { id: 1, text: "Opção #1", isCorrect: false },
    { id: 2, text: "Opção #1", isCorrect: false },
    { id: 3, text: "Opção #1", isCorrect: true },
    { id: 4, text: "Opção #1", isCorrect: false },
  ],
  timeLimit = 15,
  imageSource = null
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null); 
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAnswered]);

  const selectOption = (optionId: number) => {
    if (!isAnswered) {
      setSelectedOption(optionId);
    }
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowAnswer(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      Alert.alert('Atenção', 'Por favor, selecione uma opção!');
      return;
    }

    if (!showAnswer) {
      setShowAnswer(true);
      setIsAnswered(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      Alert.alert('Próxima Pergunta', 'Implementar navegação para próxima pergunta');
    }
  };

  const getOptionStyle = (option: Option) => {
    if (!showAnswer) {
      return selectedOption === option.id ? styles.optionSelected : styles.optionDefault;
    }
    
    if (option.isCorrect) {
      return styles.optionCorrect;
    } else if (selectedOption === option.id && !option.isCorrect) {
      return styles.optionIncorrect;
    }
    
    return styles.optionDefault;
  };

  const getOptionTextStyle = (option: Option) => {
    if (!showAnswer) {
      return selectedOption === option.id ? styles.optionTextSelected : styles.optionTextDefault;
    }
    
    if (option.isCorrect || (selectedOption === option.id && !option.isCorrect)) {
      return styles.optionTextSelected;
    }
    
    return styles.optionTextDefault;
  };

  return (
    <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <HeaderRed/>      

      <View style={styles.content}>
        {/* Image Display */}
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image 
              source={imageSource} 
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>IMAGEM</Text>
            </View>
          )}
          
          {/* Pixelated overlay effect */}
          <View style={styles.pixelOverlay} />
        </View>

        {/* Question Section */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>Pixelado</Text>
          <Text style={styles.timer}>{timeLeft}s</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionButton, getOptionStyle(option)]}
              onPress={() => selectOption(option.id)}
              disabled={isAnswered}
            >
              <Text style={getOptionTextStyle(option)}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[
              styles.nextButton,
              selectedOption === null && styles.nextButtonDisabled
            ]}
            onPress={handleNextQuestion}
            disabled={selectedOption === null}
          >
            <Text style={styles.nextButtonText}>
              {showAnswer ? 'Continuar' : 'Próxima'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FooterRed/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    height: 200,
    marginBottom: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#c0c0c0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  pixelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(187, 187, 187, 0.3)',
    borderRadius: 12,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionTitle: {
    color: '#dc2626',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  timer: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: '500',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
  },
  optionDefault: {
    backgroundColor: 'white',
    borderColor: '#ef4444',
  },
  optionSelected: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  optionCorrect: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  optionIncorrect: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  optionTextDefault: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  controlsContainer: {
    width: '100%',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizImageScreen;