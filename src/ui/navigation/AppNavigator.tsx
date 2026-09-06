import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useCalculatorContext } from '../context/CalculatorContext';
import { useSubscriptionContext } from '../context/SubscriptionContext';
import { Button, Card, Icon } from '../design-system';
import { useHistorySync } from '../hooks/useHistorySync';
import { useOnboarding } from '../hooks/useOnboarding';
import { DetailModal } from '../modals/DetailModal';
import { HistoryModal } from '../modals/HistoryModal';
import { InverseModal } from '../modals/InverseModal';
import { SettingsModal } from '../modals/SettingsModal';
import { HomeScreen } from '../screens/HomeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PilotageLockedScreen } from '../screens/PilotageLockedScreen';
import { PilotageScreen } from '../screens/PilotageScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { colors, spacing, typography } from '../theme';

export type RootStackParamList = {
  MainTabs: undefined;
  SettingsModal: undefined;
  HistoryModal: undefined;
  InverseModal: undefined;
  DetailModal: undefined;
};

type MainTabParamList = {
  Accueil: undefined;
  Resultat: undefined;
  Pilotage: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const IS_TEST_ENV = process.env.NODE_ENV === 'test';

function HistorySync() {
  useHistorySync();
  return null;
}

function HomeTabScreen({
  navigation,
}: {
  navigation: { getParent: () => unknown; navigate: (name: string) => void };
}) {
  return (
    <HomeScreen
      onCalculate={() => navigation.navigate('Resultat')}
      onOpenHistory={() => (navigation.getParent() as { navigate: (name: string) => void } | undefined)?.navigate('HistoryModal')}
    />
  );
}

function ResultEmptyScreen({ onGoToSimulation }: { onGoToSimulation: () => void }) {
  return (
    <SafeAreaView style={styles.emptyContainer} edges={['top', 'left', 'right']}>
      <View style={styles.emptyTopBar}>
        <View style={styles.emptyTopCopy}>
          <Text style={styles.emptyEyebrow}>Resultat</Text>
          <Text style={styles.emptyTopTitle}>Votre estimation</Text>
        </View>
      </View>
      <View style={styles.emptyContent}>
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Le resultat apparait ici apres votre simulation.</Text>
          <Text style={styles.emptyText}>
            Entrez votre CA, choisissez votre activite, puis retrouvez ici votre net mensuel,
            votre net annuel et les alertes essentielles.
          </Text>
          <Button label="Faire une simulation" onPress={onGoToSimulation} />
        </Card>
      </View>
    </SafeAreaView>
  );
}

function ResultTabScreen({
  navigation,
}: {
  navigation: { getParent: () => unknown; navigate: (name: string) => void };
}) {
  const { result } = useCalculatorContext();
  const { isPremiumActive, openPaywall } = useSubscriptionContext();
  const parent = navigation.getParent() as { navigate: (name: string) => void } | undefined;

  if (!result) {
    return <ResultEmptyScreen onGoToSimulation={() => navigation.navigate('Accueil')} />;
  }

  return (
    <ResultScreen
      onReset={() => navigation.navigate('Accueil')}
      onOpenSettings={() => parent?.navigate('SettingsModal')}
      onOpenHistory={() => parent?.navigate('HistoryModal')}
      onOpenInverse={() => parent?.navigate('InverseModal')}
      onOpenDetail={() => parent?.navigate('DetailModal')}
      onOpenPilotage={(source) => {
        if (isPremiumActive) {
          navigation.navigate('Pilotage');
          return;
        }

        openPaywall(source);
        navigation.navigate('Pilotage');
      }}
    />
  );
}

function MainTabsScreen() {
  const { isPremiumActive, openPaywall } = useSubscriptionContext();
  const insets = useSafeAreaInsets();
  const tabBarBottomInset = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkTertiary,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 62 + tabBarBottomInset,
          paddingTop: 6,
          paddingBottom: tabBarBottomInset,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={
              route.name === 'Accueil'
                ? 'home'
                : route.name === 'Resultat'
                  ? 'calculator'
                  : 'statsChart'
            }
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Accueil" component={HomeTabScreen} />
      <Tab.Screen name="Resultat" component={ResultTabScreen} />
      <Tab.Screen
        name="Pilotage"
        listeners={{
          tabPress: () => {
            if (!isPremiumActive) {
              openPaywall('pilotage_tab');
            }
          },
        }}
      >
        {({ navigation }) =>
          isPremiumActive ? (
            <PilotageScreen
              onGoToSimulation={() => navigation.navigate('Accueil' as never)}
              onOpenSettings={() =>
                (navigation.getParent() as { navigate: (name: string) => void } | undefined)?.navigate(
                  'SettingsModal'
                )
              }
            />
          ) : (
            <PilotageLockedScreen onGoToSimulation={() => navigation.navigate('Accueil' as never)} />
          )
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { hasSeenOnboarding, isLoading, markAsSeen } = useOnboarding();

  if (isLoading) {
    return null;
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={() => void markAsSeen()} />;
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

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyTopBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  emptyTopCopy: {
    flex: 1,
  },
  emptyEyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  emptyTopTitle: {
    ...typography.h2,
    color: colors.ink,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyCard: {
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h1,
    color: colors.ink,
  },
  emptyText: {
    ...typography.body,
    color: colors.inkSecondary,
  },
});
