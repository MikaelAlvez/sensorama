import FooterBlue from '@/components/Footer/FooterBlue';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import HeaderBlue from '../../components/Header/HeaderBlue';

interface RankingUser {
  id: number;
  name: string;
  score: number;
  position: number;
}

interface RankingScreenProps {
  users?: RankingUser[];
  currentUserId?: number;
}

const RankingScreen: React.FC<RankingScreenProps> = ({
  users = [
    { id: 1, name: "João Silva", score: 2840, position: 1 },
    { id: 2, name: "Maria Santos", score: 2650, position: 2 },
    { id: 3, name: "Pedro Costa", score: 2420, position: 3 },
    { id: 4, name: "Ana Oliveira", score: 2380, position: 4 },
    { id: 5, name: "Carlos Ferreira", score: 2200, position: 5 },
    { id: 6, name: "Lucia Rodrigues", score: 2150, position: 6 },
    { id: 7, name: "Bruno Alves", score: 2050, position: 7 },
    { id: 8, name: "Fernanda Lima", score: 1980, position: 8 },
    { id: 9, name: "Ricardo Souza", score: 1920, position: 9 },
    { id: 10, name: "Juliana Martins", score: 1850, position: 10 },
  ],
  currentUserId = 5
}) => {

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/homePage/home');
  };

  const getTrophyIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Ionicons name="trophy" size={28} color="#FFD700" />;
      case 2:
        return <Ionicons name="trophy" size={26} color="#C0C0C0" />;
      case 3:
        return <Ionicons name="trophy" size={24} color="#CD7F32" />;
      default:
        return (
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{position}</Text>
          </View>
        );
    }
  };

  const renderRankingItem = ({ item }: { item: RankingUser }) => {
    const isCurrentUser = item.id === currentUserId;
    
    return (
      <View style={[
        styles.rankingItem,
        isCurrentUser && styles.currentUserItem,
        item.position <= 3 && styles.topThreeItem
      ]}>
        <View style={styles.positionContainer}>
          {getTrophyIcon(item.position)}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[
            styles.userName,
            isCurrentUser && styles.currentUserText
          ]}>
            {item.name}
            {isCurrentUser && " (Você)"}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={[
            styles.userScore,
            isCurrentUser && styles.currentUserText
          ]}>
            {item.score.toLocaleString()} pts
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <HeaderBlue />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Ionicons name="podium" size={32} color="#1a237e" />
            <Text style={styles.title}>Ranking</Text>
          </View>
          <Text style={styles.subtitle}>Veja sua posição no ranking geral</Text>
        </View>

        {/* Ranking List */}
        <View style={styles.rankingContainer}>
          <FlatList
            data={users}
            renderItem={renderRankingItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={20} color="#1a237e" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Ionicons name="home" size={20} color="white" />
            <Text style={styles.homeButtonText}>Início</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FooterBlue />
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
    paddingTop: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  title: {
    color: '#1a237e',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  rankingContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContainer: {
    paddingBottom: 10,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topThreeItem: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
  },
  currentUserItem: {
    backgroundColor: '#dbeafe',
    borderColor: '#1a237e',
    borderWidth: 2,
  },
  positionContainer: {
    width: 40,
    alignItems: 'center',
  },
  positionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  currentUserText: {
    color: '#1a237e',
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  userScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1a237e',
    gap: 8,
  },
  backButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1a237e',
    borderRadius: 8,
    gap: 8,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RankingScreen;