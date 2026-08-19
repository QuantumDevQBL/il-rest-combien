import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { EmptyState } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { useCalculator } from '../hooks/useCalculator';
import { ActivitySection } from '../components/ActivitySection';
import { RevenueSection } from '../components/RevenueSection';
import { FoyerSection } from '../components/FoyerSection';
import { ImpotSection } from '../components/ImpotSection';
import { Counter } from '../components/Counter';
import { Decompte } from '../components/Decompte';
import { RepartitionChart } from '../components/RepartitionChart';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { NonCompte } from '../components/NonCompte';
import { CalculInverse } from '../components/CalculInverse';
import { MentionLegale } from '../components/MentionLegale';

export function CalculatorScreen() {
  const {
    form,
    result,
    error,
    caRequis,
    tjmRequis,
    setFormField,
  } = useCalculator();

  const hasInput = form.caAnnuelHT !== '';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reste vraiment</Text>
          <Text style={styles.subtitle}>
            Combien te reste-t-il vraiment sur ton chiffre d'affaires ?
          </Text>
        </View>

        {result ? (
          <Counter
            resteSurCent={result.resteSurCent}
            totalPrelevements={
              result.totalPrelevementsSociaux + result.impotRetenu
            }
            tauxPrelevementGlobal={result.tauxPrelevementGlobal}
          />
        ) : hasInput ? null : (
          <EmptyState
            icon={undefined}
            title="Saisis ton chiffre d'affaires"
            description="Le simulateur te montrera immédiatement ce qu'il te reste après cotisations et impôt."
          />
        )}

        <ActivitySection
          activity={form.activity}
          onChange={(activity) => setFormField('activity', activity)}
        />

        <RevenueSection
          caAnnuelHT={form.caAnnuelHT}
          chargesFixes={form.chargesFixesAnnuelles}
          onChangeCa={(value) => setFormField('caAnnuelHT', value)}
          onChangeCharges={(value) =>
            setFormField('chargesFixesAnnuelles', value)
          }
          error={error}
        />

        <FoyerSection
          situationFamiliale={form.situationFamiliale}
          nbEnfants={form.nbEnfants}
          parentIsole={form.parentIsole}
          autresRevenus={form.autresRevenus}
          onChangeSituation={(value) =>
            setFormField('situationFamiliale', value)
          }
          onChangeNbEnfants={(value) => setFormField('nbEnfants', value)}
          onChangeParentIsole={(value) => setFormField('parentIsole', value)}
          onChangeAutresRevenus={(value) =>
            setFormField('autresRevenus', value)
          }
          error={error}
        />

        <ImpotSection
          rfrN2={form.rfrN2}
          partsFiscalesN2={form.partsFiscalesN2}
          onChangeRfr={(value) => setFormField('rfrN2', value)}
          onChangeParts={(value) => setFormField('partsFiscalesN2', value)}
          error={error}
        />

        {result && (
          <>
            <Decompte result={result} />
            <RepartitionChart result={result} />
            <Comparaison result={result} />
            <Alertes result={result} />
          </>
        )}

        <NonCompte />

        <CalculInverse
          objectifNetMensuel={form.objectifNetMensuel}
          onChangeObjectif={(value) => setFormField('objectifNetMensuel', value)}
          caRequis={caRequis}
          tjmRequis={tjmRequis}
        />

        <MentionLegale />
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl,
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
});
