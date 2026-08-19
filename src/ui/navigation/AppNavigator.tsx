import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SimulatorScreen } from '../screens/SimulatorScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useHistorySync } from '../hooks/useHistorySync';
import { colors, typography } from '../theme';

export type RootTabParamList = {
  Simulateur: undefined;
  Historique: undefined;
  Parametres: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppNavigator() {
  useHistorySync();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'calculator';

          if (route.name === 'Simulateur') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Historique') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Parametres') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          height: 64,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Simulateur" component={SimulatorScreen} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
      <Tab.Screen name="Parametres" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
