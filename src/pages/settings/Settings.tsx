// External components: https://ui.shadcn.com/docs/components
import { Checkbox } from '@core/components/ui/checkbox';
// External imports
import { useEffect, useState } from 'react';
import { useHelpStore } from '@settings/stores/help.store';
// Imports
import type { IUser } from '@users/interfaces/user.interface';
import { SETTINGS_CONFIG } from '@config/settings.config';
import { UserApiService } from '@users/services/user-api.service';
// React component
export default function Settings() {
  const [user, setUser] = useState<IUser | null>(null);
  const { help, setHelp } = useHelpStore();

  function handleHelpChecked(checked: boolean): void {
    setHelp(checked);
  }

  useEffect(() => {
    UserApiService.findOne('677873665568db74bbce9144').then((user) => {
      setUser(user.data);
    });
  }, []);

  return (
    <main className='flex w-full flex-col space-y-5 p-6'>
      <h1 className='hidden text-2xl font-bold tracking-tight'>{SETTINGS_CONFIG.page.title}</h1>
      <section>
        <section>{JSON.stringify(user)}</section>
        <section className='flex flex-col space-y-3'>
          <h2 className='text-xl font-semibold tracking-tight'>{SETTINGS_CONFIG.section.application.title}</h2>
          <div className='space-y-2 pl-3'>
            <h5>{SETTINGS_CONFIG.section.application.subsection.help.title}</h5>
            <div className='flex items-center space-x-2'>
              <Checkbox checked={help} onCheckedChange={handleHelpChecked} id='terms' className='h-5 w-5' />
              <label htmlFor='terms' className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                {SETTINGS_CONFIG.section.application.subsection.help.label}
              </label>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
