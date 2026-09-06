import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { CalculatorProvider } from './src/ui/context/CalculatorContext';
import { SubscriptionProvider } from './src/ui/context/SubscriptionContext';
import { AppNavigator } from './src/ui/navigation/AppNavigator';
import { trackFirstOpenIfNeeded } from './src/ui/utils/analytics';

export default function App() {
  useEffect(() => {
    void trackFirstOpenIfNeeded();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SubscriptionProvider>
          <CalculatorProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
          </CalculatorProvider>
        </SubscriptionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
