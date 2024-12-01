export const PROFESSIONALS_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: '/' },
    { id: 2, name: 'breadcrumb.professionals', path: '/professionals' },
  ],
  table: {
    defaultPageSize: 10,
    defaultSortingId: 'lastName',
    defaultSortingType: false, // desc: true | false
    header: ['table.header.id', 'table.header.name', 'table.header.area', 'table.header.specialty', '', 'table.header.actions'],
    itemsPerPage: [5, 10, 20],
  },
};
