export const PROF_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
  ],
  buttons: {
    addProfessional: 'Agregar profesional',
    cancel: 'Cancelar',
    remove: 'Eliminar profesional',
  },
  dbProfessionalPlural: 'profesionales en la base de datos',
  dbProfessionalSingular: 'profesional en la base de datos',
  filter: {
    title: 'Filtrar',
  },
  dialog: {
    remove: {
      content: {
        dni: 'DNI',
        title: 'Vas a eliminar de la base de datos al profesional:',
      },
      subtitle: '¿Estas seguro de querer eliminar el profesional? Esta acción es irreversible.',
      title: 'Eliminar profesional',
    },
  },
  search: {
    debounceTime: 500,
    filterBy: 'Filtrar por',
    placeholder: 'Buscar profesional',
  },
  table: {
    defaultPageSize: 5,
    defaultSortingId: 'lastName',
    defaultSortingType: false, // desc: true | false
    headers: ['Nombre', 'Área', 'Espec.', 'Disp.', 'Acciones'],
    itemsPerPage: [5, 10, 20],
    noResults: 'No hay resultados',
    pagination: {
      page: 'Página',
      of: 'de',
    },
    rowsPerPage: 'Filas por página',
    title: 'Listado de Profesionales',
  },
  title: 'Profesionales',
};

export const PROF_CREATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Crear', path: '/professionals/create' },
  ],
  buttons: {
    back: 'Volver',
    cancel: 'Cancelar',
    create: 'Crear profesional',
    creating: 'Creando',
  },
  dialog: {
    button: {
      close: 'Cerrar',
    },
    create: {
      errorTitle: 'Error al crear profesional',
    },
  },
  dropdownMenu: [
    { id: 1, name: 'Agregar área', path: '/' },
    { id: 2, name: 'Agregar especialidad', path: '/' },
  ],
  formTitle: {
    description: 'Ingresá los datos para dar de alta a un nuevo profesional',
    header: 'Formulario de creación',
    professional: 'Datos del profesional',
    schedule: 'Configuración de la agenda',
  },
  labels: {
    area: 'Área',
    available: 'Disponible',
    configuration: {
      scheduleTimeEnd: 'Fin de turnos',
      scheduleTimeInit: 'Inicio de turnos',
      slotDuration: 'Duración del turno',
      timeSlotUnavailableEnd: 'Fin de descanso',
      timeSlotUnavailableInit: 'Inicio de descanso',
      workingDays: 'Días laborales',
    },
    description: 'Descripción',
    dni: 'DNI',
    email: 'Correo electrónico',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
    specialization: 'Especialidad',
    title: 'Título',
  },
  placeholders: {
    area: 'Ingresá el área',
    configuration: {
      scheduleTimeEnd: 'Ingresá la hora de finalización',
      scheduleTimeInit: 'Ingresá la hora de inicio',
      slotDuration: 'Min',
      timeSlotUnavailableEnd: 'Ingresá la hora de finalización',
      timeSlotUnavailableInit: 'Ingresá la hora de inicio',
    },
    description: 'Ingresá la descripción',
    dni: 'Ingresá el DNI',
    email: 'Ingresá el correo electrónico',
    firstName: 'Ingresá el nombre',
    lastName: 'Ingresá el apellido',
    phone: 'Ingresá el teléfono',
    specialization: 'Ingresá la especialidad',
    title: 'Ingresá el título',
  },
  select: {
    loadingText: 'Cargando',
  },
  title: 'Crear profesional',
};

export const PROF_UPDATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Actualizar', path: '/update' },
  ],
  button: {
    back: 'Volver',
    cancel: 'Cancelar',
    create: 'Actualizar profesional',
  },
  dropdownMenu: [
    { id: 1, name: 'Agregar área', path: '/' },
    { id: 2, name: 'Agregar especialidad', path: '/' },
  ],

  formSubtitle: 'Configuración de agenda',
  formTitle: {
    description: 'Modificá los datos para actualizar a un profesional',
    header: 'Formulario de actualización',
    professional: 'Datos del profesional',
    schedule: 'Configuración de la agenda',
  },
  labels: {
    area: 'Área',
    available: 'Disponible',
    configuration: {
      slotDuration: 'Duración del turno (min)',
      workingDays: 'Días laborables',
    },
    description: 'Descripción',
    dni: 'DNI',
    email: 'Correo electrónico',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
    scheduleTimeEnd: 'Fin de turnos',
    scheduleTimeInit: 'Inicio de turnos',
    specialization: 'Especialidad',
    timeSlotUnavailableEnd: 'Fin de descanso',
    timeSlotUnavailableInit: 'Inicio de descanso',
    title: 'Título',
  },
  placeholders: {
    area: 'Ingresá el área',
    configuration: {
      slotDuration: 'Ingresá la duración del turno',
    },
    description: 'Ingresá la descripción',
    dni: 'Ingresá el DNI',
    email: 'Ingresá el correo electrónico',
    firstName: 'Ingresá el nombre',
    lastName: 'Ingresá el apellido',
    phone: 'Ingresá el teléfono',
    scheduleTimeEnd: 'Ingresá la hora de finalización',
    scheduleTimeInit: 'Ingresá la hora de inicio',
    specialization: 'Ingresá la especialidad',
    timeSlotUnavailableEnd: 'Ingresá la hora de finalización',
    timeSlotUnavailableInit: 'Ingresá la hora de inicio',
    title: 'Ingresá el título',
  },
  select: {
    loadingText: 'Cargando',
  },
  title: 'Actualizar profesional',
};

export const PROF_VIEW_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Detalles', path: '/professionals/:id' },
  ],
  button: {
    back: 'Volver',
    goToProfessionals: 'Ir a profesionales',
  },
  dropdownMenu: [
    { id: 1, name: 'Enviar e-mail' },
    { id: 2, name: 'Enviar WhatsApp' },
    { id: 3, name: 'Editar profesional' },
  ],
  email: {
    subject: 'MediSync - Turnos médicos',
    body: ['Hola', ','],
  },
  title: 'Detalles del profesional',
  tooltip: {
    dropdown: 'Acciones',
  },
  words: {
    and: 'y',
    hoursSeparator: 'a',
    slotsSeparator: '-',
  },
};
