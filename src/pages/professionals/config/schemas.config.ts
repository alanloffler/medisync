export const PROF_SCHEMA = {
  areaMessage: 'Debes seleccionar un área',
  availableMessage: 'Debes seleccionar una disponibilidad',
  descriptionMessage: 'Debes ingresar una descripción',
  dniMessage: 'Debes ingresar un DNI',
  emailMessage: 'Debes ingresar un e-mail válido',
  firstNameMessage: 'Debes ingresar un nombre',
  lastNameMessage: 'Debes ingresar un apellido',
  phoneMessage: 'Debes ingresar un número de teléfono',
  scheduleTimeInitMessage: 'Debes ingresar una hora de inicio',
  scheduleTimeInitRangeMessage: 'Hora de 00 a 23 y minutos de 00 a 59',
  scheduleTimeEndMessage: 'Debes ingresar una hora de fin',
  slotDurationMessage: 'Debes ingresar la duración de los turnos',
  specializationMessage: 'Debes seleccionar una especialización',
  timeSlotUnavailableInitMessage: 'Debes ingresar una hora de inicio',
  timeSlotUnavailableEndMessage: 'Debes ingresar una hora de fin',
  titleAbbreviationMessage: 'Debes ingresar una abreviación de título',
  workingDaysMessage: 'Debes seleccionar al menos un día laboral',

  configuration: {
    common: {
      hourRange: 'Rango de hora de 00 a 23',
      minutesRange: 'Rango de minutos de 00 a 59',
    },
    unavailableTimeInit: {
      greaterThanTimeInit: 'Debe ser mayor a la hora de inicio de agenda, más la duración de un turno',
      lessThanTimeEnd: 'Debe ser menor a la hora de fin de agenda, menos la duración de un turno',
    },
    unavailableTimeEnd: {
      greaterThanTimeEnd: 'Debe ser mayor a la hora de fin de agenda, menos la duración de un turno',
      lessThanTimeInit: 'Debe ser menor a la hora de inicio de agenda, más la duración de un turno',
    },
  },

  inputMask: {
    rangeError: 'La hora de fin no puede ser menor a la de inicio más la duración de al menos un turno',
    rangeErrorUnavailable: 'Rango de descanso fuera del rango de turnos',
  },
};
