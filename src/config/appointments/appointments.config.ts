import { APP_CONFIG } from '@config/app.config';

export const APPO_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: APP_CONFIG.appPrefix },
    { id: 2, name: 'breadcrumb.appointments', path: '' },
  ],
  table: {
    defaultItemsPerPage: 20,
    defaultSortingId: 'day',
    defaultSortingType: true, // desc: true | false
    header: [
      'table.header.id',
      'table.header.date',
      'table.header.user',
      'table.header.identityCard',
      'table.header.professional',
      'table.header.status',
      'table.header.actions',
    ],
    itemsPerPage: [5, 10, 20, 50, 100],
  },
};
