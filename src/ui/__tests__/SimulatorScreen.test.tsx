import React from 'react';
import { render, fireEvent, screen, waitFor } from './test-utils';
import { SimulatorScreen } from '../screens/SimulatorScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('SimulatorScreen', () => {
  it('affiche le résultat principal pour un CA BNC', async () => {
    render(<SimulatorScreen />);

    const caInput = screen.getByLabelText("Chiffre d'affaires annuel hors taxes");
    fireEvent.changeText(caInput, '50000');

    await waitFor(() => {
      expect(screen.getByText('34 096 €')).toBeTruthy();
    });

    expect(screen.getByText(/Reste sur 100 €/)).toBeTruthy();
  });

  it('met à jour le résultat quand on change le type d\'activité', async () => {
    render(<SimulatorScreen />);

    const venteChip = screen.getByLabelText('Vente de marchandises');
    fireEvent.press(venteChip);

    const caInput = screen.getByLabelText("Chiffre d'affaires annuel hors taxes");
    fireEvent.changeText(caInput, '80000');

    await waitFor(() => {
      expect(screen.getByText('69 124 €')).toBeTruthy();
    });
  });

  it('affiche une alerte quand le CA dépasse le plafond micro', async () => {
    render(<SimulatorScreen />);

    const caInput = screen.getByLabelText("Chiffre d'affaires annuel hors taxes");
    fireEvent.changeText(caInput, '90000');

    await waitFor(() => {
      expect(
        screen.getByText(/Tu dépasses le plafond du régime micro/)
      ).toBeTruthy();
    });
  });

  it('calcule le CA requis pour un objectif net mensuel', async () => {
    render(<SimulatorScreen />);

    const objectifInput = screen.getByLabelText('Revenu net mensuel visé, en euros');
    fireEvent.changeText(objectifInput, '3000');

    await waitFor(() => {
      expect(screen.getByText('CA annuel requis')).toBeTruthy();
    });

    expect(screen.getByText(/CA mensuel moyen/)).toBeTruthy();
  });

  it('affiche un bouton vers les paramètres fiscaux', () => {
    render(<SimulatorScreen />);

    expect(screen.getByLabelText('Modifier les paramètres fiscaux')).toBeTruthy();
  });
});
