import React from 'react';
import { render, fireEvent, screen, waitFor } from './test-utils';
import { AppNavigator } from '../navigation/AppNavigator';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('AppNavigator', () => {
  it('affiche l\'écran Simulateur par défaut', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText('Il reste combien ?')).toBeTruthy();
    });
  });

  it('navigue vers l\'onglet Paramètres', async () => {
    render(<AppNavigator />);

    const parametresTab = screen.getByLabelText('Parametres, tab, 3 of 3');
    fireEvent.press(parametresTab);

    await waitFor(() => {
      expect(screen.getByText('Données N-2 (avis d\'imposition)')).toBeTruthy();
    });
  });

  it('navigue vers l\'onglet Historique', async () => {
    render(<AppNavigator />);

    const historiqueTab = screen.getByLabelText('Historique, tab, 2 of 3');
    fireEvent.press(historiqueTab);

    await waitFor(() => {
      expect(screen.getByText('Aucune simulation')).toBeTruthy();
    });
  });
});
