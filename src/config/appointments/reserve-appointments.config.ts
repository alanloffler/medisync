export const RESERVE_APPOINTMENT_CONFIG = {
  // In use
  calendar: {
    yearsRange: 1,
  },
  combobox: {
    loadingText: 'Cargando profesionales',
    notFoundText: 'Profesional no encontrado',
    placeholder: 'Profesionales',
    searchText: 'Buscar...',
  },
  dialog: {
    reserve: {
      summary: {
        line1: 'Reserva de turno para',
        line2: 'El día',
        line3: 'A las',
      },
    },

    userCombobox: {
      dniLabel: '- DNI',
      noResults: 'Búsqueda sin resultados',
    },
  },
  phrases: {
    alreadyReservedPlural: 'turnos reservados',
    alreadyReservedSingular: 'turno reservado',
    availableAppointmentPlural: 'turnos disponibles',
    availableAppointmentSingular: 'turno disponible',
    availableDays: 'Días de atención:',
    notAvailable: 'No disponible',
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
