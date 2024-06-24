export const USER_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Usuarios', path: '/users' },
  ],
  buttons: {
    addUser: 'Agregar usuario'
  },
  table: {
    defaultPageSize: 2,
    defaultSortingId: 'lastName',
    defaultSortingType: false, // desc: true | false
    headers: ['Apellido y Nombre', 'DNI', 'Teléfono', 'Acciones'],
    itemsPerPage: [5, 10, 20],
    noResults: 'No hay resultados',
    pagination: {
      page: 'Página',
      of: 'de',
    },
    rowsPerPage: 'Filas por página',
    title: 'Listado de Usuarios',
  },
  title: 'Usuarios',
};
