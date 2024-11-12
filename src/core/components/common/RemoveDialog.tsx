// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { ReactNode, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { REMOVE_DIALOG_CONFIG } from '@config/common.config';
// Interfaces
interface IRemoveDialog {
  action: () => Promise<IResponse | Error>;
  callback?: any;
  dialogContent: ReactNode;
  dialogTexts: IDialogTexts;
  help: boolean;
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
export function RemoveDialog({ action, callback, dialogContent, dialogTexts, help, tooltip, triggerButton }: IRemoveDialog) {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  // const { error, isError, isFetching, refetch } = useQuery({
  //   queryKey: ['remove-dialog', 'appointment'],
  //   queryFn: async () => await action(),
  //   enabled: false,
  //   refetchOnWindowFocus: false,
  //   retry: 1,
  // });

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ['remove-dialog', 'appointment'], exact: true });
  }, [openDialog, queryClient]);

  async function handleAction(): Promise<void> {
    mutation.mutate();
  }

  const mutation = useMutation({
    mutationFn: action, // Directly use the passed action
    onSuccess: () => {
      console.log('success delete');
      // Call the callback function if provided
      if (callback) {
        setOpenDialog(false);
        callback();
      }
    },
  });

  // async function handleCallback(): Promise<void> {
  //   mutation.mutate(); // Trigger the mutation
  // }

  return (
    <>
      <TooltipWrapper tooltip={tooltip} help={help}>
        <Button
          onClick={() => setOpenDialog(true)}
          variant='tableHeader'
          size='miniIcon'
          className='border border-slate-300 bg-white transition-transform hover:scale-110 hover:border-rose-500 hover:bg-white hover:text-rose-500 hover:animate-in'
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
              {mutation.isError && <InfoCard text={mutation.error.message} type='error' className='pt-6' />}
              {/* {mutation.isFetching && (
                <LoadingDB
                  size='xs'
                  variant='default'
                  text={REMOVE_DIALOG_CONFIG.appointment.deleting || REMOVE_DIALOG_CONFIG.default.deleting}
                  className='pt-6'
                />
              )} */}
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
