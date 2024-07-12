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
      search: {
        placeholder: 'Buscar por DNI',
      },
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
    }
  },
  phrases: {
    availableAppointments: 'turnos disponibles',
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
  words: {
    hours: 'hs.',
    hoursSeparator: '-',
    shiftPrefix: 'T',
    unavailable: '-',
  },
};
