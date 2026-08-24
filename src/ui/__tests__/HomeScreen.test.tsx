import React from 'react';
import { HomeScreen } from '../screens/HomeScreen';
import { render, fireEvent, screen } from './test-utils';

describe('HomeScreen', () => {
  it('renders activity selection as the first step', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    expect(screen.getByText('Quelle est ton activité ?')).toBeTruthy();
    expect(screen.getByText('Vente')).toBeTruthy();
    expect(screen.getByText('Libéral')).toBeTruthy();
  });

  it('selects an activity and moves to revenue step', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.press(screen.getByText('Libéral'));
    expect(screen.getByText('Ton chiffre d\'affaires')).toBeTruthy();
  });

  it('allows entering a revenue amount', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.press(screen.getByText('Libéral'));
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    expect(screen.getByDisplayValue('50000')).toBeTruthy();
  });

  it('calls onCalculate when pressing the calculate button', () => {
    const onCalculate = jest.fn();
    render(<HomeScreen onCalculate={onCalculate} />);
    fireEvent.press(screen.getByText('Libéral'));
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer'));
    expect(onCalculate).toHaveBeenCalled();
  });

  it('shows the Cipav helper text', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    expect(
      screen.getByText('Professions réglementées (Cipav) : bientôt disponibles.')
    ).toBeTruthy();
  });
});
