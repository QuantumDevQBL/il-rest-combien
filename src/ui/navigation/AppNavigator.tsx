import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useOnboarding } from '../hooks/useOnboarding';
import { useHistorySync } from '../hooks/useHistorySync';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { SettingsModal } from '../modals/SettingsModal';
import { HistoryModal } from '../modals/HistoryModal';
import { InverseModal } from '../modals/InverseModal';
import { DetailModal } from '../modals/DetailModal';
import { colors } from '../theme';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Result: undefined;
  SettingsModal: undefined;
  HistoryModal: undefined;
  InverseModal: undefined;
  DetailModal: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const IS_TEST_ENV = process.env.NODE_ENV === 'test';

function HistorySync() {
  useHistorySync();
  return null;
}

export function AppNavigator() {
  const { hasSeenOnboarding, isLoading, markAsSeen } = useOnboarding();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  if (!isReady) {
    return null;
  }

  const initialRouteName = hasSeenOnboarding ? 'Home' : 'Onboarding';

  return (
    <>
      <HistorySync />
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          animationEnabled: !IS_TEST_ENV,
        }}
      >
        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingScreen
              onComplete={() => {
                void markAsSeen();
                navigation.replace('Home');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              onCalculate={() => navigation.navigate('Result')}
              onOpenHistory={() => navigation.navigate('HistoryModal')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Result">
          {({ navigation }) => (
            <ResultScreen
              onReset={() => navigation.navigate('Home')}
              onOpenSettings={() => navigation.navigate('SettingsModal')}
              onOpenHistory={() => navigation.navigate('HistoryModal')}
              onOpenInverse={() => navigation.navigate('InverseModal')}
              onOpenDetail={() => navigation.navigate('DetailModal')}
            />
          )}
        </Stack.Screen>

        <Stack.Group
          screenOptions={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            presentation: 'transparentModal',
            gestureEnabled: true,
            gestureDirection: 'vertical',
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            animationEnabled: !IS_TEST_ENV,
          }}
        >
          <Stack.Screen name="SettingsModal">
            {({ navigation }) => <SettingsModal onClose={() => navigation.goBack()} />}
          </Stack.Screen>
          <Stack.Screen name="HistoryModal">
            {({ navigation }) => <HistoryModal onClose={() => navigation.goBack()} />}
          </Stack.Screen>
          <Stack.Screen name="InverseModal">
            {({ navigation }) => <InverseModal onClose={() => navigation.goBack()} />}
          </Stack.Screen>
          <Stack.Screen name="DetailModal">
            {({ navigation }) => <DetailModal onClose={() => navigation.goBack()} />}
          </Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
}
