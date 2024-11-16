// Icons: https://lucide.dev/icons/
import { ChevronRight } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from '@core/components/ui/breadcrumb';
// App
import type { IBreadcrumb } from '@core/components/common/interfaces/breadcrumb.interface';
import { Link } from 'react-router-dom';
// React component
export function BreadCrumb({ paths }: { paths: IBreadcrumb[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((item, index) =>
          index !== paths.length - 1 ? (
            <BreadcrumbItem key={item.id} className='text-xsm'>
              <BreadcrumbLink asChild>
                <Link to={item.path}>{item.name}</Link>
              </BreadcrumbLink>
              <ChevronRight className='h-3.5 w-3.5' />
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={item.id} className='text-xsm'>
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            </BreadcrumbItem>
          ),
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
