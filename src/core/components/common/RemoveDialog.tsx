// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { ReactNode, useEffect, useState } from 'react';
import { useAnimate } from 'motion/react';
import { useMutation } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { REMOVE_DIALOG_CONFIG } from '@config/common.config';
import { motion } from '@core/services/motion.service';
// Interfaces
interface IRemoveDialog {
  action: () => Promise<IResponse | Error>;
  callback?: any;
  dialogContent: ReactNode;
  dialogTexts: IDialogTexts;
  tooltip: string;
  triggerButton: ReactNode;
}

interface IDialogTexts {
  cancelButton?: string;
  deleting?: string;
  description?: string;
  removeButton?: string;
  title?: string;
}
// React component
export function RemoveDialog({ action, callback, dialogContent, dialogTexts, tooltip, triggerButton }: IRemoveDialog) {
  const [openDialog, setOpenDialog] = useState(false);
  const [scope, animation] = useAnimate();

  const { error, isError, isPending, mutate, reset } = useMutation({
    mutationFn: action,
    mutationKey: ['remove-dialog', 'appointment'],
    retry: 1,
    onSuccess: () => {
      if (callback) {
        setOpenDialog(false);
        callback();
      }
    },
  });

  useEffect(() => {
    reset();
  }, [openDialog, reset]);

  function handleAction(): void {
    mutate();
  }

  function animateOver(): void {
    const { keyframes, options } = motion.scale(1.1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  function animateOut(): void {
    const { keyframes, options } = motion.scale(1).type('bounce').animate();
    animation(scope.current, keyframes, options);
  }

  return (
    <>
      <TooltipWrapper tooltip={tooltip}>
        <button
          className='flex h-7 w-7 items-center justify-center rounded-md bg-transparent hover:bg-red-100/75 hover:text-red-400'
          onClick={() => setOpenDialog(true)}
          onMouseOut={animateOut}
          onMouseOver={animateOver}
        >
          <div ref={scope}>{triggerButton}</div>
        </button>
      </TooltipWrapper>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{dialogTexts.title || REMOVE_DIALOG_CONFIG.default.title}</DialogTitle>
            <DialogDescription className='text-xsm text-muted-foreground'>
              {dialogTexts.description || REMOVE_DIALOG_CONFIG.default.description}
            </DialogDescription>
            <section className='flex flex-col py-4'>
              <section className='space-y-2 text-sm'>{dialogContent}</section>
              {isError && <InfoCard text={error.message} type='error' />}
              {isPending && <LoadingDB size='xs' variant='default' text={dialogTexts.deleting || REMOVE_DIALOG_CONFIG.default.deleting} />}
            </section>
            <footer className='flex justify-end space-x-4'>
              <Button onClick={() => setOpenDialog(false)} variant='ghost' size='sm'>
                {dialogTexts.cancelButton}
              </Button>
              <Button onClick={handleAction} variant='remove' size='sm'>
                {dialogTexts.removeButton}
              </Button>
            </footer>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
