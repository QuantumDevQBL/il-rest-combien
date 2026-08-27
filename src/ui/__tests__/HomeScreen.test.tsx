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

  it('renders the compact single-screen flow', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    expect(screen.getByText(/Le vrai net/)).toBeTruthy();
    expect(screen.getByText('Vente')).toBeTruthy();
    expect(screen.getAllByText(/Lib/).length).toBeGreaterThan(0);
    expect(screen.getByText('Calculer mon net')).toBeTruthy();
  });

  it('updates the activity summary after selecting an activity', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.press(screen.getByLabelText('Vente'));
    expect(screen.getByText('Commerce, revente')).toBeTruthy();
    expect(screen.getAllByText('Vente').length).toBeGreaterThan(0);
  });

  it('allows entering a revenue amount immediately', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    expect(screen.getByDisplayValue('50000')).toBeTruthy();
  });

  it('calls onCalculate when pressing the calculate button', () => {
    const onCalculate = jest.fn();
    render(<HomeScreen onCalculate={onCalculate} />);
    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer mon net'));
    expect(onCalculate).toHaveBeenCalled();
  });

  it('shows the revenue helper text on the main screen', () => {
    render(<HomeScreen onCalculate={jest.fn()} />);
    expect(screen.getByText(/CA annuel HT estime/)).toBeTruthy();
  });
});
