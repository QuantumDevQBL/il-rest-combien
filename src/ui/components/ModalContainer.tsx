import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';
import { Icon } from '../design-system';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface ModalContainerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  scrollable?: boolean;
}

export function ModalContainer({
  title,
  onClose,
  children,
  scrollable = true,
}: ModalContainerProps) {
  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.sheet}>
            <View style={styles.handleBar}>
              <View style={styles.handle} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <PressableScale
                onPress={onClose}
                scale={0.88}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
              >
                <View style={styles.closeButton}>
                  <Icon name="close" size={22} color={colors.ink} />
                </View>
              </PressableScale>
            </View>

            {content}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
    maxHeight: '90%',
    ...shadows.lg,
  },
  handleBar: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.inkTertiary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.ink,
    flex: 1,
    marginRight: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  scroll: {
    maxHeight: '100%',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
});
