// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// External imports
import { useTranslation } from 'react-i18next';
// Imports
import type { IDialog } from '@core/interfaces/dialog.interface';
import type { ITimeSlot } from '@appointments/interfaces/appointment.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { EDialogAction } from '@appointments/enums/dialog.enum';
// Interface
interface IProps {
  cancel: (slot: ITimeSlot) => Promise<void>;
  content: { messages: IDialog; slot: ITimeSlot };
  generate: (user: IUser) => JSX.Element;
  reserve: (timeSlot: ITimeSlot | undefined) => Promise<void>;
  reset: () => void;
  state: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> };
  user: IUser;
}
// React component
export function DialogReserve({ cancel, generate, content, state, reserve, reset, user }: IProps) {
  const { messages: dialogContent, slot: selectedSlot } = content;
  const { t } = useTranslation();

  return (
    <Dialog open={state.open} onOpenChange={state.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>{dialogContent.title}</DialogTitle>
          <DialogDescription>{dialogContent.description}</DialogDescription>
          <section className='z-50 pt-4'>
            {dialogContent.action === EDialogAction.RESERVE && !user._id && dialogContent.content}
            {dialogContent.action === EDialogAction.RESERVE && user._id && generate(user)}
            {dialogContent.action === EDialogAction.CANCEL && dialogContent.content}
          </section>
          <footer className='flex justify-end gap-6 pt-4'>
            <Button variant='secondary' size='sm' onClick={() => reset()}>
              {t('button.cancel')}
            </Button>
            {dialogContent.action === EDialogAction.RESERVE && (
              <Button variant='default' size='sm' disabled={!user._id} onClick={() => reserve(selectedSlot)}>
                {t('button.reserveAppointment')}
              </Button>
            )}
            {dialogContent.action === EDialogAction.CANCEL && (
              <Button variant='default' size='sm' onClick={() => cancel(selectedSlot)}>
                {t('button.deleteAppointment')}
              </Button>
            )}
          </footer>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
