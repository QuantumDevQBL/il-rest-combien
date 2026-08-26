import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useOnboarding } from '../hooks/useOnboarding';
import { useHistorySync } from '../hooks/useHistorySync';
import { HomeScreen } from '../screens/HomeScreen';
import { PilotageScreen } from '../screens/PilotageScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { SettingsModal } from '../modals/SettingsModal';
import { HistoryModal } from '../modals/HistoryModal';
import { InverseModal } from '../modals/InverseModal';
import { DetailModal } from '../modals/DetailModal';
import { Icon } from '../design-system';
import { colors } from '../theme';

export type RootStackParamList = {
  MainTabs: undefined;
  SettingsModal: undefined;
  HistoryModal: undefined;
  InverseModal: undefined;
  DetailModal: undefined;
};

type MainTabParamList = {
  Simuler: undefined;
  Pilotage: undefined;
};

type CalculatorStackParamList = {
  Home: undefined;
  Result: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const CalculatorStack = createStackNavigator<CalculatorStackParamList>();
const IS_TEST_ENV = process.env.NODE_ENV === 'test';

function HistorySync() {
  useHistorySync();
  return null;
}

function CalculatorStackScreen() {
  return (
    <CalculatorStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        animationEnabled: !IS_TEST_ENV,
        gestureEnabled: true,
        detachPreviousScreen: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <CalculatorStack.Screen name="Home">
        {({ navigation }) => (
          <HomeScreen
            onCalculate={() => navigation.navigate('Result')}
            onOpenHistory={() =>
              navigation.getParent()?.getParent()?.navigate('HistoryModal' as never)
            }
          />
        )}
      </CalculatorStack.Screen>
      <CalculatorStack.Screen name="Result">
        {({ navigation }) => (
          <ResultScreen
            onReset={() => navigation.replace('Home')}
            onOpenSettings={() =>
              navigation.getParent()?.getParent()?.navigate('SettingsModal' as never)
            }
            onOpenHistory={() =>
              navigation.getParent()?.getParent()?.navigate('HistoryModal' as never)
            }
            onOpenInverse={() =>
              navigation.getParent()?.getParent()?.navigate('InverseModal' as never)
            }
            onOpenDetail={() =>
              navigation.getParent()?.getParent()?.navigate('DetailModal' as never)
            }
            onOpenPilotage={() => navigation.getParent()?.navigate('Pilotage' as never)}
          />
        )}
      </CalculatorStack.Screen>
    </CalculatorStack.Navigator>
  );
}

function MainTabsScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Simuler"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={route.name === 'Simuler' ? 'calculator' : 'statsChart'}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Simuler" component={CalculatorStackScreen} />
      <Tab.Screen name="Pilotage">
        {({ navigation }) => (
          <PilotageScreen
            onOpenSettings={() =>
              navigation.getParent()?.navigate('SettingsModal' as never)
            }
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isLoading, markAsSeen } = useOnboarding();
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

  return (
    <>
      <HistorySync />
      <RootStack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          animationEnabled: !IS_TEST_ENV,
          gestureEnabled: true,
          detachPreviousScreen: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <RootStack.Screen name="MainTabs" component={MainTabsScreen} />

        <RootStack.Group
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
          <RootStack.Screen name="SettingsModal">
            {({ navigation }) => <SettingsModal onClose={() => navigation.goBack()} />}
          </RootStack.Screen>
          <RootStack.Screen name="HistoryModal">
            {({ navigation }) => <HistoryModal onClose={() => navigation.goBack()} />}
          </RootStack.Screen>
          <RootStack.Screen name="InverseModal">
            {({ navigation }) => <InverseModal onClose={() => navigation.goBack()} />}
          </RootStack.Screen>
          <RootStack.Screen name="DetailModal">
            {({ navigation }) => <DetailModal onClose={() => navigation.goBack()} />}
          </RootStack.Screen>
        </RootStack.Group>
      </RootStack.Navigator>
    </>
  );
}
