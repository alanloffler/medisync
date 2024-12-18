// Components
import { DailySchedule } from '@appointments/components/reserve/DailySchedule';
import { DateSelection } from '@appointments/components/reserve/DateSelection';
import { DialogReserve } from '@appointments/components/reserve/DialogReserve';
import { ProfessionalSelection } from '@appointments/components/reserve/ProfessionalSelection';
import { UsersCombo } from '@users/components/UsersCombo';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { useCallback, useEffect, useMemo, useState } from 'react';
// Imports
import type { IDialog } from '@core/interfaces/dialog.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { CalendarService } from '@appointments/services/calendar.service';
import { EDialogAction } from '@appointments/enums/dialog.enum';
import { HEADER_CONFIG } from '@config/layout/header.config';
import { RESERVE_APPOINTMENT_CONFIG as RA_CONFIG } from '@config/appointments/reserve-appointments.config';
import { UtilsString } from '@core/services/utils/string.service';
import { useHeaderMenuStore } from '@layout/stores/header-menu.service';
// Constants
const DISABLED_DAYS: number[] = RA_CONFIG.calendar.disabledDays;
// React component
export default function ReserveAppointments() {
  const [refreshAppos, setRefreshAppos] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<ITimeSlot>({} as ITimeSlot);
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const setItemSelected = useHeaderMenuStore((state) => state.setHeaderMenuSelected);
  const { i18n, t } = useTranslation();
  const selectedLocale: string = i18n.resolvedLanguage || i18n.language;

  // Common with ProfessionalSelection and DateSelection
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [disabledDays, setDisabledDays] = useState<number[]>(DISABLED_DAYS);
  const [professionalSelected, setProfessionalSelected] = useState<IProfessional>();
  // Dialog
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  // In DailySchedule & DialogReserve
  const [dialogContent, setDialogContent] = useState<IDialog>({} as IDialog);
  const [selectedLegibleDate, setSelectedLegibleDate] = useState<string>('');
  // In DateSelection & DailySchedule
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // PAGE
  // Set header menu item selected
  useEffect(() => {
    setItemSelected(HEADER_CONFIG.headerMenu[1].id);
  }, [setItemSelected]);

  // CALENDAR
  // Set disabled days by professional selected
  const $getDisabledDays = useMemo(() => {
    return (professionalSelected: IProfessional | undefined) => {
      return CalendarService.getDisabledDays(professionalSelected?.configuration.workingDays ?? []);
    };
  }, []);

  useEffect(() => {
    setSelectedDate(undefined);

    const disabledDays = $getDisabledDays(professionalSelected);
    setDisabledDays(disabledDays);
  }, [professionalSelected, $getDisabledDays]);

  // SCHEDULE
  // Set legible date
  const $legibleTodayDate: string = useMemo(() => {
    return format(selectedDate!, 'full', selectedLocale);
  }, [selectedDate, selectedLocale]);

  useEffect(() => {
    setSelectedLegibleDate($legibleTodayDate);
  }, [selectedDate, $legibleTodayDate]);

  // DIALOG
  const handleDialog = useCallback(
    (action: EDialogAction, slot: ITimeSlot): void => {
      setOpenDialog(true);
      setSelectedSlot(slot);

      if (action === EDialogAction.RESERVE) {
        const reserveDialogContent: IDialog = {
          action: EDialogAction.RESERVE,
          content: <UsersCombo searchBy='dni' searchResult={(e) => setUserSelected(e)} placeholder={t('placeholder.userCombobox')} />,
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
        {/* Section: Left side */}
        <section className='flex h-fit flex-col gap-4 rounded-lg bg-background p-4 md:mx-auto md:w-1/3 md:gap-6 lg:mx-auto lg:w-1/3 lg:gap-6'>
          <ProfessionalSelection professional={professionalSelected} setDisabledDays={setDisabledDays} setSelected={setProfessionalSelected} />
          <DateSelection
            date={date}
            disabledDays={disabledDays}
            professional={professionalSelected}
            setDate={setDate}
            setSelectedDate={setSelectedDate}
          />
        </section>
        {/* Section: Right side */}
        <section className='flex flex-col gap-4 md:w-2/3 lg:w-2/3'>
          <DailySchedule
            date={date}
            handleDialog={handleDialog}
            professional={professionalSelected}
            refreshAppos={refreshAppos}
            selectedDate={selectedDate}
            selectedLegibleDate={selectedLegibleDate}
            setDate={setDate}
          />
        </section>
      </section>
      {/* Section: Dialog */}
      <DialogReserve
        content={{
          messages: dialogContent,
          slot: selectedSlot,
        }}
        date={date}
        openState={{ open: openDialog, setOpen: setOpenDialog }}
        professional={professionalSelected}
        setRefreshAppos={setRefreshAppos}
        setUser={setUserSelected}
        user={userSelected}
      />
    </main>
  );
}
