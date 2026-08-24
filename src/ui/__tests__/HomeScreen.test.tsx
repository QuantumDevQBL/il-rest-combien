import React from 'react';
import { HomeScreen } from '../screens/HomeScreen';
import { render, fireEvent, screen } from './test-utils';

describe('HomeScreen', () => {
  it('renders activity selection on the main screen', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    expect(screen.getByText('Quelle est ton activité ?')).toBeTruthy();
    expect(screen.getByText('Vente')).toBeTruthy();
    expect(screen.getByText('Libéral')).toBeTruthy();
  });

  it('keeps activity selection on the same screen', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.press(screen.getByText('Libéral'));
    expect(screen.getByText('Quelle est ton activité ?')).toBeTruthy();
  });

  it('allows entering a revenue amount', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    expect(screen.getByDisplayValue('50000')).toBeTruthy();
  });

  it('calls onCalculate when pressing the calculate button', () => {
    const onCalculate = jest.fn();
    render(<HomeScreen onCalculate={onCalculate} />);
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer'));
    expect(onCalculate).toHaveBeenCalled();
  });

  it("shows the revenue helper text", () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    expect(screen.getByText("Chiffre d'affaires annuel HT")).toBeTruthy();
  });
});
