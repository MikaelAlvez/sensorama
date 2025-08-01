import FooterBlue from '@/components/Footer/FooterBlue';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import HeaderBlue from '../../components/Header/HeaderBlue';

interface Sensorama {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: string;
  createdAt: string;
  isPublic: boolean;
  plays: number;
}

interface MySensoramasScreenProps {
  sensoramas?: Sensorama[];
}

const MySensoramasScreen: React.FC<MySensoramasScreenProps> = ({
  sensoramas = [
    {
      id: 1,
      title: "Sons da Natureza",
      description: "Identifique diferentes sons encontrados na natureza",
      questionsCount: 15,
      difficulty: 'Fácil',
      category: 'Natureza',
      createdAt: '2024-01-15',
      isPublic: true,
      plays: 234
    },
    {
      id: 2,
      title: "Instrumentos Musicais",
      description: "Reconheça diversos instrumentos musicais pelos seus sons",
      questionsCount: 20,
      difficulty: 'Médio',
      category: 'Música',
      createdAt: '2024-01-10',
      isPublic: false,
      plays: 89
    },
    {
      id: 3,
      title: "Sons Urbanos",
      description: "Identifique sons comuns encontrados nas cidades",
      questionsCount: 12,
      difficulty: 'Fácil',
      category: 'Cidade',
      createdAt: '2024-01-08',
      isPublic: true,
      plays: 156
    },
    {
      id: 4,
      title: "Animais Selvagens",
      description: "Reconheça os sons de diferentes animais selvagens",
      questionsCount: 18,
      difficulty: 'Difícil',
      category: 'Animais',
      createdAt: '2024-01-05',
      isPublic: false,
      plays: 67
    },
    {
      id: 5,
      title: "Línguas do Mundo",
      description: "Identifique diferentes idiomas sendo falados",
      questionsCount: 25,
      difficulty: 'Difícil',
      category: 'Idiomas',
      createdAt: '2024-01-02',
      isPublic: true,
      plays: 312
    }
  ]
}) => {

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleCreateNew = () => {
    router.push('/sensorama/newSensorama');
  };

  const handleItemPress = (item: Sensorama) => {
    if (isSelectionMode) {
      toggleSelection(item.id);
    } else {
      router.push(`/sensorama/${item.id}`);
    }
  };

  const handleItemLongPress = (item: Sensorama) => {
    setIsSelectionMode(true);
    toggleSelection(item.id);
  };

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir ${selectedItems.length} sensorama(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            console.log('Excluindo items:', selectedItems);
            setSelectedItems([]);
            setIsSelectionMode(false);
          }
        }
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Compartilhar', `Compartilhando ${selectedItems.length} sensorama(s)`);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const cancelSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return '#22c55e';
      case 'Médio': return '#f59e0b';
      case 'Difícil': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderSensoramaItem = ({ item }: { item: Sensorama }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.sensoramaItem,
          isSelected && styles.selectedItem
        ]}
        onPress={() => handleItemPress(item)}
        onLongPress={() => handleItemLongPress(item)}
        activeOpacity={0.7}
      >
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            <Ionicons 
              name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={isSelected ? "#1a237e" : "#9ca3af"} 
            />
          </View>
        )}
        
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.statusIndicators}>
              {item.isPublic ? (
                <Ionicons name="globe" size={16} color="#22c55e" />
              ) : (
                <Ionicons name="lock-closed" size={16} color="#6b7280" />
              )}
            </View>
          </View>
          
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="help-circle" size={16} color="#6b7280" />
              <Text style={styles.detailText}>{item.questionsCount} perguntas</Text>
            </View>
            
            <View style={styles.detailItem}>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(item.difficulty) }
              ]}>
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="play" size={16} color="#6b7280" />
              <Text style={styles.detailText}>{item.plays} plays</Text>
            </View>
          </View>
          
          <View style={styles.itemFooter}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.dateText}>Criado em {formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <HeaderBlue />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Ionicons name="library" size={32} color="#1a237e" />
            <Text style={styles.title}>Meus Sensoramas</Text>
          </View>
          <Text style={styles.subtitle}>
            {isSelectionMode 
              ? `${selectedItems.length} item(s) selecionado(s)`
              : `${sensoramas.length} sensorama(s) criado(s)`
            }
          </Text>
        </View>

        {isSelectionMode && (
          <View style={styles.selectionActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share" size={20} color="#1a237e" />
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Ionicons name="trash" size={20} color="#ef4444" />
              <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Excluir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={cancelSelection}>
              <Ionicons name="close" size={20} color="#6b7280" />
              <Text style={[styles.actionButtonText, { color: '#6b7280' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sensoramas List */}
        <View style={styles.listContainer}>
          {sensoramas.length > 0 ? (
            <FlatList
              data={sensoramas}
              renderItem={renderSensoramaItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>Nenhum Sensorama Criado</Text>
              <Text style={styles.emptySubtitle}>
                Crie seu primeiro sensorama e comece a compartilhar seus quiz de áudio!
              </Text>
              <TouchableOpacity style={styles.createFirstButton} onPress={handleCreateNew}>
                <Text style={styles.createFirstButtonText}>Criar Primeiro Sensorama</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isSelectionMode && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={20} color="#1a237e" />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.createButtonText}>Criar Novo</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 20,
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
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a237e',
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
  sensoramaItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  selectedItem: {
    borderColor: '#1a237e',
    borderWidth: 2,
    backgroundColor: '#f0f4ff',
  },
  selectionIndicator: {
    marginRight: 12,
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  statusIndicators: {
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#1a237e',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: '#1a237e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  backButton: {
    flex: 2,
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
  createButton: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1a237e',
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#1a237e',
    borderRadius: 8,
  },
});

export default MySensoramasScreen;