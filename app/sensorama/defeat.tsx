import GrayTonsBackground from '@/components/GrayTons/graytons';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface DefeatScreenProps {
  score?: number;
  totalQuestions?: number;
  onContinue?: () => void;
  onRestart?: () => void;
}

const DefeatScreen: React.FC<DefeatScreenProps> = ({
  score = 85,
  totalQuestions = 10,
  onContinue,
  onRestart
}) => {

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push('/homePage/home');
    }
  };

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    } else {
      router.push('/homePage/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar backgroundColor="#1a237e" barStyle="light-content" />
      
      <GrayTonsBackground />

      {/* Content */}
      <View style={styles.content}>
        {/* Crown */}
        
        {/* Defeat Card */}
        <View style={styles.defeatCard}>
          {/* Score Circle */}
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{score}%</Text>
            </View>
          </View>
          
          <Text style={styles.victoryTitle}>DERROTA</Text>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
              <Ionicons name="refresh" size={20} color="#1a237e" />
              <Text style={styles.restartButtonText}>Jogar Novamente</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  crownContainer: {
    marginBottom: 20,
    zIndex: 2,
  },
  crown: {
    width: 80,
    height: 60,
    position: 'relative',
  },
  crownPeaks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
  },
  peak: {
    backgroundColor: '#F8F8F8',
    borderRadius: 2,
  },
  peak1: {
    width: 12,
    height: 25,
  },
  peak2: {
    width: 12,
    height: 35,
  },
  peak3: {
    width: 12,
    height: 40,
  },
  peak4: {
    width: 12,
    height: 35,
  },
  peak5: {
    width: 12,
    height: 25,
  },
  crownBase: {
    width: '100%',
    height: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    marginTop: -2,
  },
  jewel1: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#ef4444',
    borderRadius: 3,
    top: 15,
    left: 18,
  },
  jewel2: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    top: 10,
    left: 36,
  },
  jewel3: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#10b981',
    borderRadius: 3,
    top: 15,
    right: 18,
  },
  defeatCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scoreContainer: {
    marginBottom: 30,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  victoryTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
    letterSpacing: 2,
  },
  victorySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1a237e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  restartButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DefeatScreen;