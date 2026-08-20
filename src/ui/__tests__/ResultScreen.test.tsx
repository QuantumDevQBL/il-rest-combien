import React from 'react';
import { ResultScreen } from '../screens/ResultScreen';
import { CalculatorProvider } from '../context/CalculatorContext';
import { render, fireEvent, screen } from './test-utils';

const DEFAULT_HANDLERS = {
  onReset: jest.fn(),
  onOpenSettings: jest.fn(),
  onOpenHistory: jest.fn(),
  onOpenInverse: jest.fn(),
  onOpenDetail: jest.fn(),
};

function renderWithResult(initialForm = {}, handlers = {}) {
  return render(
    <CalculatorProvider initialForm={initialForm}>
      <ResultScreen {...DEFAULT_HANDLERS} {...handlers} />
    </CalculatorProvider>
  );
}

describe('ResultScreen', () => {
  it('renders nothing when no result is available', () => {
    const { queryByText } = renderWithResult();
    expect(queryByText('Il te reste')).toBeNull();
  });

  it('displays the main net amount and monthly equivalent', () => {
    renderWithResult({
      activity: 'PROFESSION_LIBERALE',
      caAnnuelHT: '50000',
      rfrN2: '25000',
      partsFiscalesN2: '1',
    });
    expect(screen.getByText('Il te reste')).toBeTruthy();
    expect(screen.getByText('36 000')).toBeTruthy();
    expect(screen.getByText('soit 3 000 € / mois')).toBeTruthy();
  });

  it('displays the rest per 100 € and global tax rate', () => {
    renderWithResult({
      activity: 'PROFESSION_LIBERALE',
      caAnnuelHT: '50000',
      rfrN2: '25000',
      partsFiscalesN2: '1',
    });
    expect(screen.getByText('Sur 100 € : 72 €')).toBeTruthy();
    expect(screen.getByText('Prélèvements : 28.0 %')).toBeTruthy();
  });

  it('calls navigation callbacks', () => {
    const handlers = {
      onOpenSettings: jest.fn(),
      onOpenHistory: jest.fn(),
      onOpenInverse: jest.fn(),
      onOpenDetail: jest.fn(),
      onReset: jest.fn(),
    };
    renderWithResult(
      {
        activity: 'PROFESSION_LIBERALE',
        caAnnuelHT: '50000',
        rfrN2: '25000',
        partsFiscalesN2: '1',
      },
      handlers
    );

    fireEvent.press(screen.getByLabelText('Paramètres fiscaux'));
    expect(handlers.onOpenSettings).toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText('Historique'));
    expect(handlers.onOpenHistory).toHaveBeenCalled();

    fireEvent.press(screen.getByText('Objectif de revenu'));
    expect(handlers.onOpenInverse).toHaveBeenCalled();

    fireEvent.press(screen.getByText('Voir le détail'));
    expect(handlers.onOpenDetail).toHaveBeenCalled();

    fireEvent.press(screen.getByText('Nouvelle simulation'));
    expect(handlers.onReset).toHaveBeenCalled();
  });
});
