import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Footer from '../../components/Footer/FooterBlue';
import Header from '../../components/Header/HeaderBlue';
import DrawerMenu from '../../components/Menu/DrawerMenu';
import Menu from '../../components/Menu/MenuButton';

export default function Home() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const router = useRouter();

  const handleStartSensorama = () => {
    console.log('Iniciar Sensorama');
  };

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const handleViewCompleteList = () => {
    router.push('/sensorama/mySensorama');
  };

  const rankingData = [
    { color: '#1a237e', user: 'User', points: '100000 pts' },
    { color: '#4caf50', user: 'User', points: '10000 pts' },
    { color: '#ffeb3b', user: 'User', points: '1000 pts' },
    { color: '#ff9800', user: 'User', points: '100 pts' },
    { color: '#f44336', user: 'User', points: '10 pts' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header />
      <Menu onPress={handleMenuPress} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos Sensoramas Criados</Text>
          
          <View style={styles.sensoramaGrid}>
            <View style={styles.sensoramaItem}>
              <View style={styles.sensoramaPlaceholder} />
              <Text style={styles.sensoramaLabel}>Sensorama#2</Text>
            </View>
            
            <View style={styles.sensoramaItem}>
              <View style={[styles.sensoramaPlaceholder, styles.activeSensorama]} />
              <Text style={[styles.sensoramaLabel, styles.activeSensoramaLabel]}>
                Sensorama#1
              </Text>
            </View>
            
            <View style={styles.sensoramaItem}>
              <View style={styles.sensoramaPlaceholder} />
              <Text style={styles.sensoramaLabel}>Sensorama#3</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleViewCompleteList}>
            <Text style={styles.viewCompleteLink}>Ver Lista Completa →</Text>
          </TouchableOpacity>
        </View>

        {/* Rank Semanal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rank Semanal</Text>
          
          <View style={styles.rankingContainer}>
            {rankingData.map((item, index) => (
              <View key={index} style={styles.rankingItem}>
                <View style={[styles.rankingColor, { backgroundColor: item.color }]} />
                <Text style={[styles.rankingUser, { color: item.color }]}>
                  {item.user}
                </Text>
                <Text style={[styles.rankingPoints, { color: item.color }]}>
                  {item.points}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartSensorama}>
          <Text style={styles.startButtonText}>INICIAR SENSORAMA</Text>
        </TouchableOpacity>
      </View>

      <Footer />

      <DrawerMenu 
        isVisible={isMenuVisible} 
        onClose={handleCloseMenu} 
      />
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
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 20,
    textAlign: 'center',
  },
  sensoramaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sensoramaItem: {
    alignItems: 'center',
    flex: 1,
  },
  sensoramaPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  activeSensorama: {
    backgroundColor: '#1a237e',
  },
  sensoramaLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  activeSensoramaLabel: {
    color: '#1a237e',
    fontWeight: '600',
  },
  viewCompleteLink: {
    color: '#1a237e',
    fontSize: 14,
    textAlign: 'right',
    fontWeight: '500',
  },
  rankingContainer: {
    gap: 12,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rankingColor: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 15,
  },
  rankingUser: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  rankingPoints: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  startButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});