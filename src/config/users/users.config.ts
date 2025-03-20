import { APP_CONFIG } from '@config/app.config';

export const USER_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: APP_CONFIG.appPrefix },
    { id: 2, name: 'breadcrumb.users', path: '' },
  ],
  table: {
    defaultPageSize: 10,
    defaultSortingId: 'lastName',
    defaultSortingType: false, // desc: true | false
    header: ['table.header.id', 'table.header.fullName', 'table.header.identityCard', 'table.header.phone', 'table.header.actions'],
    itemsPerPage: [5, 10, 20],
  },
};
