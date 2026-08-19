import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CalculatorProvider } from '../context/CalculatorContext';

function AllTheProviders({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 375, height: 812 },
        insets: { top: 44, left: 0, right: 0, bottom: 34 },
      }}
    >
      <CalculatorProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </CalculatorProvider>
    </SafeAreaProvider>
  );
}

export function render(ui: ReactElement, options?: RenderOptions) {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options });
}

export {
  fireEvent,
  screen,
  waitFor,
  within,
  act,
} from '@testing-library/react-native';
