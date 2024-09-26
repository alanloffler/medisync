// Header config
export const HEADER_CONFIG = {
  appName: 'MediSync',
  headerMenu: [
    { id: 1, title: 'Tablero', path: '/dashboard' },
    { id: 2, title: 'Turnos', path: '/' },
    { id: 3, title: 'Profesionales', path: '/professionals' },
    { id: 4, title: 'Pacientes', path: '/users' },
  ],
  search: {
    placeholder: 'Buscar turnos',
  },
  user: {
    title: 'Mi cuenta',
    menuItems: [
      { id: 1, title: 'Perfil', path: '/profile' },
      { id: 2, title: 'Configuración', path: '/settings' },
      { id: 3, title: 'Salir', path: '/logout' },
    ],
  },
};
