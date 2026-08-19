import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ChipGroup } from '../components/ChipGroup';
import { MoneyInput } from '../components/MoneyInput';
import { ResultCard } from '../components/ResultCard';
import { RepartitionBar } from '../components/RepartitionBar';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { CalculInverse } from '../components/CalculInverse';
import { ACTIVITY_OPTIONS, ActivityChoice } from '../mapping';
import { EmptyState } from '../design-system';
import { RootTabParamList } from '../navigation/AppNavigator';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { extractFieldErrors } from '../utils/errors';

type SimulatorNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Simulateur'>;

export function SimulatorScreen() {
  const { form, result, error, caRequis, tjmRequis, setFormField } = useCalculatorContext();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SimulatorNavigationProp>();
  const errors = extractFieldErrors(error);

  const hasInput = form.caAnnuelHT !== '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xxxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Il reste combien ?</Text>
          <Text style={styles.subtitle}>
            Découvre ce qu'il te reste vraiment après cotisations et impôt.
          </Text>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.sectionLabel}>Ton activité</Text>
          <ChipGroup
            options={ACTIVITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={form.activity}
            onChange={(activity) => setFormField('activity', activity as ActivityChoice)}
            accessibilityLabel="Type d'activité"
          />
          <Text style={styles.helper}>
            Professions réglementées (Cipav) non couvertes dans cette version.
          </Text>
        </View>

        <View style={styles.caSection}>
          <Text style={styles.sectionLabel}>Chiffre d'affaires annuel HT</Text>
          <MoneyInput
            value={form.caAnnuelHT}
            onChangeText={(value) => setFormField('caAnnuelHT', value)}
            accessibilityLabel="Chiffre d'affaires annuel hors taxes"
            error={errors.caAnnuelHT}
            autoFocus={false}
          />
        </View>

        {!hasInput && !result && (
          <EmptyState
            icon={undefined}
            title="Saisis ton chiffre d'affaires"
            description="Le simulateur te montrera immédiatement ce qu'il te reste après cotisations et impôt."
          />
        )}

        {result && (
          <>
            <ResultCard result={result} />
            <RepartitionBar result={result} />
            <Comparaison result={result} />
            <Alertes result={result} />
          </>
        )}

        <Pressable
          onPress={() => navigation.navigate('Parametres')}
          style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Modifier les paramètres fiscaux"
        >
          <Ionicons name="options-outline" size={20} color={colors.primary} />
          <Text style={styles.settingsText}>Paramètres fiscaux</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.inkTertiary} />
        </Pressable>

        <CalculInverse
          objectifNetMensuel={form.objectifNetMensuel}
          onChangeObjectif={(value) => setFormField('objectifNetMensuel', value)}
          caRequis={caRequis}
          tjmRequis={tjmRequis}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkSecondary,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.inkSecondary,
    marginBottom: spacing.sm,
  },
  activitySection: {
    marginBottom: spacing.lg,
  },
  helper: {
    ...typography.caption,
    color: colors.inkTertiary,
    marginTop: spacing.sm,
  },
  caSection: {
    marginBottom: spacing.lg,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  settingsButtonPressed: {
    opacity: 0.7,
  },
  settingsText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.ink,
    flex: 1,
    marginLeft: spacing.sm,
  },
});
