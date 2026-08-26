import React from 'react';
import { AppNavigator } from '../navigation/AppNavigator';
import * as analytics from '../utils/analytics';
import { resetAsyncStorage } from './__mocks__/async-storage';
import { fireEvent, render, screen, waitFor } from './test-utils';

beforeEach(() => {
  resetAsyncStorage();
  jest.spyOn(analytics, 'trackEvent').mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AppNavigator', () => {
  const homePrompt = /Le vrai net/;

  it('shows home on launch', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });
  });

  it('navigates from home to result', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer mon net'));

    await waitFor(() => {
      expect(screen.getByText(/Objectif de revenu/)).toBeTruthy();
    });
  });

  it('opens settings modal from result screen', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer mon net'));

    await waitFor(() => {
      expect(screen.getByText(/Objectif de revenu/)).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText(/Paramètres fiscaux/));

    await waitFor(() => {
      expect(screen.getAllByText(/Param/).length).toBeGreaterThan(0);
    });
  });

  it('returns to home from the result header', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer mon net'));

    await waitFor(() => {
      expect(screen.getByLabelText('Accueil')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Accueil'));

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });
  });
});
