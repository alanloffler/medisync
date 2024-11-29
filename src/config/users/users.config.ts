export const USER_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: '/' },
    { id: 2, name: 'breadcrumb.users', path: '/users' },
  ],
  table: {
    defaultPageSize: 10,
    defaultSortingId: 'lastName',
    defaultSortingType: false, // desc: true | false
    header: ['table.header.id', 'table.header.user', 'table.header.identityCard', 'table.header.phone', 'table.header.actions'],
    itemsPerPage: [5, 10, 20],
  },
};
