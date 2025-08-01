import FooterBlue from '@/components/Footer/FooterBlue';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import HeaderBlue from '../../components/Header/HeaderBlue';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.8;
const RADIUS = WHEEL_SIZE / 2;

const games = [
    { name: 'MAPA MENTAL', color: '#008C01', shortName: 'MAPA' },
    { name: 'PIXELADO', color: '#C70300', shortName: 'PIXELADO' },
    { name: 'QUAL É O OBJETO?', color: '#181D8A', shortName: 'OBJETO' },
    { name: 'ECO LÓGICO', color: '#FF8600', shortName: 'ECO' },
    { name: 'ZOOM ENIGMA', color: '#E3D304', shortName: 'ZOOM' },
];

export default function RouletteScreen() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  const navigateToGame = (gameName) => {
    let route;
    switch (gameName) {
      case 'MAPA MENTAL':
        route = '/questions/mindMapQuestion';
        break;
      case 'PIXELADO':
        route = '/questions/pixeladoQuestion';
        break;
      case 'QUAL É O OBJETO?':
        route = '/questions/objectQuestion';
        break;
      case 'ECO LÓGICO':
        route = '/questions/ecoLogicalQuestion';
        break;
      case 'ZOOM ENIGMA':
        route = '/questions/zomPuzzleQuestion';
        break;
      default:
        console.error('Unknown game selected:', gameName);
        return;
    }
    router.push(route);
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedGame(null);

    const randomRotations = 3 + Math.random() * 2;
    const randomFinalPosition = Math.random();
    const totalRotation = randomRotations + randomFinalPosition;

    Animated.timing(spinValue, {
    toValue: totalRotation,
    duration: 4000,
    useNativeDriver: true,
    }).start(() => {
    const anglePerSection = 360 / games.length;
    const finalRotationDegrees = (totalRotation % 1) * 360;
    const correctedAngle = (360 - finalRotationDegrees + anglePerSection / 2) % 360;
    const selectedIndex = Math.floor(correctedAngle / anglePerSection);

    const winner = games[selectedIndex];
    setSelectedGame(winner);
    setIsSpinning(false);
    spinValue.setValue(totalRotation % 1);

    setTimeout(() => {
      navigateToGame(winner.name);
    }, 2000);
    });
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderWheel = () => {
    const anglePerSection = 360 / games.length;

    return (
      <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
        <G x={RADIUS} y={RADIUS}>
          {games.map((game, index) => {
            const startAngle = index * anglePerSection;
            const endAngle = (index + 1) * anglePerSection;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = Math.cos(startRad) * RADIUS;
            const y1 = Math.sin(startRad) * RADIUS;
            const x2 = Math.cos(endRad) * RADIUS;
            const y2 = Math.sin(endRad) * RADIUS;

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
            const pathData = `
              M 0 0
              L ${x1} ${y1}
              A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle * Math.PI) / 180;
            const textX = Math.cos(midRad) * (RADIUS * 0.7);
            const textY = Math.sin(midRad) * (RADIUS * 0.7);

            return (
              <G key={index}>
                <Path
                  d={pathData}
                  fill={game.color}
                  stroke="#fff"
                  strokeWidth="3"
                />
                <SvgText
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                >
                  {game.shortName}
                </SvgText>
              </G>
            );
          })}

          <Circle r="30" fill="#333" />
          <Circle r="25" fill="#fff" />
        </G>
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <HeaderBlue />
      <View style={styles.header}>
        <Text style={styles.title}>ROLETA DOS JOGOS</Text>
        <Text style={styles.subtitle}>Gire para descobrir o próximo desafio!</Text>
      </View>

      <View style={styles.wheelContainer}>
        <View style={styles.indicator} />
        <Animated.View
          style={[
            styles.wheel,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          {renderWheel()}
        </Animated.View>
      </View>

      {selectedGame && (
        <View style={[styles.resultContainer, { backgroundColor: selectedGame.color }]}>
          <Text style={styles.resultText}>VOCÊ JOGARÁ:</Text>
          <Text style={styles.resultGame}>{selectedGame.name}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={spinWheel}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'GIRANDO...' : 'GIRAR ROLETA'}
        </Text>
      </TouchableOpacity>
      <FooterBlue />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  wheelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  indicator: {
    position: 'absolute',
    top: 150,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderLeftColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: 'transparent',
    borderTopWidth: 40,
    borderTopColor: '#333',
    zIndex: 1,
  },
  resultContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  resultGame: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spinButton: {
    backgroundColor: '#333',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  spinButtonDisabled: {
    backgroundColor: '#999',
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
