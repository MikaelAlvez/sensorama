import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Footer() {
  return <View style={styles.footer} />;
}

const styles = StyleSheet.create({
  footer: {
    height: 60,
    backgroundColor: '#E3D304',
  },
});