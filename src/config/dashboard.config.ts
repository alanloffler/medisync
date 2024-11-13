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
        height: 80,
        label: {
          x: 'F',
          y: 'T',
        },
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        options: { axisX: true, axisY: true },
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
