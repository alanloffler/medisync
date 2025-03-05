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
import type { IAppointment, ITimeSlot } from '@appointments/interfaces/appointment.interface';
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

  function generateSummary(userSelected: IUser): JSX.Element {
    return (
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <ClipboardCheck size={20} strokeWidth={2} />
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
          <CalendarCheck size={20} strokeWidth={2} />
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
          <Clock size={20} strokeWidth={2} />
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
          <BriefcaseMedical size={20} strokeWidth={2} />
          <span className='font-semibold'>
            {UtilsString.upperCase(`${professional?.title.abbreviation} ${professional?.firstName} ${professional?.lastName}`, 'each')}
          </span>
        </div>
      </div>
    );
  }

  // Action remove appointment
  const {
    error: removeError,
    mutate: removeAppointment,
    isError: isErrorRemove,
    isPending: isPendingRemove,
    reset: resetRemove,
  } = useMutation<IResponse<IAppointment>, Error, { slot: ITimeSlot; isOnly?: boolean }>({
    mutationKey: ['remove-appointment', user._id, selectedSlot.id],
    mutationFn: async ({ slot }) => {
      if (!slot.appointment) throw new Error('Dev Error: There is no appointment on slot');
      return await AppointmentApiService.remove(slot.appointment._id);
    },
    onSuccess: (response, { slot, isOnly }) => {
      openState.setOpen(false);
      addNotification({ type: 'success', message: response.message });
      setRefreshAppos(crypto.randomUUID());
      if (isOnly === true && slot.appointment) setHandleDaysWithAppos({ day: slot.appointment.day, action: 'delete', id: crypto.randomUUID() });
    },
    onError: (error) => {
      addNotification({ type: 'error', message: error.message });
    },
  });

  function handleRemoveAppointment(slot: ITimeSlot, isOnly?: boolean): void {
    if (slot.appointment) {
      removeAppointment({ slot, isOnly });
    } else console.log("Dev Error: There's no appointment on slot");
  }

  // Action reserve appointment
  const {
    error: reserveError,
    mutate: reserveAppointment,
    isError: isErrorReserve,
    isPending: isPendingReserve,
    reset: resetReserve,
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
      openState.setOpen(false);
      addNotification({ type: 'success', message: response.message });
      setRefreshAppos(crypto.randomUUID());
      setHandleDaysWithAppos({ day: format(date ?? new Date(), 'YYYY-MM-DD'), action: 'create', id: crypto.randomUUID() });
    },
    onError: (error) => {
      addNotification({ type: 'error', message: error.message });
    },
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

  const handleResetDialog = useCallback((): void => {
    setUser({} as IUser);
    if (isErrorRemove) resetRemove();
    if (isErrorReserve) resetReserve();
  }, [isErrorRemove, isErrorReserve, resetRemove, resetReserve, setUser]);

  useEffect(() => {
    if (openState.open === false) {
      handleResetDialog();
    }
  }, [handleResetDialog, openState.open]);

  return (
    <Dialog open={openState.open} onOpenChange={openState.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            {isErrorReserve ? t('dialog.error.createAppointment') : isErrorRemove ? t('dialog.error.deleteAppointment') : dialogContent.title}
          </DialogTitle>
          <DialogDescription>{!isErrorReserve && !isErrorRemove && dialogContent.description}</DialogDescription>
          <section className='z-50 pt-4'>
            {isErrorReserve && <InfoCard text={reserveError.message} variant='error' />}
            {isErrorRemove && <InfoCard text={removeError.message} variant='error' />}
            {!isErrorReserve && !isErrorRemove && (
              <>
                {dialogContent.action === EDialogAction.RESERVE && !user._id && dialogContent.content}
                {dialogContent.action === EDialogAction.RESERVE && user._id && generateSummary(user)}
                {dialogContent.action === EDialogAction.CANCEL && dialogContent.content}
              </>
            )}
          </section>
          <footer className='flex justify-end gap-6 pt-4'>
            {isErrorReserve || isErrorRemove ? (
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
            {dialogContent.action === EDialogAction.CANCEL && !isErrorRemove && (
              <Button variant='remove' size='sm' onClick={() => handleRemoveAppointment(selectedSlot, dialogContent.isOnly)}>
                {isPendingRemove ? (
                  <LoadingDB text={t('loading.deleting')} spinnerColor='fill-white' className='text-white' />
                ) : (
                  t('button.deleteAppointment')
                )}
              </Button>
            )}
          </footer>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
