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

    fireEvent.press(screen.getByLabelText(/Param/));

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

  it('opens the paywall from the result screen when pilotage is locked', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('0'), '50000');
    fireEvent.press(screen.getByText('Calculer mon net'));

    await waitFor(() => {
      expect(screen.getByText(/Objectif de revenu/)).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Ouvrir Pilotage'));

    await waitFor(() => {
      expect(screen.getByText(/Pilotez ce que vous pouvez reellement garder/)).toBeTruthy();
    });
  });

  it('opens the paywall from the Pilotage tab when premium is inactive', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Pilotage'));

    await waitFor(() => {
      expect(
        screen.getByText(/Pilotez ce que vous pouvez reellement garder/)
      ).toBeTruthy();
    });

    fireEvent.press(screen.getByText(/Voir/));

    await waitFor(() => {
      expect(screen.getByText(/Pilotez ce que vous pouvez reellement garder/)).toBeTruthy();
    });
  });

  it('returns to simulation from the Pilotage tab', async () => {
    render(<AppNavigator />);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Pilotage'));

    await waitFor(() => {
      expect(screen.getByText(/Voir l'offre Pilotage/)).toBeTruthy();
    });

    fireEvent.press(screen.getAllByText('Simuler')[1]);

    await waitFor(() => {
      expect(screen.getByText(homePrompt)).toBeTruthy();
    });
  });
});
