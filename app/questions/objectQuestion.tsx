import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import FooterBlue from '@/components/Footer/FooterBlue';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderBlue from '../../components/Header/HeaderBlue';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuizAudioScreenProps {
  question?: string;
  options?: Option[];
  audioDuration?: number;
  timeLimit?: number;
}

const QuizAudioScreen: React.FC<QuizAudioScreenProps> = ({
  question = "Qual é o objeto",
  options = [
    { id: 1, text: "Opção #1", isCorrect: false },
    { id: 2, text: "Opção #2", isCorrect: false },
    { id: 3, text: "Opção #3", isCorrect: true },
    { id: 4, text: "Opção #4", isCorrect: false },
  ],
  audioDuration = 15,
  timeLimit = 15
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(0); 
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef<number>((audioProgress / 100) * audioDuration);

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

  // Audio progress simulation
  useEffect(() => {
    if (isPlaying) {
      audioRef.current = setInterval(() => {
        setAudioProgress(prev => {
          const newTime = currentTimeRef.current + 0.1;
          if (newTime >= audioDuration) {
            setIsPlaying(false);
            return 100;
          }
          currentTimeRef.current = newTime;
          return (newTime / audioDuration) * 100;
        });
      }, 100);
    } else {
      if (audioRef.current) {
        clearInterval(audioRef.current);
      }
    }

    return () => {
      if (audioRef.current) {
        clearInterval(audioRef.current);
      }
    };
  }, [isPlaying, audioDuration]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressBarPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = Dimensions.get('window').width - 120; // Approximate width
    const newProgress = Math.max(0, Math.min(100, (locationX / progressBarWidth) * 100));
    
    setAudioProgress(newProgress);
    currentTimeRef.current = (newProgress / 100) * audioDuration;
  };

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

  const replayAudio = () => {
    setAudioProgress(0);
    currentTimeRef.current = 0;
    setIsPlaying(true);
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
        <HeaderBlue/>      

      <View style={styles.content}>
        {/* Audio Player */}
        <View style={styles.audioPlayer}>
          <TouchableOpacity onPress={toggleAudio} style={styles.audioButton}>
            <Ionicons 
              name={isPlaying ? "pause" : "volume-high"} 
              size={32} 
              color="#1a237e" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.progressContainer}
            onPress={handleProgressBarPress}
            activeOpacity={0.8}
          >
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${audioProgress}%` }
                ]} 
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Question Section */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>{question}</Text>
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
            style={styles.replayButton}
            onPress={replayAudio}
          >
            <Text style={styles.replayButtonText}>Ouvir Novamente</Text>
          </TouchableOpacity>
          
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
      <FooterBlue/>
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
  audioPlayer: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  audioButton: {
    marginRight: 15,
  },
  progressContainer: {
    flex: 1,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#c0c0c0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a237e',
    borderRadius: 4,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionTitle: {
    color: '#1a237e',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  timer: {
    color: '#1a237e',
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
    borderColor: '#1a237e',
  },
  optionSelected: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
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
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  replayButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  replayButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1a237e',
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

export default QuizAudioScreen;