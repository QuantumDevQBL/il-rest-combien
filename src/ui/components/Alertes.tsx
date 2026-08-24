import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Icon } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { ResultatMicro } from '../../engine/types';

interface AlertesProps {
  result: ResultatMicro;
}

interface AlerteItem {
  key: string;
  message: string;
  variant: 'alert' | 'info';
}

export function Alertes({ result }: AlertesProps) {
  const alertes: AlerteItem[] = [];

  if (result.depasseSeuilBaseTVA) {
    alertes.push({
      key: 'tva-base',
      variant: 'info',
      message:
        'Tu dépasses le seuil de franchise de TVA. Tu devras la facturer à partir du 1er janvier prochain.',
    });
  }

  if (result.depasseSeuilMajoreTVA) {
    alertes.push({
      key: 'tva-majore',
      variant: 'alert',
      message:
        'Tu dépasses le seuil majoré de TVA. Elle est due dès le 1er jour du mois de dépassement.',
    });
  }

  if (result.depassePlafondMicro) {
    alertes.push({
      key: 'plafond-micro',
      variant: 'alert',
      message:
        'Tu dépasses le plafond du régime micro. La sortie n\'intervient qu\'après deux années consécutives de dépassement.',
    });
  }

  if (alertes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Seuils</Text>
      {alertes.map((alerte) => (
        <Card
          key={alerte.key}
          variant="filled"
          style={[
            styles.alerte,
            alerte.variant === 'alert' ? styles.alerteWarning : styles.alerteInfo,
          ]}
        >
          <Icon
            name={alerte.variant === 'alert' ? 'warning' : 'informationCircle'}
            size={20}
            color={alerte.variant === 'alert' ? colors.alert : colors.info}
          />
          <Text
            style={[
              styles.alerteText,
              alerte.variant === 'alert' && styles.alerteTextWarning,
            ]}
          >
            {alerte.message}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.inkSecondary,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
  },
  alerte: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  alerteInfo: {
    backgroundColor: colors.secondaryLight,
  },
  alerteWarning: {
    backgroundColor: colors.alertLight,
  },
  alerteText: {
    ...typography.bodySmall,
    color: colors.ink,
    lineHeight: 20,
    marginLeft: spacing.sm,
    flex: 1,
  },
  alerteTextWarning: {
    color: '#B45309',
  },
});
