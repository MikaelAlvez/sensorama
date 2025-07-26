import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import DrawerMenu from '../../components/Menu/DrawerMenu';
import MenuButton from '../../components/Menu/MenuButton';

export default function About() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const handleGithubPress = (githubUrl: string) => {
    Linking.openURL(githubUrl);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const teamMembers = [
    {
      id: 1,
      name: "Isabele Cristina",
      role: "UI/UX Designer & Desenvolvedor Backend",
      github: "https://github.com/isabeleLima",
      email: "isabele.gomes@alunos.ufersa.edu.br",
      photo: require('../../assets/images/isabele.png')
    },
    {
      id: 2,
      name: "João Gonçalo",
      role: "Desenvolvedor Backend",
      github: "https://github.com/J0NGS",
      email: "joao.neto70510@alunos.ufersa.edu.br ",
      photo: require('../../assets/images/joao.png')
    },
    {
      id: 3,
      name: "Mikael Alves",
      role: "Desenvolvedor Frontend",
      github: "https://github.com/MikaelAlvez",
      email: "jose.alves08240@alunos.ufersa.edu.br",
      photo: require('../../assets/images/mikael.jpeg')
    },
    {
      id: 4,
      name: "Lucas Rock",
      role: "Desenvolvedora Backend",
      github: "https://github.com/L-Rock-C",
      email: "lucas.cardoso45219@alunos.ufersa.edu.br ",
      photo: require('../../assets/images/lucasrock.png')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header />
      <MenuButton onPress={handleMenuPress} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <Image 
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Sensorama</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
          <Text style={styles.description}>
            O Sensorama é uma plataforma inovadora de quiz interativo que combina áudio, 
            imagem e jogabilidade para criar uma experiência de aprendizado única e envolvente. 
            Desafie seus conhecimentos de forma divertida e interativa!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos Principais</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="game-controller" size={24} color="#1a237e" style={styles.featureIcon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Quiz Interativo</Text>
              <Text style={styles.featureDescription}>
                Jogos dinâmicos com perguntas e respostas envolventes
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="headset" size={24} color="#1a237e" style={styles.featureIcon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Experiência Multimídia</Text>
              <Text style={styles.featureDescription}>
                Combina áudio, imagem e texto para melhor aprendizado
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="trophy" size={24} color="#1a237e" style={styles.featureIcon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Sistema de Ranking</Text>
              <Text style={styles.featureDescription}>
                Compete com outros jogadores e acompanhe seu progresso
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="create" size={24} color="#1a237e" style={styles.featureIcon} />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Criação de Conteúdo</Text>
              <Text style={styles.featureDescription}>
                Crie seus próprios sensoramas e compartilhe com a comunidade
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Técnicas</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Desenvolvido com:</Text>
            <Text style={styles.infoValue}>React Native & Expo</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plataformas:</Text>
            <Text style={styles.infoValue}>Android</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Última atualização:</Text>
            <Text style={styles.infoValue}>Agosto 2025</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipe de Desenvolvimento</Text>
          
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.teamMember}>
              <Image 
                source={member.photo}
                style={styles.memberPhoto}
                resizeMode="cover"
              />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                
                <View style={styles.memberLinks}>
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => handleGithubPress(member.github)}
                  >
                    <Ionicons name="logo-github" size={18} color="#1a237e" />
                    <Text style={styles.linkText}>GitHub</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => handleEmailPress(member.email)}
                  >
                    <Ionicons name="mail" size={18} color="#1a237e" />
                    <Text style={styles.linkText}>Contato</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato & Suporte</Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color="#1a237e" style={styles.contactIcon} />
            <Text style={styles.contactText}>suporte@sensorama.app</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="globe" size={20} color="#1a237e" style={styles.contactIcon} />
            <Text style={styles.contactText}>www.sensorama.app</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="logo-instagram" size={20} color="#1a237e" style={styles.contactIcon} />
            <Text style={styles.contactText}>@sensorama_oficial</Text>
          </View>
        </View>

        <View style={styles.copyrightSection}>
          <Text style={styles.copyright}>
            © 2025 Sensorama. Todos os direitos reservados.
          </Text>
          <Text style={styles.copyright}>
            Uma Nova Maneira de Jogar e Aprender
          </Text>
        </View>
      </ScrollView>

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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#ffffff',
    marginVertical: 10,
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#666666',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  // Estilos para a seção da equipe
  teamMember: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  memberLinks: {
    flexDirection: 'row',
    gap: 15,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e3ff',
  },
  linkText: {
    fontSize: 12,
    color: '#1a237e',
    marginLeft: 5,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eeeeee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a237e',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#333333',
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  copyright: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 4,
  },
});