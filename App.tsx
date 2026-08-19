import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { CalculatorProvider } from './src/ui/context/CalculatorContext';
import { AppNavigator } from './src/ui/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <CalculatorProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </CalculatorProvider>
    </SafeAreaProvider>
  );
}
