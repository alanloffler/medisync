export const APPO_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: '/' },
    { id: 2, name: 'breadcrumb.appointments', path: '' },
  ],
  table: {
    defaultItemsPerPage: 20,
    defaultSortingId: 'lastName',
    defaultSortingType: false, // desc: true | false
    header: [
      'table.header.id',
      'table.header.date',
      'table.header.user',
      'table.header.identityCard',
      'table.header.professional',
      'table.header.actions',
    ],
    itemsPerPage: [10, 20, 50, 100],
  },
};
