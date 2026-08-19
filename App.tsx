import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { CalculatorScreen } from './src/ui/screens/CalculatorScreen';
import { couleurs } from './src/ui/theme';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <CalculatorScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: couleurs.papier,
  },
});
