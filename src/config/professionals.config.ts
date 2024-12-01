export const PROF_UPDATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Actualizar', path: '/update' },
  ],
  button: {
    back: 'Volver',
    cancel: 'Cancelar',
    update: 'Actualizar profesional',
    updating: 'Actualizando',
  },
  dialog: {
    button: {
      close: 'Cerrar',
    },
    update: {
      errorTitle: 'Error al actualizar profesional',
    },
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
      scheduleTimeEnd: 'Fin de turnos',
      scheduleTimeInit: 'Inicio de turnos',
      slotDuration: 'Duración del turno',
      timeSlotUnavailableEnd: 'Fin de descanso',
      timeSlotUnavailableInit: 'Inicio de descanso',
      workingDays: 'Días laborables',
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
  title: 'Actualizar profesional',
};
export const PROFESSIONALS_SELECT_CONFIG = {
  label: 'Profesional',
  placeholder: 'Seleccionar',
};