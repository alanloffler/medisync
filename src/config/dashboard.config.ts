export const DASHBOARD_CONFIG = {
  categoriesShortcuts: {
    loadingText: 'Cargando especialidades',
    title: 'Categorías',
  },
  latestAppos: {
    loadingText: 'Cargando turnos',
    title: 'Últimos turnos creados',
  },
  latestUsers: {
    loadingText: 'Cargando usuarios',
    title: 'Usuarios recientes',
  },
  statisticGroup: {
    charts: [
      {
        days: [
          { text: '7d', value: 7, default: true },
          { text: '1m', value: 30 },
          { text: '1a', value: 365 },
        ],
        height: 80,
        label: {
          x: 'F',
          y: 'T',
        },
        margin: { top: 30, right: 20, bottom: 10, left: 20 },
        options: { axisX: false, axisY: false },
        path: '/appointments',
        title: 'Turnos diarios',
      },
    ],
    items: [
      {
        content: 'el último mes',
        path: '/appointments',
        title: 'Turnos',
      },
      {
        content: 'nuevos este mes',
        path: '/professionals',
        title: 'Profesionales',
      },
      {
        content: 'nuevos este mes',
        path: '/users',
        title: 'Pacientes',
      },
    ],
    title: 'Estadísticas',
  },
};
