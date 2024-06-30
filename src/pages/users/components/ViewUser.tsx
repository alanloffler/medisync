// Icons: https://lucide.dev/icons/
import { ArrowLeft, CreditCard, Mail, Menu, Smartphone } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { IUser } from '../interfaces/user.interface';
import { USER_VIEW_CONFIG as UV_CONFIG } from '@/config/user.config';
import { UserApiService } from '../services/user-api.service';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useDelimiter } from '@/core/hooks/useDelimiter';
import { useEffect, useState } from 'react';
import { useLegibleDate } from '@/core/hooks/useDateToString';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { InfoCard } from '@/core/components/common/InfoCard';
// React component
export default function ViewUser() {
  const [infoCard, setInfoCard] = useState<{ title: string; description: string; type: 'error' | 'success' | 'warning' }>({ title: '', description: '', type: 'success' });
  const [showCard, setShowCard] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as IUser);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const delimiter = useDelimiter();
  const legibleDate = useLegibleDate();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      UserApiService.findOne(id).then((response) => {
        if (response.statusCode === 200) {
          setUser(response.data);
          setShowCard(true);
        }
        if (response.statusCode > 399) {
          addNotification({ type: 'error', message: response.message });
          setInfoCard({ title: `Error ${response.statusCode}`, description: response.message, type: 'error' });
        }
        if (response instanceof Error) {
          addNotification({ type: 'error', message: 'Internal Server Error' });
          setInfoCard({ title: 'Error 500', description: 'Internal Server Error', type: 'error' });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={UV_CONFIG.title} breadcrumb={UV_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {UV_CONFIG.buttons.back}
        </Button>
      </div>
      {/* Page Content */}
      {showCard && (
        <div className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
          {showCard && (
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>
                  <div className='relative flex items-center justify-center'>
                    <h1 className='text-center text-2xl font-bold'>
                      {capitalize(user.lastName)}, {capitalize(user.firstName)}
                    </h1>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={'tableHeader'} size={'miniIcon'} className='absolute right-1 flex items-center'>
                          <Menu className='h-4 w-4' strokeWidth={2} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='w-fit' align='end'>
                        <DropdownMenuGroup>
                          {/* TODO: add actions */}
                          <DropdownMenuItem onClick={() => console.log('Send email')}>{UV_CONFIG.dropdownMenu[0].name}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Send whatsapp')}>{UV_CONFIG.dropdownMenu[1].name}</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='mt-3 space-y-3'>
                <div className='flex items-center space-x-4'>
                  <CreditCard className='h-6 w-6' strokeWidth={2} />
                  <span className='text-lg font-medium'>{delimiter(user.dni, '.', 3)}</span>
                </div>
                <div className='flex items-center space-x-4'>
                  <Smartphone className='h-6 w-6' strokeWidth={2} />
                  <span className='text-lg font-medium'>{delimiter(user.phone, '-', 6)}</span>
                </div>
                <div className='flex items-center space-x-4'>
                  <Mail className='h-6 w-6' strokeWidth={2} />
                  <span className='text-lg font-medium'>{user.email}</span>
                </div>
                <div className='flex justify-end pt-2 text-base leading-none text-slate-500'>{`${UV_CONFIG.phrase.userSince} ${legibleDate(new Date(user.createdAt), 'short')}`}</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {/* Info Card */}
      {!showCard && (
        <div className='mx-auto mt-4 flex w-full flex-row px-2 md:w-1/2 md:px-0'>
          {/* prettier-ignore */}
          <InfoCard 
          title={infoCard.title} 
          description={infoCard.description} 
          type={infoCard.type}
          className='border border-slate-50 w-full'
        />
        </div>
      )}
    </main>
  );
}
