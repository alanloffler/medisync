export const PROF_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
  ],
  buttons: {
    addProfessional: 'Agregar profesional',
  },
  dbProfessionals: 'profesionales en la base de datos',
  filter: {
    title: 'Filtrar',
  },
  search: {
    placeholder: 'Buscar profesional o especialización',
  },
  table: {
    defaultPageSize: 10,
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
      slotDuration: 'Duración del turno (min)',
      timeSlotUnavailableEnd: 'Fin de descanso',
      timeSlotUnavailableInit: 'Inicio de descanso',
    },
    description: 'Descripción',
    dni: 'DNI',
    email: 'Correo electrónico',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
    specialization: 'Especialidad',
    titleAbbreviation: 'Título',
    workingDays: 'Días laborales',
  },
  placeholders: {
    area: 'Ingresá el área',
    configuration: {
      scheduleTimeEnd: 'Ingresá la hora de finalización',
      scheduleTimeInit: 'Ingresá la hora de inicio',
      slotDuration: 'Ingresá la duración del turno',
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
    titleAbbreviation: 'Ingresá el título',
  },
  title: 'Crear un nuevo profesional',
};

export const PROF_VIEW_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Detalles', path: '/professionals/:id' },
  ],
  button: {
    back: 'Volver',
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
