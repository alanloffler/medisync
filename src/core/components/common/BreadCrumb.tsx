// Icons: https://lucide.dev/icons/
import { ChevronRight } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from '@core/components/ui/breadcrumb';
// External imports
import { Link } from 'react-router-dom';
// Imports
import type { IBreadcrumb } from '@core/components/common/interfaces/breadcrumb.interface';
import { useTranslation } from 'react-i18next';
// React component
export function BreadCrumb({ paths }: { paths: IBreadcrumb[] }) {
  const { t } = useTranslation();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((item, index) =>
          index !== paths.length - 1 ? (
            <BreadcrumbItem key={item.id} className='text-xsm'>
              <BreadcrumbLink asChild>
                <Link to={item.path}>{t(item.name)}</Link>
              </BreadcrumbLink>
              <ChevronRight className='h-3.5 w-3.5' />
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={item.id} className='text-xsm'>
              <BreadcrumbPage>{t(item.name)}</BreadcrumbPage>
            </BreadcrumbItem>
          ),
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
