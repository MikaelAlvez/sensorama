import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Footer from '../../components/Footer/FooterOrange';
import Header from '../../components/Header/HeaderOrange';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface AudioPlayer {
  id: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
}

interface EcoLogicoQuizProps {
  question?: string;
  options?: Option[];
  timeLimit?: number;
}

const EcoLogicoQuiz: React.FC<EcoLogicoQuizProps> = ({
  question = "Eco Lógico",
  options = [
    { id: 1, text: "Opção #1", isCorrect: false },
    { id: 2, text: "Opção #1", isCorrect: false },
    { id: 3, text: "Opção #1", isCorrect: true },
    { id: 4, text: "Opção #1", isCorrect: false },
  ],
  timeLimit = 10
}) => {
  const [audioPlayers, setAudioPlayers] = useState<AudioPlayer[]>([
    { id: 1, isPlaying: false, progress: 0, duration: 15 },
    { id: 2, isPlaying: false, progress: 30, duration: 15 },
    { id: 3, isPlaying: false, progress: 0, duration: 15 },
  ]);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{[key: number]: NodeJS.Timeout | null}>({});

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
    audioPlayers.forEach(player => {
      if (player.isPlaying) {
        audioRefs.current[player.id] = setInterval(() => {
          setAudioPlayers(prev => prev.map(p => {
            if (p.id === player.id) {
              const newProgress = p.progress + (100 / p.duration) * 0.1;
              if (newProgress >= 100) {
                return { ...p, progress: 100, isPlaying: false };
              }
              return { ...p, progress: newProgress };
            }
            return p;
          }));
        }, 100);
      } else {
        if (audioRefs.current[player.id]) {
          clearInterval(audioRefs.current[player.id]);
          audioRefs.current[player.id] = null;
        }
      }
    });

    return () => {
      Object.values(audioRefs.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [audioPlayers]);

  const toggleAudio = (audioId: number) => {
    setAudioPlayers(prev => prev.map(player => {
      if (player.id === audioId) {
        return { ...player, isPlaying: !player.isPlaying };
      }
      // Pause other audios when starting a new one
      return { ...player, isPlaying: false };
    }));
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
    // Stop all audios
    setAudioPlayers(prev => prev.map(p => ({ ...p, isPlaying: false })));
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
      // Stop all audios
      setAudioPlayers(prev => prev.map(p => ({ ...p, isPlaying: false })));
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

  const getAudioIcon = (player: AudioPlayer) => {
    if (player.isPlaying) {
      return "pause";
    }
    return "volume-high";
  };

  const getAudioColor = (player: AudioPlayer) => {
    if (player.id === 2) return "#f97316"; // Orange for the middle audio
    return "#666"; // Gray for others
  };

  const getProgressColor = (player: AudioPlayer) => {
    if (player.id === 2) return "#f97316"; // Orange progress for middle audio
    return "#999"; // Gray progress for others
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header/>      

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Audio Players */}
        <View style={styles.audioSection}>
          {audioPlayers.map((player) => (
            <View key={player.id} style={styles.audioPlayer}>
              <TouchableOpacity 
                onPress={() => toggleAudio(player.id)} 
                style={styles.audioButton}
              >
                <Ionicons 
                  name={getAudioIcon(player)} 
                  size={24} 
                  color={getAudioColor(player)}
                />
              </TouchableOpacity>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${player.progress}%`,
                        backgroundColor: getProgressColor(player)
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
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
      </ScrollView>
      <Footer/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  audioSection: {
    width: '100%',
    marginBottom: 30,
  },
  audioPlayer: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  audioButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 4,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  questionTitle: {
    color: '#f97316',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  timer: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '500',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 10,
  },
  optionDefault: {
    backgroundColor: 'white',
    borderColor: '#f97316',
  },
  optionSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
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
    color: '#f97316',
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
    backgroundColor: '#f97316',
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

export default EcoLogicoQuiz;