// Icons: https://lucide.dev/icons/
import { BriefcaseMedical, CalendarCheck, ClipboardCheck, Clock } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { format } from '@formkit/tempo';
import { type Dispatch, type SetStateAction, useCallback, useEffect } from 'react';
// Imports
import type { IDialog } from '@core/interfaces/dialog.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { AppointmentApiService } from '@appointments/services/appointment.service';
import { EDialogAction } from '@appointments/enums/dialog.enum';
import { UtilsString } from '@core/services/utils/string.service';
import { useNotificationsStore } from '@core/stores/notifications.store';
// Interface
interface IProps {
  content: { messages: IDialog; slot: ITimeSlot };
  date?: Date;
  openState: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> };
  professional?: IProfessional;
  setRefreshAppos: Dispatch<SetStateAction<string>>;
  setUser: Dispatch<SetStateAction<IUser>>;
  user: IUser;
}
// React component
export function DialogReserve({ content, date, openState, professional, setRefreshAppos, setUser, user }: IProps) {
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

  async function cancelAppointment(slot: ITimeSlot): Promise<void> {
    if (slot.appointment?._id) {
      AppointmentApiService.remove(slot.appointment._id).then((response) => {
        if (response.statusCode === 200) {
          addNotification({ type: 'success', message: response.message });
          handleResetDialog();
          setRefreshAppos(crypto.randomUUID());
          openState.setOpen(false);
        }
        if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: t('error.internalServer') });
      });
    }
  }

  const reserveAppointment = useCallback(
    async (timeSlot: ITimeSlot | undefined): Promise<void> => {
      if (timeSlot && professional) {
        const newAppo = await AppointmentApiService.create({
          slot: timeSlot.id,
          professional: professional?._id || '',
          day: format(date ?? new Date(), 'YYYY-MM-DD'),
          hour: timeSlot.begin,
          user: user._id,
        });

        if (newAppo.statusCode === 200) {
          addNotification({ type: 'success', message: newAppo.message });
          setRefreshAppos(crypto.randomUUID());
          handleResetDialog();
          openState.setOpen(false);
        }
        if (newAppo.statusCode > 399) addNotification({ type: 'error', message: newAppo.message });
        if (newAppo instanceof Error) addNotification({ type: 'error', message: t('error.internalServer') });
      }
    },
    [addNotification, date, handleResetDialog, openState, professional, setRefreshAppos, t, user._id],
  );

  return (
    <Dialog open={openState.open} onOpenChange={openState.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>{dialogContent.title}</DialogTitle>
          <DialogDescription>{dialogContent.description}</DialogDescription>
          <section className='z-50 pt-4'>
            {dialogContent.action === EDialogAction.RESERVE && !user._id && dialogContent.content}
            {dialogContent.action === EDialogAction.RESERVE && user._id && generateSummary(user)}
            {dialogContent.action === EDialogAction.CANCEL && dialogContent.content}
          </section>
          <footer className='flex justify-end gap-6 pt-4'>
            <Button variant='secondary' size='sm' onClick={() => openState.setOpen(false)}>
              {t('button.cancel')}
            </Button>
            {dialogContent.action === EDialogAction.RESERVE && (
              <Button variant='default' size='sm' disabled={!user._id} onClick={() => reserveAppointment(selectedSlot)}>
                {t('button.reserveAppointment')}
              </Button>
            )}
            {dialogContent.action === EDialogAction.CANCEL && (
              <Button variant='default' size='sm' onClick={() => cancelAppointment(selectedSlot)}>
                {t('button.deleteAppointment')}
              </Button>
            )}
          </footer>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
