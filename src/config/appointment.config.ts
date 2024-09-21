export const APPO_CONFIG = {
  buttons: {
    addAppointment: 'Reservar',
    cancelAppointment: 'Cancelar',
    viewAppointment: 'Ver',
  },
  calendar: {
    language: 'es',
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
      description: 'Al confirmar, vas a realizar una reserva de turno',
      title: 'Reserva de turno',
    },
    cancel: {
      buttons: {
        cancel: 'Cancelar',
        save: 'Cancelar reserva',
      },
      contentText: 'Cancelación del turno para ',
      description: 'Al confirmar, vas a cancelar la reserva de turno',
      title: 'Cancelación de turno',
    },
    userCombobox: {
      dniLabel: '- DNI',
      noResults: 'Búsqueda sin resultados',
      placeholder: 'Buscar por DNI',
    },
  },
  errors: {
    configurationUnavailable: 'El profesional no tiene configuración de agenda',
  },
  phrases: {
    alreadyReservedPlural: 'turnos reservados',
    alreadyReservedSingular: 'turno reservado',
    availableAppointmentPlural: 'turnos disponibles',
    availableAppointmentSingular: 'turno disponible',
    availableDays: 'Días de atención:',
    notAvailable: 'No disponible',
  },
  steps: {
    text1: 'Seleccionar profesional',
    text2: 'Seleccionar fecha',
    text3: 'Seleccionar turno',
  },
  table: {
    headers: ['Turno', 'Horario', 'Nombre del paciente', 'Acciones'],
    title: 'Turnos diarios',
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
    { id: 2, name: 'Turnos', path: '/' },
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
  title: 'Detalle de turno',
  words: {
    hoursAbbreviation: 'hs.',
  },
};
