// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
// External imports
import { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { IUser } from '@users/interfaces/user.interface';
import { UserApiService } from '@users/services/user-api.service';
import { ScrollArea } from '@core/components/ui/scroll-area';
import { UtilsString } from '@core/services/utils/string.service';
// Interface
interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
// React component
export function DialogRemovedUsers({ open, setOpen }: IProps) {
  const { data: users } = useQuery<IResponse<IUser[]>, AxiosError>({
    queryKey: ['users', 'removed-users'],
    queryFn: () => UserApiService.findRemovedUsers(),
  });
  const fakeData = [
    { firstName: 'User 01' },
    { firstName: 'User 02' },
    { firstName: 'User 03' },
    { firstName: 'User 04' },
    { firstName: 'User 05' },
    { firstName: 'User 06' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore patient</DialogTitle>
          <DialogDescription>This action will restore a removed patient</DialogDescription>
        </DialogHeader>
        <section className='space-y-3 text-sm'>
          {users?.data && (
            <ScrollArea className='h-[205px] w-full'>
              <div className='flex flex-col space-y-1'>
                {users.data.map((user, index) => (
                  <div key={index} className='flex justify-between bg-slate-100 p-2'>
                    <div>{UtilsString.upperCase(`${user.lastName}, ${user.firstName}`, 'all')}</div>
                    <div className='pr-1'>
                      <Button size='xs' className='text-xs font-normal'>
                        Restore user
                      </Button>
                    </div>
                  </div>
                ))}
                {fakeData.map((user, index) => (
                  <div key={index} className='flex justify-between bg-slate-100 p-2'>
                    <div key={index + 'z'}>{user.firstName}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </section>
        <DialogFooter>
          <Button size='sm' variant='secondary' onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
