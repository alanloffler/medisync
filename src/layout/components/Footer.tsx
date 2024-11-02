// Imports
import { FOOTER_CONFIG } from '@config/layout/footer.config';
import { Notifications } from '@layout/components/Notifications';
// React component
export function Footer() {
  return (
    <footer className='fixed bottom-0 z-50 flex h-12 w-full items-center justify-between gap-4 border-t bg-white p-4 px-4 md:p-6 md:px-4'>
      <div className='flex w-full items-center justify-between'>
        <Notifications />
        <div className='hidden justify-end text-sm font-medium text-primary md:flex lg:flex'>{FOOTER_CONFIG.title}</div>
      </div>
    </footer>
  );
}
