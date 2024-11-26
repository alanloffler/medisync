// Components
import { BreadCrumb } from '@core/components/common/BreadCrumb';
// External imports
import { useTranslation } from 'react-i18next';
// Imports
import type { IBreadcrumb } from '@core/components/common/interfaces/breadcrumb.interface';
// React component
export function PageHeader({ title, breadcrumb }: { title: string; breadcrumb: IBreadcrumb[] }) {
  const { t } = useTranslation();

  return (
    <div className='w-fit space-y-3'>
      <BreadCrumb paths={breadcrumb} />
      <h1 className='text-lg font-semibold leading-none tracking-normal'>{t(title)}</h1>
    </div>
  );
}
