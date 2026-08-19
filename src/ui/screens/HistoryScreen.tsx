import React from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useCalculatorContext } from '../context/CalculatorContext';
import { useHistory } from '../hooks/useHistory';
import { EmptyState, Button } from '../design-system';
import { RootTabParamList } from '../navigation/AppNavigator';
import { getActivityLabel } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';
import { formatMontant } from '../utils/format';

type HistoryNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Historique'>;

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function HistoryScreen() {
  const { items, isLoading, removeItem, clearHistory } = useHistory();
  const { setFormField } = useCalculatorContext();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HistoryNavigationProp>();

  const handleClear = () => {
    Alert.alert(
      'Vider l\'historique',
      'Tu vas supprimer toutes les simulations enregistrées. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Vider', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  const handleRemove = (id: string) => {
    void removeItem(id);
  };

  const handleReuse = (item: (typeof items)[number]) => {
    setFormField('activity', item.activity);
    setFormField('caAnnuelHT', String(item.caAnnuelHT));
    navigation.navigate('Simulateur');
  };

  if (!isLoading && items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Historique</Text>
        </View>
        <EmptyState
          icon={undefined}
          title="Aucune simulation"
          description="Tes calculs apparaîtront ici. Fais une simulation pour commencer."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique</Text>
        {items.length > 0 && (
          <Button label="Vider" onPress={handleClear} variant="tertiary" />
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xxxl },
        ]}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleReuse(item)}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Simulation du ${formatDate(item.date)}`}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
              <Pressable
                onPress={() => handleRemove(item.id)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Supprimer cette simulation"
              >
                <Ionicons name="close-circle" size={24} color={colors.inkTertiary} />
              </Pressable>
            </View>
            <Text style={styles.itemActivity}>{getActivityLabel(item.activity)}</Text>
            <View style={styles.itemFooter}>
              <Text style={styles.itemCa}>CA {formatMontant(item.caAnnuelHT)}</Text>
              <Text style={styles.itemNet}>{formatMontant(item.revenuNetDisponible)} net</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.scenarioLePlusFavorable === 'VL' ? 'VL gagnant' : 'Barème gagnant'}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  itemPressed: {
    opacity: 0.8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemDate: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  itemActivity: {
    ...typography.body,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCa: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  itemNet: {
    ...typography.amountLarge,
    color: colors.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
