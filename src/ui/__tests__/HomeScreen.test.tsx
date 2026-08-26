import React from 'react';
import { HomeScreen } from '../screens/HomeScreen';
import * as analytics from '../utils/analytics';
import { fireEvent, render, screen } from './test-utils';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.spyOn(analytics, 'trackEvent').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the compact activity selection flow', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    expect(screen.getByText(/Quelle est ton activ/)).toBeTruthy();
    expect(screen.getByText('Vente')).toBeTruthy();
    expect(screen.getByText(/Lib/)).toBeTruthy();
  });

  it('moves to the revenue step after selecting an activity', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.press(screen.getByText(/Lib/));
    expect(screen.getByText(/Ton chiffre d'affaires/)).toBeTruthy();
  });

  it('allows entering a revenue amount after selecting an activity', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.press(screen.getByText(/Lib/));
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    expect(screen.getByDisplayValue('50000')).toBeTruthy();
  });

  it('calls onCalculate when pressing the calculate button', () => {
    const onCalculate = jest.fn();
    render(<HomeScreen onCalculate={onCalculate} />);
    fireEvent.press(screen.getByText(/Lib/));
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer'));
    expect(onCalculate).toHaveBeenCalled();
  });

  it('shows the revenue helper text on the revenue step', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.press(screen.getByText(/Lib/));
    expect(screen.getByText(/Hors taxes/)).toBeTruthy();
  });
});
