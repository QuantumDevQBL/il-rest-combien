import React from 'react';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { render, fireEvent, screen } from './test-utils';

describe('OnboardingScreen', () => {
  it('renders the first slide', () => {
    render(<OnboardingScreen onComplete={jest.fn()} />);
    expect(screen.getByText('Tu saisis ton CA, tu vois ton vrai net')).toBeTruthy();
    expect(screen.getByText('Suivant')).toBeTruthy();
  });

  it('navigates to the next slide on next press', () => {
    render(<OnboardingScreen onComplete={jest.fn()} />);
    fireEvent.press(screen.getByText('Suivant'));
    expect(screen.getByText('Cotisations, impôt, reste sur 100 €')).toBeTruthy();
  });

  it('renders the last slide after two next presses', () => {
    render(<OnboardingScreen onComplete={jest.fn()} />);
    fireEvent.press(screen.getByText('Suivant'));
    fireEvent.press(screen.getByText('Suivant'));
    expect(screen.getByText('Simple, local, pensé pour la micro')).toBeTruthy();
    expect(screen.getByText('Commencer')).toBeTruthy();
  });

  it('calls onComplete when pressing Commencer on the last slide', () => {
    const onComplete = jest.fn();
    render(<OnboardingScreen onComplete={onComplete} />);

    fireEvent.press(screen.getByText('Suivant'));
    fireEvent.press(screen.getByText('Suivant'));

    fireEvent.press(screen.getByText('Commencer'));
    expect(onComplete).toHaveBeenCalled();
  });

  it('allows skipping onboarding', () => {
    const onComplete = jest.fn();
    render(<OnboardingScreen onComplete={onComplete} />);
    fireEvent.press(screen.getByText('Passer'));
    expect(onComplete).toHaveBeenCalled();
  });
});
