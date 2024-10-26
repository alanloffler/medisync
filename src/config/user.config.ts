export const USER_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
  ],
  buttons: {
    activateHelp: 'Activar ayuda',
    cancel: 'Cancelar',
    createUser: 'Agregar paciente',
    remove: 'Eliminar paciente',
    removing: 'Eliminando',
  },
  dbUsersPlural: 'pacientes en la base de datos',
  dbUsersSingular: 'paciente en la base de datos',
  dialog: {
    button: {
      close: 'Cerrar',
    },
    remove: {
      content: {
        dni: 'DNI',
        title: 'Vas a eliminar de la base de datos al paciente:',
      },
      subtitle: '¿Estas seguro de querer eliminar el paciente? Esta acción es irreversible.',
      title: 'Eliminar paciente',
    },
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
    create: 'Crear paciente',
    creating: 'Creando',
  },
  dialog: {
    title: 'Error al crear el paciente',
    button: {
      close: 'Cerrar',
    },
  },
  formDescription: 'Ingresá los datos para dar de alta a un nuevo paciente',
  formTitle: 'Creación de paciente',
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
  appointmentRecords: {
    loader: 'Cargando turnos',
    noAppointments: 'No existen turnos para el paciente',
    select: {
      datePicker: {
        button: {
          search: 'Buscar',
        },
        label: 'Fecha',
        placeholder: 'Seleccionar',
        monthSelect: {
          label: 'Meses',
          placeholder: 'Seleccionar',
        },
        yearSelect: {
          label: 'Años',
          placeholder: 'Seleccionar',
        },
      },
    },
    tableHeaders: ['Fecha', 'Profesional', 'Acciones'],
    title: 'Historial de turnos',
  },
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
    { id: 3, name: 'Detalles', path: '/users' },
  ],
  buttons: {
    back: 'Volver',
    goToUsers: 'Ir a pacientes',
  },
  dropdownMenu: [
    { id: 1, name: 'Enviar e-mail' },
    { id: 2, name: 'Enviar WhatsApp' },
    { id: 3, name: 'Editar paciente' },
  ],
  email: {
    subject: 'MediSync - Turnos médicos',
    body: ['Hola', ','],
  },
  phrase: {
    userSince: 'Paciente desde el',
  },
  title: 'Detalles del paciente',
  tooltip: {
    dropdown: 'Acciones',
  },
};

export const USER_UPDATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
    { id: 3, name: 'Actualizar', path: '/users/update/:id' },
  ],
  button: {
    back: 'Volver',
    cancel: 'Cancelar',
    update: 'Actualizar',
    updating: 'Actualizando',
  },
  dialog: {
    title: 'Error al actualizar el paciente',
    button: {
      close: 'Cerrar',
    },
  },
  formDescription: 'Editá los datos para actualizar el paciente',
  formTitle: 'Actualización de paciente',
  label: {
    dni: 'DNI',
    email: 'Correo electrónico',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
  },
  placeholder: {
    dni: 'Ingresá el DNI',
    email: 'Ingresá el correo electrónico',
    firstName: 'Ingresá el nombre',
    lastName: 'Ingresá el apellido',
    phone: 'Ingresá el teléfono',
  },
};
