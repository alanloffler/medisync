// External imports
import { useTranslation } from 'react-i18next';
// React component
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className='grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <p className='text-lg font-semibold text-primary'>404</p>
        <h1 className='mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl'>{t('section.notFound.title')}</h1>
        <p className='mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8'>{t('section.notFound.description')}</p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <a
            href='#'
            className='shadow-xs rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            {t('section.notFound.button')}
          </a>
        </div>
      </div>
    </main>
  );
}
