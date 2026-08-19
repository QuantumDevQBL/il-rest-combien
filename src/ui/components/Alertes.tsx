import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { couleurs, spacing, type } from '../theme';
import { ResultatMicro } from '../../engine/types';

interface AlertesProps {
  result: ResultatMicro;
}

export function Alertes({ result }: AlertesProps) {
  const alertes: { key: string; message: string }[] = [];

  if (result.depasseSeuilBaseTVA) {
    alertes.push({
      key: 'tva-base',
      message:
        'Tu dépasses le seuil de franchise de TVA. Tu devras la facturer à partir du 1er janvier prochain.',
    });
  }

  if (result.depasseSeuilMajoreTVA) {
    alertes.push({
      key: 'tva-majore',
      message:
        'Tu dépasses le seuil majoré de TVA. Elle est due dès le 1er jour du mois de dépassement.',
    });
  }

  if (result.depassePlafondMicro) {
    alertes.push({
      key: 'plafond-micro',
      message:
        'Tu dépasses le plafond du régime micro. La sortie n\'intervient qu\'après deux années consécutives de dépassement.',
    });
  }

  if (alertes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seuils</Text>
      {alertes.map((alerte) => (
        <View key={alerte.key} style={styles.alerte}>
          <Text style={styles.alerteText}>{alerte.message}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    ...type.eyebrow,
    color: couleurs.encreFaible,
    marginBottom: spacing.lg,
  },
  alerte: {
    borderLeftWidth: 3,
    borderLeftColor: couleurs.alerte,
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  alerteText: {
    ...type.corps,
    color: couleurs.encre,
    lineHeight: 22,
  },
});
