import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface DrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isVisible, onClose }: DrawerMenuProps) {
  const handleMenuItemPress = (route: string, isLogout?: boolean) => {
    onClose();
    
    if (isLogout) {
      console.log('Fazendo logout...');
    }
    
    router.push(route as any);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.drawerContainer}>
              {/* Header do Menu */}
              <View style={styles.drawerHeader}>
                <TouchableOpacity style={styles.closeButton} onPress={(onClose)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.drawerTitle}>Menu</Text>
              </View>

              {/* Itens do Menu */}
              <View style={styles.menuItems}>
                
                {/* Home */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('/homePage/home')}
                >
                  <Ionicons name="home-outline" size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Home</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Meus Sensoramas */}
                <TouchableOpacity
                  style={styles.menuItem}
                  //onPress={() => handleMenuItemPress('/questions/objectQuestion')}
                  //onPress={() => handleMenuItemPress('/questions/pixeladoQuestion')}
                  //onPress={() => handleMenuItemPress('/questions/mindMapQuestion')}
                  //onPress={() => handleMenuItemPress('/questions/zomPuzzleQuestion')}
                  //onPress={() => handleMenuItemPress('/questions/ecoLogicalQuestion')}
                  onPress={() => handleMenuItemPress('/sensorama/victory')}
                  //onPress={() => handleMenuItemPress('/sensorama/defeat')}

                >
                  <Ionicons name="game-controller-outline" size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Meus Sensoramas</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Criar Sensorama */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('/sensorama/newSensorama')}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Criar Sensorama</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Ranking */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('/ranking/ranking')}
                >
                  <Ionicons name="trophy-outline" size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Ranking</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Perfil */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('/profile/profile')}
                >
                  <Ionicons name="person-outline" size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Perfil</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Configurações
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('/settings')}
                >
                  <Ionicons name="settings-outline" size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Configurações</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity> */}

                {/* Sobre */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress('/profile/about')}
                >
                  <Ionicons name="information-circle-outline" size={24} color="#333" style={styles.menuIcon} />
                  <Text style={styles.menuText}>Sobre</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Sair */}
                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutItem]}
                  onPress={() => handleMenuItemPress('/', true)}
                >
                  <Ionicons name="log-out-outline" size={24} color="#f44336" style={styles.menuIcon} />
                  <Text style={[styles.menuText, styles.logoutText]}>Sair</Text>
                  <Ionicons name="chevron-forward" size={20} color="#f44336" />
                </TouchableOpacity>

              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  drawerContainer: {
    width: 280,
    backgroundColor: '#fff',
    flex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawerHeader: {
    backgroundColor: '#1a237e',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    marginRight: 15,
  },
  drawerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    color: '#f44336',
    fontWeight: '500',
  },
});