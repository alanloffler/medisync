export const APPO_CONFIG = {
  appointmentComponent: {
    pagination: {
      defaultItemsPerPage: 20,
      itemsPerPage: [10, 20, 50],
    },
  },
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Turnos', path: '' },
  ],
  buttons: {
    addAppointment: 'Reservar',
    cancelAppointment: 'Cancelar',
    viewAppointment: 'Ver',
  },
  calendar: {
    language: 'es', // ok, see to take from a global variable and use it for the entire app
    placeholder: {
      month: 'Mes',
      year: 'Año',
    },
    yearsRange: 1, // ok
  },
  combobox: {
    loadingText: 'Cargando profesionales',
    notFoundText: 'Profesional no encontrado',
    placeholder: 'Profesionales',
    searchText: 'Buscar...',
  },
  dialog: {
    reserve: {
      buttons: {
        cancel: 'Cancelar',
        save: 'Confirmar reserva',
      },
      summary: {
        line1: 'Reserva de turno para',
        line2: 'El día',
        line3: 'A las',
      },
    },
    cancel: {
      buttons: {
        cancel: 'Cancelar',
        save: 'Cancelar reserva',
      },
    },
    userCombobox: {
      dniLabel: '- DNI',
      noResults: 'Búsqueda sin resultados',
    },
  },

  loading: {
    appointments: 'Cargando turnos',
  },
  pagination: {
    of: 'de',
    page: 'Página',
    rowsPerPage: 'Turnos por página',
  },
  phrases: {
    alreadyReservedPlural: 'turnos reservados',
    alreadyReservedSingular: 'turno reservado',
    availableAppointmentPlural: 'turnos disponibles',
    availableAppointmentSingular: 'turno disponible',
    availableDays: 'Días de atención:',
    notAvailable: 'No disponible',
  },
  table: {
    headers: ['Turno', 'Horario', 'Nombre del paciente', 'DNI', 'Acciones'],
    totalItems: 'turnos en total',
    title: 'Turnos diarios',
  },
  title: {
    page: 'Turnos',
    list: 'Listado general de turnos',
  },
  warning: {
    selectWorkingDay: 'Seleccione un día laborable',
  },
  words: {
    from: 'de',
    hours: 'hs.',
    hoursSeparator: '-',
    schedule: 'Horarios:',
    shiftPrefix: 'T',
    to: 'a',
    unavailable: '-',
  },
};

export const VIEW_APPOINTMENT_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Turnos', path: '/appointments' },
    { id: 3, name: 'Detalle', path: '' },
  ],
  button: {
    back: 'Volver',
  },
  cardTitle: 'Turno',
  email: {
    body: 'Este es el mensaje de tu turno',
    subject: 'Tu turno para',
  },
  loading: {
    appointmentDetails: 'Cargando detalles del turno',
  },
  title: 'Detalle de turno',
  words: {
    hoursAbbreviation: 'hs.',
  },
};
