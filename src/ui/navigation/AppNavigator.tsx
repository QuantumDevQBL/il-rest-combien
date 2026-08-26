import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useOnboarding } from '../hooks/useOnboarding';
import { useHistorySync } from '../hooks/useHistorySync';
import { HomeScreen } from '../screens/HomeScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { SettingsModal } from '../modals/SettingsModal';
import { HistoryModal } from '../modals/HistoryModal';
import { InverseModal } from '../modals/InverseModal';
import { DetailModal } from '../modals/DetailModal';
import { PremiumIntroModal } from '../modals/PremiumIntroModal';
import { PilotagePaywallModal } from '../modals/PilotagePaywallModal';
import { PilotageScreen } from '../screens/PilotageScreen';
import { useSubscription } from '../context/SubscriptionContext';
import { colors } from '../theme';
import { PremiumIntroSource } from '../utils/analytics';

export type RootStackParamList = {
  Home: undefined;
  Result: undefined;
  Pilotage: { source?: PremiumIntroSource } | undefined;
  SettingsModal: undefined;
  HistoryModal: undefined;
  InverseModal: undefined;
  DetailModal: undefined;
  PremiumIntroModal: { source: PremiumIntroSource };
  PilotagePaywallModal: { source: PremiumIntroSource };
};

const Stack = createStackNavigator<RootStackParamList>();
const IS_TEST_ENV = process.env.NODE_ENV === 'test';

function HistorySync() {
  useHistorySync();
  return null;
}

export function AppNavigator() {
  const { isLoading, markAsSeen } = useOnboarding();
  const { hasInitialized, isPilotageActive } = useSubscription();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      void markAsSeen();
    }
  }, [isLoading, markAsSeen]);

  if (!isReady) {
    return null;
  }

  const openPilotageFromIntent = (
    navigation: { navigate: (screen: keyof RootStackParamList, params?: any) => void },
    source: PremiumIntroSource
  ) => {
    if (hasInitialized && isPilotageActive) {
      navigation.navigate('Pilotage', { source });
      return;
    }

    navigation.navigate('PilotagePaywallModal', { source });
  };

  return (
    <>
      <HistorySync />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          animationEnabled: !IS_TEST_ENV,
          gestureEnabled: true,
          detachPreviousScreen: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              onCalculate={() => navigation.navigate('Result')}
              onOpenHistory={() => navigation.navigate('HistoryModal')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Result"
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        >
          {({ navigation }) => (
            <ResultScreen
              onReset={() => navigation.replace('Home')}
              onOpenSettings={() => navigation.navigate('SettingsModal')}
              onOpenHistory={() => navigation.navigate('HistoryModal')}
              onOpenInverse={() => navigation.navigate('InverseModal')}
              onOpenDetail={() => navigation.navigate('DetailModal')}
              onOpenPilotage={(source) => openPilotageFromIntent(navigation, source)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Pilotage"
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          {({ navigation, route }) => (
            <PilotageScreen
              source={route.params?.source}
              onBack={() => navigation.goBack()}
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
          <Stack.Screen name="PremiumIntroModal">
            {({ navigation, route }) => (
              <PremiumIntroModal
                source={route.params.source}
                onClose={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PilotagePaywallModal">
            {({ navigation, route }) => (
              <PilotagePaywallModal
                source={route.params.source}
                onClose={() => navigation.goBack()}
                onUnlockPilotage={() => navigation.replace('Pilotage', { source: route.params.source })}
              />
            )}
          </Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
}
