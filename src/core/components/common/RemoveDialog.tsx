import type { IResponse } from '@core/interfaces/response.interface';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { ReactNode, useState } from 'react';

interface IRemoveDialog {
  action: () => Promise<IResponse>;
  button: ReactNode;
  removeLabel: string;
}

export function RemoveDialog({ action, button, removeLabel }: IRemoveDialog) {
  const [openDialog, setOpenDialog] = useState(false);
  const [response, setResponse] = useState<IResponse | null>(null);

  async function handleAction() {
    const response = await action();
    if (response.statusCode === 200) {
      // setOpenDialog(false);
    }
    console.log(response);
    setResponse(response);
  }

  return (
    <>
      <button onClick={() => setOpenDialog(true)} className='bg-slate-600 text-white w-fit p-2 rounded-full'>{button}</button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>Remove dialog</DialogTitle>
            <DialogDescription className='sr-only'></DialogDescription>
            <div className='flex flex-col pt-2'>
              <span className=''>{`${response?.message}: ${response?.data.value1}`}</span>
              <div className='mt-5 flex justify-end space-x-4'>
                <button onClick={handleAction}>{removeLabel}</button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
