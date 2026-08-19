import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from './tokens';

export type IconName =
  | 'wallet'
  | 'trendingUp'
  | 'trendingDown'
  | 'people'
  | 'person'
  | 'briefcase'
  | 'warning'
  | 'informationCircle'
  | 'checkmarkCircle'
  | 'closeCircle'
  | 'calculator'
  | 'cash'
  | 'arrowForward'
  | 'chevronDown'
  | 'chevronUp'
  | 'menu'
  | 'helpCircle';

const ICON_MAP: Record<IconName, keyof typeof Ionicons.glyphMap> = {
  wallet: 'wallet-outline',
  trendingUp: 'trending-up-outline',
  trendingDown: 'trending-down-outline',
  people: 'people-outline',
  person: 'person-outline',
  briefcase: 'briefcase-outline',
  warning: 'warning-outline',
  informationCircle: 'information-circle-outline',
  checkmarkCircle: 'checkmark-circle-outline',
  closeCircle: 'close-circle-outline',
  calculator: 'calculator-outline',
  cash: 'cash-outline',
  arrowForward: 'arrow-forward-outline',
  chevronDown: 'chevron-down-outline',
  chevronUp: 'chevron-up-outline',
  menu: 'menu-outline',
  helpCircle: 'help-circle-outline',
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({
  name,
  size = 24,
  color = colors.ink,
}: IconProps) {
  return <Ionicons name={ICON_MAP[name]} size={size} color={color} />;
}
