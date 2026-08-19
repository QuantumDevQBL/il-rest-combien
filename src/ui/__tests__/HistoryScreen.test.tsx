import React from 'react';
import { render, screen, waitFor } from './test-utils';
import { HistoryScreen } from '../screens/HistoryScreen';

const mockGetItem = jest.fn(() => Promise.resolve<string | null>(null));
const mockSetItem = jest.fn(() => Promise.resolve());
const mockRemoveItem = jest.fn(() => Promise.resolve());

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: () => mockSetItem(),
  getItem: () => mockGetItem(),
  removeItem: () => mockRemoveItem(),
}));

describe('HistoryScreen', () => {
  beforeEach(() => {
    mockGetItem.mockReset().mockResolvedValue(null);
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
  });

  it('affiche un état vide quand il n\'y a pas d\'historique', async () => {
    render(<HistoryScreen />);

    await waitFor(() => {
      expect(screen.getByText('Aucune simulation')).toBeTruthy();
    });
  });

  it('affiche les simulations de l\'historique', async () => {
    const history = [
      {
        id: '1',
        date: new Date().toISOString(),
        activity: 'PROFESSION_LIBERALE',
        caAnnuelHT: 50000,
        revenuNetDisponible: 36000,
        scenarioLePlusFavorable: 'VL',
      },
    ];
    mockGetItem.mockResolvedValue(JSON.stringify(history));
    render(<HistoryScreen />);

    await waitFor(() => {
      expect(screen.getByText('Profession libérale non réglementée')).toBeTruthy();
    });

    expect(screen.getByText('CA 50 000 €')).toBeTruthy();
    expect(screen.getByText('36 000 € net')).toBeTruthy();
  });
});
