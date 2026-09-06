import React from 'react';
import { render as rtlRender, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MonthlyRevenueEntry } from '../../domain/pilotage';
import * as pilotageStorage from '../../storage/pilotageStorage';
import { CalculatorProvider } from '../context/CalculatorContext';
import { PilotageScreen } from '../screens/PilotageScreen';
import * as analytics from '../utils/analytics';
import { formatMontant } from '../utils/format';
import { resetAsyncStorage } from './__mocks__/async-storage';

jest.mock('../../storage/pilotageStorage');

function renderPilotage(initialForm: Record<string, unknown> = {}) {
  return rtlRender(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 375, height: 812 },
        insets: { top: 44, left: 0, right: 0, bottom: 34 },
      }}
    >
      <NavigationContainer>
        <CalculatorProvider initialForm={initialForm}>
          <PilotageScreen onOpenSettings={jest.fn()} />
        </CalculatorProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

describe('PilotageScreen objective and alerts', () => {
  const mockedStorage = pilotageStorage as jest.Mocked<typeof pilotageStorage>;
  const baseEntry: MonthlyRevenueEntry = {
    year: 2026,
    month: 7,
    revenue: 4000,
    createdAt: '2026-07-31T10:00:00.000Z',
    updatedAt: '2026-07-31T10:00:00.000Z',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-15T10:00:00.000Z'));
    resetAsyncStorage();
    jest.spyOn(analytics, 'trackEvent').mockImplementation(() => Promise.resolve());
    mockedStorage.listMonthlyRevenueEntries.mockResolvedValue([]);
    mockedStorage.upsertMonthlyRevenueEntry.mockResolvedValue([baseEntry]);
    mockedStorage.deleteMonthlyRevenueEntry.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('shows the empty state and creates the first month entry', async () => {
    renderPilotage();

    await waitFor(() => {
      expect(screen.getByText('Commencez votre suivi mensuel')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Ajouter un mois'));
    fireEvent.changeText(screen.getByLabelText('CA encaisse'), '4000');
    fireEvent.press(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(mockedStorage.upsertMonthlyRevenueEntry).toHaveBeenCalledWith({
        year: 2026,
        month: 8,
        revenue: 4000,
      });
    });

    expect(analytics.trackEvent).toHaveBeenCalledWith('monthly_revenue_entry_created');
  });

  it('renders the objective section and tracks its view', async () => {
    mockedStorage.listMonthlyRevenueEntries.mockResolvedValue([baseEntry]);

    renderPilotage({
      activity: 'PROFESSION_LIBERALE',
      chargesFixesAnnuelles: '1200',
      rfrN2: '25000',
      partsFiscalesN2: '1',
      objectifNetMensuel: '3000',
    });

    await waitFor(() => {
      expect(screen.getByText('Objectif')).toBeTruthy();
    });

    expect(screen.getByText('Objectif net mensuel')).toBeTruthy();
    expect(screen.getByText('CA annuel necessaire')).toBeTruthy();
    expect(analytics.trackEvent).toHaveBeenCalledWith('pilotage_objective_viewed');
  });

  it('updates and deletes an objective through the modal', async () => {
    mockedStorage.listMonthlyRevenueEntries.mockResolvedValue([baseEntry]);

    renderPilotage({
      activity: 'PROFESSION_LIBERALE',
      rfrN2: '25000',
      partsFiscalesN2: '1',
      objectifNetMensuel: '3000',
    });

    await waitFor(() => {
      expect(screen.getAllByText('Modifier').length).toBeGreaterThan(0);
    });

    fireEvent.press(screen.getAllByText('Modifier')[0]);
    fireEvent.changeText(screen.getByLabelText('Objectif net mensuel'), '3500');
    fireEvent.press(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(analytics.trackEvent).toHaveBeenCalledWith('pilotage_objective_updated');
    });

    fireEvent.press(screen.getAllByText('Modifier')[0]);
    const deleteButtons = screen.getAllByText('Supprimer');
    fireEvent.press(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(analytics.trackEvent).toHaveBeenCalledWith('pilotage_objective_deleted');
    });
  });

  it('shows objective catch-up and predictive alerts when projection is below target', async () => {
    mockedStorage.listMonthlyRevenueEntries.mockResolvedValue([baseEntry]);

    renderPilotage({
      activity: 'PROFESSION_LIBERALE',
      rfrN2: '25000',
      partsFiscalesN2: '1',
      objectifNetMensuel: '5000',
    });

    await waitFor(() => {
      expect(screen.getByText('Alertes')).toBeTruthy();
    });

    expect(screen.getByText('Objectif a rattraper')).toBeTruthy();
    expect(analytics.trackEvent).toHaveBeenCalledWith('alert_prediction_viewed');
  });

  it('deletes an existing month entry', async () => {
    mockedStorage.listMonthlyRevenueEntries.mockResolvedValue([baseEntry]);

    renderPilotage();

    await waitFor(() => {
      expect(screen.getByText('Historique mensuel')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Supprimer'));

    await waitFor(() => {
      expect(mockedStorage.deleteMonthlyRevenueEntry).toHaveBeenCalledWith(2026, 7);
    });

    expect(analytics.trackEvent).toHaveBeenCalledWith('monthly_revenue_entry_deleted');
  });
});

describe('PilotageScreen fixed charges', () => {
  const mockedStorage = pilotageStorage as jest.Mocked<typeof pilotageStorage>;
  const baseEntry: MonthlyRevenueEntry = {
    year: 2026,
    month: 7,
    revenue: 4000,
    createdAt: '2026-07-31T10:00:00.000Z',
    updatedAt: '2026-07-31T10:00:00.000Z',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-15T10:00:00.000Z'));
    resetAsyncStorage();
    jest.spyOn(analytics, 'trackEvent').mockImplementation(() => Promise.resolve());
    mockedStorage.listMonthlyRevenueEntries.mockResolvedValue([baseEntry]);
    mockedStorage.upsertMonthlyRevenueEntry.mockResolvedValue([baseEntry]);
    mockedStorage.deleteMonthlyRevenueEntry.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('shows an empty-state prompt when no charge is recorded yet', async () => {
    renderPilotage();

    await waitFor(() => {
      expect(screen.getByText('Charges fixes recurrentes')).toBeTruthy();
    });

    expect(screen.getByText(/Ajoutez vos charges recurrentes/)).toBeTruthy();
  });

  it('adds a recurring charge, shows its annual total and tracks it', async () => {
    renderPilotage();

    await waitFor(() => {
      expect(screen.getByText('Charges fixes recurrentes')).toBeTruthy();
    });

    fireEvent.press(screen.getAllByText('Ajouter')[0]);
    fireEvent.changeText(screen.getByLabelText('Intitule'), 'Loyer');
    fireEvent.changeText(screen.getByLabelText('Montant mensuel'), '500');
    fireEvent.press(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(screen.getByText('Loyer')).toBeTruthy();
    });

    expect(screen.getByText(`${formatMontant(500)} / mois`)).toBeTruthy();
    expect(screen.getByText(formatMontant(500 * 12))).toBeTruthy();
    expect(analytics.trackEvent).toHaveBeenCalledWith('fixed_charge_created');
  });

  it('edits and deletes a recurring charge', async () => {
    renderPilotage();

    await waitFor(() => {
      expect(screen.getByText('Charges fixes recurrentes')).toBeTruthy();
    });

    fireEvent.press(screen.getAllByText('Ajouter')[0]);
    fireEvent.changeText(screen.getByLabelText('Intitule'), 'Assurance');
    fireEvent.changeText(screen.getByLabelText('Montant mensuel'), '60');
    fireEvent.press(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(screen.getByText('Assurance')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Modifier Assurance'));
    fireEvent.changeText(screen.getByLabelText('Montant mensuel'), '80');
    fireEvent.press(screen.getByText('Enregistrer'));

    await waitFor(() => {
      expect(analytics.trackEvent).toHaveBeenCalledWith('fixed_charge_updated');
    });

    fireEvent.press(screen.getByLabelText('Supprimer Assurance'));

    await waitFor(() => {
      expect(analytics.trackEvent).toHaveBeenCalledWith('fixed_charge_deleted');
    });

    expect(screen.queryByText('Assurance')).toBeNull();
    expect(screen.getByText(/Ajoutez vos charges recurrentes/)).toBeTruthy();
  });
});
