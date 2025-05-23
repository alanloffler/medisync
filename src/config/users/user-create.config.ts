import { APP_CONFIG } from '@config/app.config';

export const USER_CREATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: APP_CONFIG.appPrefix },
    { id: 2, name: 'breadcrumb.users', path: `${APP_CONFIG.appPrefix}/users` },
    { id: 3, name: 'breadcrumb.create', path: `${APP_CONFIG.appPrefix}/create` },
  ],
};
