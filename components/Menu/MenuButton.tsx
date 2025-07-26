import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface MenuButtonProps {
  onPress: () => void;
  iconSize?: number;
  backgroundColor?: string;
}

export default function MenuButton({ onPress, iconSize = 45, backgroundColor = '#1a237e' }: MenuButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.menuButton, { backgroundColor }]} 
      onPress={onPress}
    >
      <Ionicons name="menu" size={iconSize} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});