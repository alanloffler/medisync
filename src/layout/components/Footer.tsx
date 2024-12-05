// Components
import { Notifications } from '@layout/components/Notifications';
import { User } from '@layout/components/User';
// Imports
import { FOOTER_CONFIG } from '@config/layout/footer.config';
// React component
export function Footer() {
  return (
    <footer className='fixed bottom-0 z-50 flex h-12 w-full items-center justify-between gap-4 border-t bg-white p-4 px-4 md:p-6 md:px-4'>
      <section className='flex w-full items-center justify-between'>
        <section>
          <Notifications />
        </section>
        <section className='flex items-center gap-2'>
          <User />
          <div className='hidden justify-end text-sm font-medium text-primary md:flex lg:flex'>{FOOTER_CONFIG.title}</div>
        </section>
      </section>
    </footer>
  );
}
