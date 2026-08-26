import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useOnboarding } from '../hooks/useOnboarding';
import { useHistorySync } from '../hooks/useHistorySync';
import { useSubscriptionContext } from '../context/SubscriptionContext';
import { HomeScreen } from '../screens/HomeScreen';
import { PilotageScreen } from '../screens/PilotageScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { PilotagePaywallModal } from '../modals/PilotagePaywallModal';
import { SettingsModal } from '../modals/SettingsModal';
import { HistoryModal } from '../modals/HistoryModal';
import { InverseModal } from '../modals/InverseModal';
import { DetailModal } from '../modals/DetailModal';
import { Button, Card, Icon } from '../design-system';
import { colors, spacing, typography } from '../theme';

export type RootStackParamList = {
  MainTabs: undefined;
  PilotagePaywallModal: undefined;
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
  const { isPremiumActive, openPaywall } = useSubscriptionContext();

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
            onOpenPilotage={() => {
              if (isPremiumActive) {
                navigation.getParent()?.navigate('Pilotage' as never);
                return;
              }

              openPaywall('result');
              navigation.getParent()?.getParent()?.navigate('PilotagePaywallModal' as never);
            }}
          />
        )}
      </CalculatorStack.Screen>
    </CalculatorStack.Navigator>
  );
}

function PilotageLockedScreen({ onUnlock }: { onUnlock: () => void }) {
  return (
    <View style={styles.lockedContainer}>
      <Card style={styles.lockedCard}>
        <Text style={styles.lockedEyebrow}>Pilotage Premium</Text>
        <Text style={styles.lockedTitle}>Débloquez le suivi mois par mois.</Text>
        <Text style={styles.lockedText}>
          Suivi du CA, disponible estimé, projection annuelle, objectif de revenu et
          alertes personnalisées.
        </Text>
        <Button label="Voir l’offre Pilotage" onPress={onUnlock} />
      </Card>
    </View>
  );
}

function MainTabsScreen() {
  const { isPremiumActive, openPaywall } = useSubscriptionContext();

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
        {({ navigation }) =>
          isPremiumActive ? (
            <PilotageScreen
              onOpenSettings={() =>
                navigation.getParent()?.navigate('SettingsModal' as never)
              }
            />
          ) : (
            <PilotageLockedScreen
              onUnlock={() => {
                openPaywall('pilotage_tab');
                navigation.getParent()?.navigate('PilotagePaywallModal' as never);
              }}
            />
          )
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isLoading, markAsSeen } = useOnboarding();
  const { paywallSource, closePaywall } = useSubscriptionContext();
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
          <RootStack.Screen name="PilotagePaywallModal">
            {({ navigation }) =>
              paywallSource ? (
                <PilotagePaywallModal
                  source={paywallSource}
                  onClose={() => {
                    closePaywall();
                    navigation.goBack();
                  }}
                  onSuccess={() => {
                    closePaywall();
                    navigation.navigate('MainTabs' as never, { screen: 'Pilotage' } as never);
                  }}
                />
              ) : null
            }
          </RootStack.Screen>
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

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  lockedCard: {
    gap: spacing.md,
  },
  lockedEyebrow: {
    ...typography.overline,
    color: colors.primary,
  },
  lockedTitle: {
    ...typography.h1,
    color: colors.ink,
  },
  lockedText: {
    ...typography.body,
    color: colors.inkSecondary,
  },
});
