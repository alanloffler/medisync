// Icons: https://lucide.dev/icons/
import { BriefcaseMedical, CalendarCheck, ClipboardCheck, Clock } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { type Dispatch, type SetStateAction, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
// Imports
import type { IDialog } from '@core/interfaces/dialog.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { EDialogAction } from '@appointments/enums/dialog.enum';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';

// Interfaces
interface IProps {
  content: { messages: IDialog; slot: ITimeSlot };
  date?: Date;
  openState: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> };
  professional?: IProfessional;
  setHandleDaysWithAppos: Dispatch<SetStateAction<{ day: string; action: string; id: string } | undefined>>;
  setRefreshAppos: Dispatch<SetStateAction<string>>;
  setUser: Dispatch<SetStateAction<IUser>>;
  user: IUser;
}

interface IVars {
  day: string;
  hour: string;
  professional: string;
  slot: number;
  user: string;
}
// React component
export function DialogReserve({ content, date, openState, professional, setHandleDaysWithAppos, setRefreshAppos, setUser, user }: IProps) {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { messages: dialogContent, slot: selectedSlot } = content;
  const { i18n, t } = useTranslation();
  const locale: string = i18n.resolvedLanguage || i18n.language;

  const handleResetDialog = useCallback((): void => {
    setUser({} as IUser);
  }, [setUser]);

  useEffect(() => {
    if (openState.open === false) handleResetDialog();
  }, [handleResetDialog, openState.open]);

  // TODO: useCallback
  function generateSummary(userSelected: IUser): JSX.Element {
    return (
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <ClipboardCheck className='h-5 w-5' strokeWidth={2} />
          <div className='flex flex-row items-center gap-1'>
            <Trans
              i18nKey='dialog.reserveAppointment.content.reservedTo'
              values={{
                firstName: UtilsString.upperCase(userSelected.firstName, 'each'),
                lastName: UtilsString.upperCase(userSelected.lastName, 'each'),
              }}
              components={{
                span: <span className='font-semibold' />,
              }}
            />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <CalendarCheck className='h-5 w-5' strokeWidth={2} />
          <div className='flex flex-row items-center gap-1'>
            <Trans
              i18nKey='dialog.reserveAppointment.content.date'
              values={{ date: UtilsString.upperCase(format(date!, 'full', locale)) }}
              components={{
                span: <span />,
              }}
            />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Clock className='h-5 w-5' strokeWidth={2} />
          <div className='flex flex-row items-center gap-1'>
            <Trans
              i18nKey='dialog.reserveAppointment.content.hour'
              values={{ hour: selectedSlot.begin }}
              components={{
                span: <span />,
              }}
            />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <BriefcaseMedical className='h-5 w-5' strokeWidth={2} />
          <span className='font-semibold'>
            {UtilsString.upperCase(`${professional?.title.abbreviation} ${professional?.firstName} ${professional?.lastName}`, 'each')}
          </span>
        </div>
      </div>
    );
  }

  async function cancelAppointment(slot: ITimeSlot, isOnly?: boolean): Promise<void> {
    if (slot.appointment) {
      const slotAppointmentDay: string = slot.appointment.day;

      AppointmentApiService.remove(slot.appointment._id).then((response) => {
        if (response.statusCode === 200) {
          addNotification({ type: 'success', message: response.message });
          handleResetDialog();
          setRefreshAppos(crypto.randomUUID());
          if (isOnly === true) {
            setHandleDaysWithAppos({ day: slotAppointmentDay, action: 'delete', id: crypto.randomUUID() });
          }
          openState.setOpen(false);
        }
        if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: t('error.internalServer') });
      });
    }
  }

  // Action reserve appointment
  const {
    error: reserveError,
    mutate: reserveAppointment,
    isError: isErrorReserve,
    isPending: isPendingReserve,
  } = useMutation<IResponse, Error, IVars>({
    mutationKey: ['reserve-appointment', user._id, selectedSlot.id],
    mutationFn: async ({ day, hour, professional, slot, user }) =>
      await AppointmentApiService.create({
        day,
        hour,
        professional,
        slot,
        user,
      }),
    onSuccess: (response) => {
      addNotification({ type: 'success', message: response.message });
      setRefreshAppos(crypto.randomUUID());
      setHandleDaysWithAppos({ day: format(date ?? new Date(), 'YYYY-MM-DD'), action: 'create', id: crypto.randomUUID() });
      handleResetDialog();
      openState.setOpen(false);
    },
    onError: (error) => {
      addNotification({ type: 'error', message: error.message });
    },
    retry: 1,
  });

  function handleReserveAppointment(): void {
    if (professional && user) {
      const formattedDate: string = format(date ?? new Date(), 'YYYY-MM-DD');
      reserveAppointment({
        day: formattedDate,
        hour: selectedSlot.begin,
        slot: selectedSlot.id,
        professional: professional._id,
        user: user._id,
      });
    } else {
      console.log('Dev Error: must provide a professional and a user');
    }
  }

  return (
    <Dialog open={openState.open} onOpenChange={openState.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>{isErrorReserve ? t('dialog.error.createAppointment.title') : dialogContent.title}</DialogTitle>
          {!isErrorReserve && <DialogDescription>{dialogContent.description}</DialogDescription>}
          <section className='z-50 pt-4'>
            {isErrorReserve ? (
              <InfoCard type='error' text={reserveError.message} />
            ) : (
              <>
                {dialogContent.action === EDialogAction.RESERVE && !user._id && dialogContent.content}
                {dialogContent.action === EDialogAction.RESERVE && user._id && generateSummary(user)}
                {dialogContent.action === EDialogAction.CANCEL && dialogContent.content}
              </>
            )}
          </section>
          <footer className='flex justify-end gap-6 pt-4'>
            {isErrorReserve ? (
              <Button variant='default' size='sm' onClick={() => openState.setOpen(false)}>
                {t('button.tryAgain')}
              </Button>
            ) : (
              <Button variant='ghost' size='sm' onClick={() => openState.setOpen(false)}>
                {t('button.cancel')}
              </Button>
            )}
            {dialogContent.action === EDialogAction.RESERVE && !isErrorReserve && (
              <Button variant='default' size='sm' disabled={!user._id} onClick={handleReserveAppointment}>
                {isPendingReserve ? (
                  <LoadingDB text={t('loading.creating')} spinnerColor='fill-white' className='text-white' />
                ) : (
                  t('button.reserveAppointment')
                )}
              </Button>
            )}
            {dialogContent.action === EDialogAction.CANCEL && (
              <Button variant='remove' size='sm' onClick={() => cancelAppointment(selectedSlot, dialogContent.isOnly)}>
                {t('button.deleteAppointment')}
              </Button>
            )}
          </footer>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
