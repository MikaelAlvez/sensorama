import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function Header() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E3D304" />
      <View style={styles.header} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#E3D304',
  },
});