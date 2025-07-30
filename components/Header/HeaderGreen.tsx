import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function Header() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <View style={styles.header} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#008C01',
  },
});