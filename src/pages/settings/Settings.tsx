// External components: https://ui.shadcn.com/docs/components
import { Checkbox } from '@core/components/ui/checkbox';
// External imports
import { useEffect } from 'react';
// Imports
import { SETTINGS_CONFIG } from '@config/settings.config';
import { useHelpStore } from '@settings/stores/help.store';
// React component
export default function Settings() {
  const { help, setHelp } = useHelpStore();

  useEffect(() => {
    console.log('Help on store: ', help);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleHelpChecked(checked: boolean): void {
    setHelp(checked);
  }

  return (
    <main className='flex w-full flex-col space-y-6 p-6'>
      <h1 className='text-2xl font-bold tracking-tight'>{SETTINGS_CONFIG.page.title}</h1>
      <section>
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
