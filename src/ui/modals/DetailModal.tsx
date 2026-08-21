import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ModalContainer } from '../components/ModalContainer';
import { Decompte } from '../components/Decompte';
import { RepartitionChart } from '../components/RepartitionChart';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { colors, typography } from '../theme';

interface DetailModalProps {
  onClose: () => void;
}

export function DetailModal({ onClose }: DetailModalProps) {
  const { result } = useCalculatorContext();

  if (!result) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun résultat à afficher.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ModalContainer title="Détail complet" onClose={onClose}>
      <Decompte result={result} />
      <RepartitionChart result={result} />
      <Comparaison result={result} />
      <Alertes result={result} />
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.inkTertiary,
  },
});
