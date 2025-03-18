// Icons: https://lucide.dev/icons/
import { KeyRound, Package2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card } from '@core/components/ui/card';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
import { Label } from '@core/components/ui/label';
// External imports
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import { loginSchema } from '@auth/schemas/login.schema';

// React component
export default function Login() {
  const { t } = useTranslation();

  const defaultValues = {
    email: '',
    password: '',
  };

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });

  function handleLogin(data: z.infer<typeof loginSchema>): void {
    console.log('Login', data);
  }

  return (
    <main className='flex h-screen flex-1 flex-col justify-center bg-slate-50'>
      <Card className='mx-auto w-fit p-12 md:min-w-[400px]'>
        <section className='flex items-center justify-center gap-2 text-xl font-semibold'>
          <Package2 size={32} />
          <span>{t('appName')}</span>
        </section>
        <h2 className='mt-10 text-center text-xl/9 font-semibold tracking-tight'>Inicia sesión en tu cuenta</h2>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit((data) => handleLogin(data))} className='space-y-6'>
              {/* <div>
                <Label htmlFor='email'>Correo electrónico</Label>
                <div className='mt-2'>
                  <Input className='w-full px-3 py-1.5 text-base sm:text-sm/6' />
                </div>
              </div> */}
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
              {/* <div>
                <div className='flex items-center justify-between gap-6'>
                  <Label htmlFor='password'>Contraseña</Label>
                  <div className='text-sm'>
                    <a href='#' className='text-xs text-muted-foreground/70 hover:text-foreground'>
                      Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>
                <div className='mt-2'>
                  <Input type='password' className='w-full px-3 py-1.5 text-base sm:text-sm/6' />
                </div>
              </div> */}
              <div>
                <Button className='w-full' size='default' variant='default'>
                  Iniciar sesión
                </Button>
              </div>
            </form>
          </Form>
          <a href='#' className='mt-10 flex items-center justify-end space-x-2 text-xsm leading-none text-muted-foreground/70 hover:text-foreground'>
            <KeyRound size={14} strokeWidth={2} />
            <span>Solicitar acceso</span>
          </a>
        </div>
      </Card>
    </main>
  );
}
