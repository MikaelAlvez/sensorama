import React from 'react';
import { StyleSheet, View } from 'react-native';

interface GrayTonsBackgroundProps {
  colors?: string[];
}

const GrayTonsBackground: React.FC<GrayTonsBackgroundProps> = ({
  colors = [
    '#272727', // Dark blue
    '#535353', // Green
    '#C1C1C1', // Yellow
    '#9C9C9C', // Orange
    '#3D3D3D', // Red
  ]
}) => {
  return (
    <View style={styles.graytonsBackground}>
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
  graytonsBackground: {
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

export default GrayTonsBackground;