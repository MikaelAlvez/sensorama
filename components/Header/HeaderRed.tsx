import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function Header() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#C70300" />
      <View style={styles.header} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#C70300',
  },
});