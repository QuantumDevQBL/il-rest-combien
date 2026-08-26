import React from 'react';
import { CalculatorProvider } from '../context/CalculatorContext';
import { ResultScreen } from '../screens/ResultScreen';
import * as analytics from '../utils/analytics';
import { fireEvent, render, screen } from './test-utils';

const DEFAULT_HANDLERS = {
  onReset: jest.fn(),
  onOpenSettings: jest.fn(),
  onOpenHistory: jest.fn(),
  onOpenInverse: jest.fn(),
  onOpenDetail: jest.fn(),
};

function renderWithResult(initialForm = {}, handlers = {}) {
  return render(
    <CalculatorProvider initialForm={initialForm}>
      <ResultScreen {...DEFAULT_HANDLERS} {...handlers} />
    </CalculatorProvider>
  );
}

describe('ResultScreen', () => {
  beforeEach(() => {
    jest.spyOn(analytics, 'trackEvent').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing when no result is available', () => {
    const { queryByText } = renderWithResult();
    expect(queryByText(/reste vraiment par mois/)).toBeNull();
  });

  it('displays the main net amount and annual summary', () => {
    renderWithResult({
      activity: 'PROFESSION_LIBERALE',
      caAnnuelHT: '50000',
      rfrN2: '25000',
      partsFiscalesN2: '1',
    });

    expect(screen.getByText(/Lib/)).toBeTruthy();
    expect(screen.getByText(/reste vraiment par mois/)).toBeTruthy();
    expect(screen.getByText('3 000')).toBeTruthy();
    expect(screen.getAllByText(/36/).length).toBeGreaterThan(0);
  });

  it('displays the rest per 100 EUR and global tax rate', () => {
    renderWithResult({
      activity: 'PROFESSION_LIBERALE',
      caAnnuelHT: '50000',
      rfrN2: '25000',
      partsFiscalesN2: '1',
    });

    expect(screen.getByText(/72.*\/ 100/)).toBeTruthy();
    expect(screen.getByText('28.0 %')).toBeTruthy();
  });

  it('calls existing navigation callbacks', () => {
    const handlers = {
      onOpenSettings: jest.fn(),
      onOpenHistory: jest.fn(),
      onOpenInverse: jest.fn(),
      onOpenDetail: jest.fn(),
      onReset: jest.fn(),
    };

    renderWithResult(
      {
        activity: 'PROFESSION_LIBERALE',
        caAnnuelHT: '50000',
        rfrN2: '25000',
        partsFiscalesN2: '1',
      },
      handlers
    );

    fireEvent.press(screen.getByLabelText(/Accueil/));
    expect(handlers.onReset).toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText(/Param/));
    expect(handlers.onOpenSettings).toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText('Historique'));
    expect(handlers.onOpenHistory).toHaveBeenCalled();

    fireEvent.press(screen.getByText(/Objectif de revenu/));
    expect(handlers.onOpenInverse).toHaveBeenCalled();

    fireEvent.press(screen.getByText(/Voir le d/));
    expect(handlers.onOpenDetail).toHaveBeenCalled();
  });

  it('tracks result_viewed once for the same visible result', () => {
    const view = renderWithResult({
      activity: 'PROFESSION_LIBERALE',
      caAnnuelHT: '50000',
      rfrN2: '25000',
      partsFiscalesN2: '1',
    });

    const getResultViewedCalls = () =>
      (analytics.trackEvent as jest.Mock).mock.calls.filter(
        ([eventName]) => eventName === 'result_viewed'
      ).length;

    expect(analytics.trackEvent).toHaveBeenCalledWith('result_viewed');
    expect(getResultViewedCalls()).toBe(1);

    view.rerender(
      <CalculatorProvider
        initialForm={{
          activity: 'PROFESSION_LIBERALE',
          caAnnuelHT: '50000',
          rfrN2: '25000',
          partsFiscalesN2: '1',
        }}
      >
        <ResultScreen {...DEFAULT_HANDLERS} />
      </CalculatorProvider>
    );

    expect(getResultViewedCalls()).toBe(1);
  });
});
