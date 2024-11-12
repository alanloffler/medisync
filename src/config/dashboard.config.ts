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
    items: [
      {
        content: 'el último mes',
        path: '/appointments',
        title: 'Turnos',
      },
      {
        content: 'nuevos este mes',
        path: '/users',
        title: 'Pacientes',
      },
      {
        content: 'nuevos este mes',
        path: '/professionals',
        title: 'Profesionales',
      },
    ],
    title: 'Estadísticas',
  },
};
