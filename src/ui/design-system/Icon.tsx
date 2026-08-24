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
  | 'briefcaseFilled'
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
  | 'helpCircle'
  | 'settings'
  | 'time'
  | 'home'
  | 'arrowBack'
  | 'close'
  | 'search'
  | 'statsChart'
  | 'sparkles'
  | 'shieldCheckmark'
  | 'swapHorizontal'
  | 'bag'
  | 'bagFilled'
  | 'hammer'
  | 'hammerFilled'
  | 'medical'
  | 'school'
  | 'business'
  | 'businessFilled'
  | 'download'
  | 'cart'
  | 'cartFilled'
  | 'construct'
  | 'documentText'
  | 'trophy'
  | 'lockClosed'
  | 'flash'
  | 'call';

const ICON_MAP: Record<IconName, keyof typeof Ionicons.glyphMap> = {
  wallet: 'wallet-outline',
  trendingUp: 'trending-up-outline',
  trendingDown: 'trending-down-outline',
  people: 'people-outline',
  person: 'person-outline',
  briefcase: 'briefcase-outline',
  briefcaseFilled: 'briefcase',
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
  settings: 'settings-outline',
  time: 'time-outline',
  home: 'home-outline',
  arrowBack: 'arrow-back-outline',
  close: 'close-outline',
  search: 'search-outline',
  statsChart: 'stats-chart-outline',
  sparkles: 'sparkles-outline',
  shieldCheckmark: 'shield-checkmark-outline',
  swapHorizontal: 'swap-horizontal-outline',
  bag: 'bag-outline',
  bagFilled: 'bag',
  hammer: 'hammer-outline',
  hammerFilled: 'hammer',
  medical: 'medical-outline',
  school: 'school-outline',
  business: 'business-outline',
  businessFilled: 'business',
  download: 'download-outline',
  cart: 'cart-outline',
  cartFilled: 'cart',
  construct: 'construct-outline',
  documentText: 'document-text-outline',
  trophy: 'trophy-outline',
  lockClosed: 'lock-closed-outline',
  flash: 'flash-outline',
  call: 'call-outline',
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color = colors.ink }: IconProps) {
  return <Ionicons name={ICON_MAP[name]} size={size} color={color} />;
}
