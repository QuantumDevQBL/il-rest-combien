import React from 'react';
import { SettingsModal } from '../modals/SettingsModal';
import { HistoryModal } from '../modals/HistoryModal';
import { InverseModal } from '../modals/InverseModal';
import { DetailModal } from '../modals/DetailModal';
import { CalculatorProvider } from '../context/CalculatorContext';
import { render, fireEvent, screen, waitFor } from './test-utils';
import { resetAsyncStorage } from './__mocks__/async-storage';

beforeEach(() => {
  resetAsyncStorage();
});

describe('SettingsModal', () => {
  it('renders fiscal parameters and closes', () => {
    render(
      <CalculatorProvider>
        <SettingsModal onClose={jest.fn()} />
      </CalculatorProvider>
    );
    expect(screen.getByText('Paramètres fiscaux')).toBeTruthy();
    expect(screen.getAllByText('Situation familiale').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Données N-2')).toBeTruthy();
  });

  it('allows changing the number of children', () => {
    render(
      <CalculatorProvider>
        <SettingsModal onClose={jest.fn()} />
      </CalculatorProvider>
    );
    const input = screen.getByLabelText('Enfants à charge');
    fireEvent.changeText(input, '2');
    expect(screen.getByDisplayValue('2')).toBeTruthy();
  });
});

describe('HistoryModal', () => {
  it('shows an empty state when no history exists', async () => {
    render(
      <CalculatorProvider>
        <HistoryModal onClose={jest.fn()} />
      </CalculatorProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Aucune simulation')).toBeTruthy();
    });
  });
});

describe('InverseModal', () => {
  it('renders the income objective input', () => {
    render(
      <CalculatorProvider>
        <InverseModal onClose={jest.fn()} />
      </CalculatorProvider>
    );
    expect(screen.getByText('Objectif de revenu')).toBeTruthy();
    expect(screen.getByLabelText('Objectif net mensuel')).toBeTruthy();
  });

  it('updates the objective amount', () => {
    render(
      <CalculatorProvider>
        <InverseModal onClose={jest.fn()} />
      </CalculatorProvider>
    );
    fireEvent.changeText(screen.getByLabelText('Objectif net mensuel'), '3000');
    expect(screen.getByDisplayValue('3000')).toBeTruthy();
  });
});

describe('DetailModal', () => {
  it('shows empty state when no result is available', () => {
    render(
      <CalculatorProvider>
        <DetailModal onClose={jest.fn()} />
      </CalculatorProvider>
    );
    expect(screen.getByText('Aucun résultat à afficher.')).toBeTruthy();
  });
});
