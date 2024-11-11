// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { ReactNode, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { REMOVE_DIALOG_CONFIG } from '@config/common.config';
// Interfaces
interface IRemoveDialog {
  action: () => Promise<IResponse | Error>;
  help: boolean;
  dialogContent: ReactNode;
  dialogTexts: IDialogTexts;
  tooltip: string;
  triggerButton: ReactNode;
}

interface IDialogTexts {
  title?: string;
  description?: string;
  removeButton?: string;
  cancelButton?: string;
}
// React component
export function RemoveDialog({ action, help, dialogContent, dialogTexts, tooltip, triggerButton }: IRemoveDialog) {
  const [openDialog, setOpenDialog] = useState(false);

  const { error, isFetching, refetch } = useQuery({
    queryKey: ['remove-dialog'],
    queryFn: async () => {
      await action();
    },
    enabled: false,
    // retry: 1,
  });

  async function handleAction(): Promise<void> {
    refetch();
  }

  return (
    <>
      <TooltipWrapper tooltip={tooltip} help={help}>
        <Button
          onClick={() => {
            setOpenDialog(true);
            console.log(dialogContent);
          }}
          variant='tableHeader'
          size='miniIcon'
          className='border border-slate-300 bg-white transition-transform hover:scale-110 hover:border-sky-500 hover:bg-white hover:text-sky-500 hover:animate-in'
        >
          {triggerButton}
        </Button>
      </TooltipWrapper>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{dialogTexts.title || REMOVE_DIALOG_CONFIG.default.title}</DialogTitle>
            <DialogDescription>{dialogTexts.description || REMOVE_DIALOG_CONFIG.default.description}</DialogDescription>
            <section className='flex flex-col space-y-2 pt-2'>
              <section>{dialogContent}</section>
              {error && <InfoCard text='Error al eliminar el turno' type='error' className='pt-6' />}
              {isFetching && <LoadingDB size='xs' variant='default' text='Eliminando...' className='pt-6' />}
            </section>
            <footer className='flex justify-end space-x-4 pt-6'>
              <Button onClick={() => setOpenDialog(false)} variant='ghost'>
                {dialogTexts.cancelButton}
              </Button>
              <Button onClick={handleAction} variant='remove'>
                {dialogTexts.removeButton}
              </Button>
            </footer>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
