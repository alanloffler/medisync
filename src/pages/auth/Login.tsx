// Icons: https://lucide.dev/icons/
import { KeyRound, Package2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card } from '@core/components/ui/card';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import type { AxiosError, AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import { APP_CONFIG } from '@config/app.config';
import { AuthService } from '@auth/services/auth.service';
import { loginSchema } from '@auth/schemas/login.schema';
// React component
export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const defaultValues = {
    email: '',
    password: '',
  };

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });

  const {
    error,
    isError,
    isPending: isLoggingIn,
    mutate: handleLogin,
  } = useMutation<AxiosResponse<IResponse>, AxiosError<IResponse>, z.infer<typeof loginSchema>>({
    mutationKey: ['login'],
    mutationFn: async (formData) => {
      return await AuthService.login(formData);
    },
    onSuccess: (response) => {
      if (response.status === 201) navigate(`${APP_CONFIG.appPrefix}/dashboard`);
    },
  });

  return (
    <main className='flex h-screen flex-1 flex-col justify-center bg-slate-50'>
      <Card className='mx-auto min-w-[350px] p-8 md:min-w-[420px]'>
        <section className='flex items-center justify-center gap-2 text-xl font-semibold'>
          <Package2 size={32} />
          <span>{t('appName')}</span>
        </section>
        <h2 className='mt-5 text-center text-xl/9 font-semibold tracking-tight'>{t('cardTitle.login')}</h2>
        <section className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit((data) => handleLogin(data))} className='space-y-6'>
              <FormField
                control={loginForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('label.email')}</FormLabel>
                    <FormControl>
                      <Input {...field} className='w-full px-3 py-1.5 text-base sm:text-sm' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('label.password')}</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} className='w-full px-3 py-1.5 text-base sm:text-sm' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button type='submit' className='w-full disabled:opacity-100' disabled={isLoggingIn} size='default' variant='default'>
                  {isLoggingIn && !isError ? <LoadingDB spinnerColor='fill-white' text={t('loading.authenticating')} /> : t('button.login')}
                </Button>
              </div>
            </form>
          </Form>
          <section className='mt-4 flex justify-end'>
            <button
              className='flex items-center space-x-2 p-0 text-xs leading-none text-muted-foreground/70 hover:text-foreground'
              onClick={() => {
                loginForm.setValue('email', 'alanmatiasloffler@gmail.com');
                loginForm.setValue('password', 'admin1234');
              }}
            >
              <KeyRound size={14} strokeWidth={2} />
              <span>{t('button.requestAccess')}</span>
            </button>
          </section>
          {isError && <InfoCard className='mt-8' size='xsm' text={error.response?.data.message} variant='error' />}
        </section>
      </Card>
    </main>
  );
}
