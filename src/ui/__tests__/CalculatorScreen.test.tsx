import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { CalculatorScreen } from '../screens/CalculatorScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('CalculatorScreen', () => {
  it('calcule le cas nominal BNC avec versement libératoire', async () => {
    render(<CalculatorScreen />);

    // Déplier la section impôt pour renseigner le RFR N-2
    const impotToggle = screen.getByLabelText('Déplier la section impôt');
    fireEvent.press(impotToggle);

    const rfrInput = screen.getByLabelText(
      'Revenu fiscal de référence N-2, en euros'
    );
    fireEvent.changeText(rfrInput, '25000');

    const caInput = screen.getByLabelText(
      "Chiffre d'affaires annuel hors taxes, en euros"
    );
    fireEvent.changeText(caInput, '50000');

    await waitFor(() => {
      expect(screen.getByText('72 €')).toBeTruthy();
    });

    expect(screen.getByText('Il te reste')).toBeTruthy();
    expect(screen.getByText('36 000 €')).toBeTruthy();
  });

  it('met à jour le résultat quand on change le type d\'activité', async () => {
    render(<CalculatorScreen />);

    const activityPicker = screen.getByTestId('Type d\'activité');
    fireEvent(activityPicker, 'valueChange', 'VENTE_MARCHANDISES');

    const caInput = screen.getByLabelText(
      "Chiffre d'affaires annuel hors taxes, en euros"
    );
    fireEvent.changeText(caInput, '80000');

    await waitFor(() => {
      expect(screen.getByText('86,41 €')).toBeTruthy();
    });
  });

  it('affiche la comparaison quand le RFR N-2 est renseigné', async () => {
    render(<CalculatorScreen />);

    const caInput = screen.getByLabelText(
      "Chiffre d'affaires annuel hors taxes, en euros"
    );
    fireEvent.changeText(caInput, '50000');

    const impotToggle = screen.getByLabelText('Déplier la section impôt');
    fireEvent.press(impotToggle);

    const rfrInput = screen.getByLabelText(
      'Revenu fiscal de référence N-2, en euros'
    );
    fireEvent.changeText(rfrInput, '25000');

    await waitFor(() => {
      expect(screen.getByText('Versement libératoire')).toBeTruthy();
    });

    expect(screen.getByText('Barème progressif')).toBeTruthy();
  });

  it('affiche une alerte quand le CA dépasse le plafond micro', async () => {
    render(<CalculatorScreen />);

    const caInput = screen.getByLabelText(
      "Chiffre d'affaires annuel hors taxes, en euros"
    );
    fireEvent.changeText(caInput, '90000');

    await waitFor(() => {
      expect(
        screen.getByText(/Tu dépasses le plafond du régime micro/)
      ).toBeTruthy();
    });
  });

  it('calcule le CA requis pour un objectif net mensuel', async () => {
    render(<CalculatorScreen />);

    const objectifInput = screen.getByLabelText(
      'Revenu net mensuel visé, en euros'
    );
    fireEvent.changeText(objectifInput, '3000');

    await waitFor(() => {
      expect(screen.getByText('CA annuel requis')).toBeTruthy();
    });

    expect(screen.getByText(/CA mensuel moyen/)).toBeTruthy();
  });

  it('affiche le parent isolé seulement pour un célibataire avec enfants', () => {
    render(<CalculatorScreen />);

    const parentIsoleCheckbox = screen.getByLabelText('Case parent isolé');
    expect(parentIsoleCheckbox).toBeTruthy();

    // Par défaut célibataire avec 0 enfant, le toggle doit être désactivé
    expect(parentIsoleCheckbox.props.accessibilityState.disabled).toBe(true);
  });
});
