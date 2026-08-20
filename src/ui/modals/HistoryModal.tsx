import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { useHistory, HistoryItem } from '../hooks/useHistory';
import { EmptyState, Button, Icon } from '../design-system';
import { PressableScale } from '../components/PressableScale';
import { getActivityLabel } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';
import { formatMontant } from '../utils/format';

interface HistoryModalProps {
  onClose: () => void;
}

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

export function HistoryModal({ onClose }: HistoryModalProps) {
  const { items, isLoading, removeItem, clearHistory } = useHistory();
  const { setFormField } = useCalculatorContext();

  const handleReuse = (item: HistoryItem) => {
    setFormField('activity', item.activity);
    setFormField('caAnnuelHT', String(item.caAnnuelHT));
    onClose();
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique</Text>
        <PressableScale onPress={onClose} scale={0.9}>
          <View style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.ink} />
          </View>
        </PressableScale>
      </View>

      {!isLoading && items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="time-outline"
            title="Aucune simulation"
            description="Tes calculs apparaîtront ici. Fais une simulation pour commencer."
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PressableScale
              onPress={() => handleReuse(item)}
              scale={0.97}
              style={styles.item}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
                <PressableScale
                  onPress={() => handleRemove(item.id)}
                  scale={0.85}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Supprimer cette simulation"
                >
                  <View style={styles.deleteButton}>
                    <Icon name="closeCircle" size={24} color={colors.inkTertiary} />
                  </View>
                </PressableScale>
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
            </PressableScale>
          )}
        />
      )}

      {items.length > 0 && (
        <View style={styles.footer}>
          <Button label="Vider l'historique" onPress={handleClear} variant="ghost" size="md" />
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.ink,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  item: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActivity: {
    ...typography.body,
    fontWeight: '700',
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
    color: colors.background,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
});
