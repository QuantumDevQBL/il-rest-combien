import React from 'react';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { render, fireEvent, screen } from './test-utils';

describe('OnboardingScreen', () => {
  it('renders the first slide', () => {
    render(<OnboardingScreen onComplete={jest.fn()} />);
    expect(screen.getByText('Combien il te reste vraiment ?')).toBeTruthy();
    expect(screen.getByText('Suivant')).toBeTruthy();
  });

  it('navigates to the next slide on next press', () => {
    render(<OnboardingScreen onComplete={jest.fn()} />);
    fireEvent.press(screen.getByText('Suivant'));
    expect(screen.getByText('Barème ou versement libératoire ?')).toBeTruthy();
  });

  it('calls onComplete when reaching the last slide and pressing Commencer', () => {
    const onComplete = jest.fn();
    render(<OnboardingScreen onComplete={onComplete} />);

    fireEvent.press(screen.getByText('Suivant'));
    fireEvent.press(screen.getByText('Suivant'));

    expect(screen.getByText('Commencer')).toBeTruthy();
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
