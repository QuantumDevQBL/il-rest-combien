import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { couleurs, spacing, type } from '../theme';
import { useCalculator } from '../hooks/useCalculator';
import { ActivitySection } from '../components/ActivitySection';
import { RevenueSection } from '../components/RevenueSection';
import { FoyerSection } from '../components/FoyerSection';
import { ImpotSection } from '../components/ImpotSection';
import { Counter } from '../components/Counter';
import { Decompte } from '../components/Decompte';
import { Comparaison } from '../components/Comparaison';
import { Alertes } from '../components/Alertes';
import { NonCompte } from '../components/NonCompte';
import { CalculInverse } from '../components/CalculInverse';
import { MentionLegale } from '../components/MentionLegale';
import { formatMontant } from '../utils/format';

export function CalculatorScreen() {
  const {
    form,
    result,
    error,
    caRequis,
    tjmRequis,
    setFormField,
  } = useCalculator();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ce qu'il te reste vraiment</Text>
          <Text style={styles.subtitle}>Micro-entreprise · barèmes 2026</Text>
        </View>

        {result && (
          <Counter
            resteSurCent={result.resteSurCent}
            totalPrelevements={
              result.totalPrelevementsSociaux + result.impotRetenu
            }
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

        {result && <Decompte result={result} />}
        {result && <Comparaison result={result} />}
        {result && <Alertes result={result} />}
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
    backgroundColor: couleurs.papier,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: couleurs.papier,
  },
  title: {
    ...type.titre,
    color: couleurs.encre,
  },
  subtitle: {
    ...type.label,
    marginTop: spacing.xs,
  },
});
