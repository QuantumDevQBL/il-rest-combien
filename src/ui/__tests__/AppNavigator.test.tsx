import React from 'react';
import { AppNavigator } from '../navigation/AppNavigator';
import { render, fireEvent, screen, waitFor } from './test-utils';
import { resetAsyncStorage } from './__mocks__/async-storage';

beforeEach(() => {
  resetAsyncStorage();
});

async function waitForOnboarding() {
  await waitFor(() => {
    expect(screen.getByText('Combien il te reste vraiment ?')).toBeTruthy();
  });
}

describe('AppNavigator', () => {
  it('shows onboarding on first launch', async () => {
    render(<AppNavigator />);
    await waitForOnboarding();
  });

  it('navigates from onboarding to home to result', async () => {
    render(<AppNavigator />);
    await waitForOnboarding();

    fireEvent.press(screen.getByText('Passer'));

    await waitFor(() => {
      expect(screen.getByText('Quelle est ton activité ?')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Profession libérale non réglementée'));
    const input = await waitFor(() => screen.getByPlaceholderText('0'));
    fireEvent.changeText(input, '50000');
    await waitFor(() => {
      expect(screen.getByDisplayValue('50000')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Calculer'));

    await waitFor(() => {
      expect(screen.getByText('Objectif de revenu')).toBeTruthy();
    });
  });

  it('opens settings modal from result screen', async () => {
    render(<AppNavigator />);
    await waitForOnboarding();

    fireEvent.press(screen.getByText('Passer'));
    await waitFor(() => {
      expect(screen.getByText('Quelle est ton activité ?')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Profession libérale non réglementée'));
    const input = await waitFor(() => screen.getByPlaceholderText('0'));
    fireEvent.changeText(input, '50000');
    await waitFor(() => {
      expect(screen.getByDisplayValue('50000')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Calculer'));

    await waitFor(() => {
      expect(screen.getByText('Objectif de revenu')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Paramètres fiscaux'));

    await waitFor(() => {
      expect(screen.getByText('Paramètres fiscaux')).toBeTruthy();
    });
  });
});
