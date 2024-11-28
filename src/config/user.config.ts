// TODO: when each section is in his own file, this file should be moved to the config folder
export const USER_CONFIG = {
  // In use
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: '/' },
    { id: 2, name: 'breadcrumb.users', path: '/users' },
  ],
  // In use
  search: {
    debounceTime: 500,
  },
  // WIP: this is consumed by table???
  buttons: {
    cancel: 'Cancelar',
    // createUser: 'Agregar paciente',
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

  table: {
    databaseCount: {
      difference: 'que el mes pasado',
      totalPlural: 'pacientes en total',
      totalSingular: 'paciente en total',
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
