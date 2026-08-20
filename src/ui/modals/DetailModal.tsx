import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Decompte } from '../components/Decompte';
import { RepartitionChart } from '../components/RepartitionChart';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { Icon } from '../design-system';
import { PressableScale } from '../components/PressableScale';
import { colors, spacing, typography } from '../theme';

interface DetailModalProps {
  onClose: () => void;
}

export function DetailModal({ onClose }: DetailModalProps) {
  const { result } = useCalculatorContext();

  if (!result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Détail</Text>
          <PressableScale onPress={onClose} scale={0.9}>
            <View style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.ink} />
            </View>
          </PressableScale>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun résultat à afficher.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Détail complet</Text>
        <PressableScale onPress={onClose} scale={0.9}>
          <View style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.ink} />
          </View>
        </PressableScale>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Decompte result={result} />
        <RepartitionChart result={result} />
        <Comparaison result={result} />
        <Alertes result={result} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
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
