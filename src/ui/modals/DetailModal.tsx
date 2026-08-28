import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alertes } from '../components/Alertes';
import { Comparaison } from '../components/Comparaison';
import { Decompte } from '../components/Decompte';
import { ModalContainer } from '../components/ModalContainer';
import { RepartitionChart } from '../components/RepartitionChart';
import { useCalculatorContext } from '../context/CalculatorContext';
import { colors, typography } from '../theme';

interface DetailModalProps {
  onClose: () => void;
}

export function DetailModal({ onClose }: DetailModalProps) {
  const { result } = useCalculatorContext();

  if (!result) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={['top', 'left', 'right']}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun resultat a afficher.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ModalContainer title="Detail complet" onClose={onClose}>
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
