import React from 'react';
import { StyleSheet, View } from 'react-native';

interface RainbowBackgroundProps {
  colors?: string[];
}

const RainbowBackground: React.FC<RainbowBackgroundProps> = ({
  colors = [
    '#1a237e', // Dark blue
    '#16a34a', // Green
    '#eab308', // Yellow
    '#f97316', // Orange
    '#dc2626', // Red
  ]
}) => {
  return (
    <View style={styles.rainbowBackground}>
      {colors.map((color, index) => (
        <View 
          key={index}
          style={[styles.colorStripe, { backgroundColor: color }]} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  rainbowBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  colorStripe: {
    flex: 1,
  },
});

export default RainbowBackground;