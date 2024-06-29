export const USER_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
  ],
  buttons: {
    createUser: 'Agregar paciente',
    activateHelp: 'Activar ayuda',
  },
  search: {
    debounceTime: 500,
    label: 'Búsqueda',
    placeholder: {
      name: 'Apellido y/o nombre',
      dni: 'DNI',
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
    rowsPerPage: 'Pacientes por página',
    title: 'Listado de Pacientes',
  },
  title: 'Pacientes',
  tooltip: {
    enabled: false,
    actions: {
      removeUser: 'Eliminar paciente',
      sendWhatsAppMessage: 'Enviar WhatsApp',
      updateUser: 'Editar paciente',
      viewUser: 'Ver paciente',
    },
    createUser: 'Agregar paciente',
    pagination: {
      firstPage: 'Primera página',
      lastPage: 'Última página',
      nextPage: 'Siguiente página',
      pageSize: 'Pacientes por página',
      prevPage: 'Anterior página',
    },
    reload: 'Recargar',
    sort: 'Ordernar',
  },
};

export const USER_CREATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
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
};

export const USER_VIEW_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
    { id: 3, name: 'Detalles', path: '/ussers' },
  ],
  buttons: {
    back: 'Volver',
  },
  dropdownMenu: [{ id: 1, name: 'Enviar e-mail' }, { id: 2, name: 'Enviar WhatsApp' }],
  phrase: {
    userSince: 'Paciente desde el',
  },
  title: 'Detalles de paciente',
};
