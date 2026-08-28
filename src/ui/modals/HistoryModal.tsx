import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ModalContainer } from '../components/ModalContainer';
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
    setFormField('label', item.label);
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
    <ModalContainer title="Historique" onClose={onClose} scrollable={false}>
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
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PressableScale
              onPress={() => handleReuse(item)}
              scale={0.97}
              style={styles.item}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemTitleBlock}>
                  <Text style={styles.itemLabel} numberOfLines={1}>
                    {item.label || getActivityLabel(item.activity)}
                  </Text>
                  <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
                </View>
                <PressableScale
                  onPress={() => handleRemove(item.id)}
                  scale={0.85}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Supprimer cette simulation"
                >
                  <View style={styles.deleteButton}>
                    <Icon name="closeCircle" size={22} color={colors.inkTertiary} />
                  </View>
                </PressableScale>
              </View>
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
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 240,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  listSeparator: {
    height: spacing.sm,
  },
  item: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  itemTitleBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  itemLabel: {
    ...typography.body,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.xxs,
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
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  itemCa: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    flex: 1,
  },
  itemNet: {
    ...typography.amountLarge,
    color: colors.primary,
    textAlign: 'right',
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
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
