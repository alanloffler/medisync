import { APP_CONFIG } from '@config/app.config';

export const USER_VIEW_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: APP_CONFIG.appPrefix },
    { id: 2, name: 'breadcrumb.users', path: `${APP_CONFIG.appPrefix}/users` },
    { id: 3, name: 'breadcrumb.userDetails', path: '' },
  ],
  table: {
    appointments: {
      defaultItemsPerPage: 5,
      header: ['table.header.date', 'table.header.professional', 'table.header.actions'],
      itemsPerPageOptions: [5, 10, 20, 50],
    },
  },
};
