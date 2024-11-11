import type { IResponse } from '@core/interfaces/response.interface';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { ReactNode, useEffect, useState } from 'react';
import { TooltipWrapper } from './TooltipWrapper';
import { Button } from '../ui/button';
import { REMOVE_DIALOG_CONFIG } from '@config/common.config';
import { useQuery } from '@tanstack/react-query';

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

export function RemoveDialog({ action, help, dialogContent, dialogTexts, tooltip, triggerButton }: IRemoveDialog) {
  const [openDialog, setOpenDialog] = useState(false);
  const [queryResponse, setQueryResponse] = useState<string>('');

  useEffect(() => {
    setQueryResponse('');
  }, [openDialog]);

  const { error } = useQuery({
    queryKey: ['remove-dialog'],
    queryFn: async () => {
      await action();
    },
  });

  // async function handleAction(): Promise<void> {
  //   const response = await action();

  //   if (response instanceof Error) {
  //     setQueryResponse('Internal server error');
  //   }
  //   if (!(response instanceof Error) && response.statusCode === 200) {
  //     setOpenDialog(false);
  //     setQueryResponse(response.message);
  //   }
  //   if (!(response instanceof Error) && response.statusCode > 399) {
  //     setQueryResponse(response.message);
  //   }
  //   if (response instanceof Error) {
  //     setQueryResponse(response.message);
  //   }
  // }

  return (
    <>
      <TooltipWrapper tooltip={tooltip} help={help}>
        <Button
          onClick={() => setOpenDialog(true)}
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
            <section className='flex flex-col pt-2'>
              {dialogContent}
              <span>{queryResponse}</span>
              {/* <span className=''>{`${response?.message}: ${response?.data.value1}`}</span> */}
              <footer className='mt-5 flex justify-end space-x-4'>
                <Button onClick={() => setOpenDialog(false)} variant='ghost'>
                  {dialogTexts.cancelButton}
                </Button>
                <Button variant='remove'>
                  {dialogTexts.removeButton}
                </Button>
              </footer>
            </section>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
