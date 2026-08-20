import React, { createContext, useContext, ReactNode } from 'react';
import { useCalculator, CalculatorState, CalculatorActions } from '../hooks/useCalculator';
import { CalculatorForm } from '../types';

const CalculatorContext = createContext<(CalculatorState & CalculatorActions) | null>(null);

interface CalculatorProviderProps {
  children: ReactNode;
  initialForm?: Partial<CalculatorForm>;
}

export function CalculatorProvider({ children, initialForm }: CalculatorProviderProps) {
  const calculator = useCalculator(initialForm);
  return (
    <CalculatorContext.Provider value={calculator}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculatorContext(): CalculatorState & CalculatorActions {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorContext doit être utilisé dans un CalculatorProvider');
  }
  return context;
}
