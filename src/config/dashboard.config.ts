export const DASHBOARD_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Dashboard', path: '/dashboard' },
  ],
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
        title: 'Turnos',
      },
      {
        content: 'nuevos este mes',
        title: 'Pacientes',
      },
      {
        content: 'nuevos este mes',
        title: 'Profesionales',
      },
    ],
    loadingText: 'Cargando estadística',
  },
};
