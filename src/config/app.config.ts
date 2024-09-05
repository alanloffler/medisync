export const APP_CONFIG = {
  daysofWeek: {
      // long: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      // short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      long: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      short: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  },
  error: {
    server: 'Error interno del servidor'
  },
  loading: {
    duration: 0.5,
    size: 45,
    text: 'Cargando',
  },
  loadingDB: {
    defaultText: 'Cargando información de la base de datos',
    findProfesionals: 'Cargando profesionales',
    findUsers: 'Cargando pacientes',
    findOneProfessional: 'Cargando información del profesional',
    findOneUser: 'Cargando información del paciente',
    settings: {
      duration: 0.4,
      size: 18,
    },
  },
};
