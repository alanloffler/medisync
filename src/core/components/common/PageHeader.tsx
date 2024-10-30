// Components
import { BreadCrumb } from '@core/components/common/BreadCrumb';
// Imports
import type { IBreadcrumb } from '@core/components/common/interfaces/breadcrumb.interface';
// React component
export function PageHeader({ title, breadcrumb }: { title: string; breadcrumb: IBreadcrumb[] }) {
  return (
    <div className='w-fit space-y-3'>
      <BreadCrumb paths={breadcrumb} />
      <h1 className='text-xl font-semibold leading-none tracking-normal'>{title}</h1>
    </div>
  );
}
