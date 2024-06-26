export const USER_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
  ],
  buttons: {
    createUser: 'Agregar paciente'
  },
  search: {
    debounceTime: 500,
    label: {
      name: 'Buscar por nombre o apellido',
      dni: 'Buscar por DNI',
    },
    placeholder: {
      name: 'Buscar paciente',
      dni: 'Buscar por DNI',
    },
  },
  table: {
    defaultPageSize: 10,
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
    title: 'Listado de Pacientes',
  },
  title: 'Pacientes',
  tooltip: {
    createUser: 'Agregar paciente',
    reload: 'Recargar',
    sort: 'Ordernar',
  }
};

export const USER_CREATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Usuarios', path: '/users' },
    { id: 3, name: 'Crear', path: '/create' },
  ],
  buttons: {
    back: 'Volver',
    cancel: 'Cancelar',
    create: 'Crear usuario',
  },
  formDescription: 'Ingresá los datos para dar de alta a un nuevo usuario',
  formTitle: 'Creación de usuario',
  labels: {
    dni: 'DNI',
    email: 'Correo electrónico',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
  },
  placeholders: {
    dni: 'Ingresá el DNI',
    email: 'Ingresá el correo electrónico',
    firstName: 'Ingresá el nombre',
    lastName: 'Ingresá el apellido',
    phone: 'Ingresá el teléfono',
  },
}
