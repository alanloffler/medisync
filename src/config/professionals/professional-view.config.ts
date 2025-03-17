import { APP_CONFIG } from '@config/app.config';

export const PROFESSIONAL_VIEW_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: APP_CONFIG.appPrefix },
    { id: 2, name: 'breadcrumb.professionals', path: `${APP_CONFIG.appPrefix}/professionals` },
    { id: 3, name: 'breadcrumb.professionalDetails', path: `${APP_CONFIG.appPrefix}/professionals/:id` },
  ],
  select: [
    { id: 0, label: 'label.active', value: true },
    { id: 1, label: 'label.notActive', value: false },
  ],
};
