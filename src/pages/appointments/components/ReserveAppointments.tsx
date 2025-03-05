// Components
import { DailySchedule } from '@appointments/components/reserve/DailySchedule';
import { DateSelection } from '@appointments/components/reserve/DateSelection';
import { DialogReserve } from '@appointments/components/reserve/DialogReserve';
import { ProfessionalSelection } from '@appointments/components/reserve/ProfessionalSelection';
import { UsersCombo } from '@users/components/UsersCombo';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { format, parse } from '@formkit/tempo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// Imports
import type { IDialog } from '@core/interfaces/dialog.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { CalendarService } from '@appointments/services/calendar.service';
import { EDialogAction } from '@appointments/enums/dialog.enum';
import { EUserSearch, ESortingKeys } from '@users/enums/user-search.enum';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { RESERVE_APPOINTMENT_CONFIG as RA_CONFIG } from '@config/appointments/reserve-appointments.config';
import { UtilsString } from '@core/services/utils/string.service';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
import { useReserveFilters } from '@appointments/hooks/useReserveFilters';
// Constants
const DISABLED_DAYS: number[] = RA_CONFIG.calendar.disabledDays;
// React component
export default function ReserveAppointments() {
  const [dialogContent, setDialogContent] = useState<IDialog>({} as IDialog);
  const [disabledDays, setDisabledDays] = useState<number[]>(DISABLED_DAYS);
  const [handleDaysWithAppos, setHandleDaysWithAppos] = useState<{ day: string; action: string; id: string } | undefined>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [professionalKey, setProfessionalKey] = useState<string>('');
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional | undefined>(undefined);
  const [refreshAppos, setRefreshAppos] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedLegibleDate, setSelectedLegibleDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot>({} as ITimeSlot);
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { dateParam, professionalParam, clearFilters, setFilters } = useReserveFilters();
  const { i18n, t } = useTranslation();
  const selectedLocale: string = i18n.resolvedLanguage || i18n.language;

  // Set header menu item selected
  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  // Initialize from URL parameters
  useEffect(() => {
    if (dateParam) {
      setSelectedDate(parse(dateParam, 'YYYY-MM-DD'));
    }
  }, [dateParam]);

  // Calculate disabled days
  const $getDisabledDays = useMemo(() => {
    return (professionalSelected: IProfessional | undefined) => {
      return CalendarService.getDisabledDays(professionalSelected?.configuration.workingDays ?? []);
    };
  }, []);

  // Handle professional selection and changes
  const isManualSelection = useRef(false);

  useEffect(() => {
    if (!professionalSelected) return;

    // Always update disabled days
    const disabledDays = $getDisabledDays(professionalSelected);
    setDisabledDays(disabledDays);

    // Always set professional filter
    setFilters({ professionalParam: professionalSelected._id });

    // Clear date only if it's a manual selection
    if (isManualSelection.current) {
      clearFilters({ dateParam });
      setSelectedDate(undefined);
    }

    // Reset the flag after processing
    isManualSelection.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionalSelected, $getDisabledDays, setFilters, clearFilters]);

  // Handle date changes
  useEffect(() => {
    if (selectedDate) {
      setFilters({ dateParam: format(selectedDate, 'YYYY-MM-DD') });
    }
  }, [selectedDate, setFilters]);

  function handleClearFilters(): void {
    clearFilters({ dateParam, professionalParam });
    setProfessionalSelected(undefined);
    setSelectedDate(undefined);
    setProfessionalKey(crypto.randomUUID());
    isManualSelection.current = false;
  }

  // Set legible date
  const $legibleTodayDate: string = useMemo(() => {
    return format(selectedDate!, 'full', selectedLocale);
  }, [selectedDate, selectedLocale]);

  useEffect(() => {
    setSelectedLegibleDate($legibleTodayDate);
  }, [selectedDate, $legibleTodayDate]);

  // Dialog handler
  const handleDialog = useCallback(
    (action: EDialogAction, slot: ITimeSlot, isOnly?: boolean): void => {
      setOpenDialog(true);
      setSelectedSlot(slot);

      if (action === EDialogAction.RESERVE) {
        const reserveDialogContent: IDialog = {
          action: EDialogAction.RESERVE,
          content: (
            <UsersCombo
              className='w-1/2'
              placeholder={t('placeholder.userCombobox')}
              searchBy={EUserSearch.IDENTITY}
              searchResult={(e) => setUserSelected(e)}
              sortingKey={ESortingKeys.FIRST_NAME}
            />
          ),
          description: t('dialog.reserveAppointment.description'),
          title: t('dialog.reserveAppointment.title'),
        };

        setDialogContent(reserveDialogContent);
      }

      if (action === EDialogAction.CANCEL) {
        setUserSelected({} as IUser);

        const cancelDialogContent: IDialog = {
          action: EDialogAction.CANCEL,
          content: (
            <div className='space-y-2'>
              <Trans
                i18nKey='dialog.deleteAppointment.contentText'
                values={{
                  firstName: UtilsString.upperCase(slot.appointment?.user.firstName),
                  lastName: UtilsString.upperCase(slot.appointment?.user.lastName),
                }}
                components={{
                  span: <span className='font-semibold' />,
                }}
              />
              <p className='italic'>
                {`${UtilsString.upperCase(format(slot.appointment?.day as string, 'full', selectedLocale))} - ${slot.appointment?.hour} ${t('words.hoursAbbreviation')}`}
              </p>
            </div>
          ),
          description: t('dialog.deleteAppointment.description'),
          isOnly: isOnly,
          title: t('dialog.deleteAppointment.title'),
        };

        setDialogContent(cancelDialogContent);
      }
    },
    [selectedLocale, t],
  );

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6'>
      <section className='flex flex-col gap-6 overflow-x-auto md:flex-row lg:flex-row'>
        <section className='mx-auto flex h-fit w-full min-w-fit flex-col gap-4 rounded-lg bg-background p-4 md:w-fit md:gap-6 lg:w-1/3 lg:gap-6'>
          <ProfessionalSelection
            key={professionalKey}
            clearFilters={handleClearFilters}
            professional={professionalSelected}
            setDisabledDays={setDisabledDays}
            setSelected={setProfessionalSelected}
          />
          <DateSelection
            disabledDays={disabledDays}
            professional={professionalSelected}
            handleDaysWithAppos={handleDaysWithAppos}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </section>
        <section className='flex flex-col gap-4 md:w-full md:gap-6 lg:w-2/3 lg:gap-6'>
          <DailySchedule
            handleDialog={handleDialog}
            professional={professionalSelected}
            refreshAppos={refreshAppos}
            selectedDate={selectedDate}
            selectedLegibleDate={selectedLegibleDate}
          />
        </section>
      </section>
      <DialogReserve
        content={{
          messages: dialogContent,
          slot: selectedSlot,
        }}
        date={selectedDate}
        openState={{ open: openDialog, setOpen: setOpenDialog }}
        professional={professionalSelected}
        setHandleDaysWithAppos={setHandleDaysWithAppos}
        setRefreshAppos={setRefreshAppos}
        setUser={setUserSelected}
        user={userSelected}
      />
    </main>
  );
}
