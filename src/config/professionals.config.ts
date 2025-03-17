import { APP_CONFIG } from '@config/app.config';

export const PROF_UPDATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: APP_CONFIG.appPrefix },
    { id: 2, name: 'breadcrumb.professionals', path: `${APP_CONFIG.appPrefix}/professionals` },
    { id: 3, name: 'breadcrumb.professionalUpdate', path: `${APP_CONFIG.appPrefix}/professionals/update/:id` },
  ],
  dropdownMenu: [
    { id: 1, name: 'button.addArea', path: APP_CONFIG.appPrefix },
    { id: 2, name: 'button.addSpecialty', path: APP_CONFIG.appPrefix },
  ],
};
