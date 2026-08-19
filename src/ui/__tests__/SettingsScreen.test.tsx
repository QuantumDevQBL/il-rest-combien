import React from 'react';
import { render, fireEvent, screen } from './test-utils';
import { SettingsScreen } from '../screens/SettingsScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('SettingsScreen', () => {
  it('affiche le parent isolé seulement pour un célibataire avec enfants', () => {
    render(<SettingsScreen />);

    const parentIsoleCheckbox = screen.getByLabelText('Case parent isolé');
    expect(parentIsoleCheckbox).toBeTruthy();
    expect(parentIsoleCheckbox.props.accessibilityState.disabled).toBe(true);
  });

  it('active le parent isolé quand on saisit un enfant', () => {
    render(<SettingsScreen />);

    const enfantsInput = screen.getByLabelText("Nombre d'enfants à charge");
    fireEvent.changeText(enfantsInput, '1');

    const parentIsoleCheckbox = screen.getByLabelText('Case parent isolé');
    expect(parentIsoleCheckbox.props.accessibilityState.disabled).toBe(false);
  });

  it('permet de renseigner le RFR N-2 et les parts fiscales', () => {
    render(<SettingsScreen />);

    const rfrInput = screen.getByLabelText('Revenu fiscal de référence N-2');
    fireEvent.changeText(rfrInput, '25000');
    expect(rfrInput.props.value).toBe('25000');

    const partsInput = screen.getByLabelText('Nombre de parts fiscales N-2');
    fireEvent.changeText(partsInput, '2,5');
    expect(partsInput.props.value).toBe('2,5');
  });
});
