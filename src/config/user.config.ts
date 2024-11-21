export const USER_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Pacientes', path: '/users' },
  ],
  buttons: {
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
    databaseCount: {
      totalPlural: 'usuarios en total',
      totalSingular: 'usuarios en total',
    },
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
    tooltip: {
      button: {
        delete: 'Eliminar',
        edit: 'Editar',
        sendWhatsApp: 'Enviar WhatsApp',
        view: 'Ver detalles',
      },
      pagination: {
        firstPage: 'Primera página',
        itemsPerPage: 'Filas por página',
        lastPage: 'Última página',
        nextPage: 'Página siguiente',
        prevPage: 'Página anterior',
      },
    },
  },
  title: 'Pacientes',
  tooltip: {
    addUser: 'Agregar paciente',
    reload: 'Recargar',
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
  apposRecord: {
    dialog: {
      cancelButton: 'Cancelar',
      content: 'Vas a eliminar el turno del paciente',
      deleting: 'Eliminando turno',
      description: 'Esta acción es irreversible. Vas a eliminar un turno.',
      removeButton: 'Eliminar',
      title: 'Eliminación de turno',
    },
    filters: {
      button: {
        clear: 'Borrar filtros',
      },
      select: {
        professional: {
          errorText: 'Error',
          loadingText: 'Cargando',
          placeholder: 'Profesionales',
          tooltip: 'Seleccionar profesional',
        },
        year: {
          errorText: 'Error',
          loadingText: 'Cargando',
          placeholder: 'Año',
          tooltip: 'Seleccionar año',
        },
      },
      title: 'Filtrar turnos',
    },
    table: {
      emptyList: 'No existen turnos para el paciente',
      errorText: 'Error cargando turnos',
      headers: ['Fecha', 'Profesional', 'Acciones'],
      loadingText: 'Cargando turnos',
      tooltip: {
        user: {
          delete: 'Eliminar',
          details: 'Ver detalles',
          message: 'Enviar mensaje',
        },
      },
    },
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
  email: {
    subject: 'MediSync - Turnos médicos',
    body: ['Hola', ','],
  },
  phrase: {
    userSince: 'Paciente desde el',
  },
  title: 'Detalles del paciente',
  tooltip: {
    deleteUser: 'Eliminar paciente',
    sendEmail: 'Enviar e-mail',
    sendWhatsApp: 'Enviar WhatsApp',
    updateUser: 'Editar paciente',
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
