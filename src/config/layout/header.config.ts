export const HEADER_CONFIG = {
  appName: 'MediSync',
  headerMenu: [
    { id: 1, title: 'Tablero', path: '/dashboard' },
    { id: 2, title: 'Turnos', path: '/appointments' },
    { id: 3, title: 'Profesionales', path: '/professionals' },
    { id: 4, title: 'Pacientes', path: '/users' },
  ],
  actionsButton: [
    { id: 1, menuId: 2, title: 'Turno', path: '/reserve', default: true },
    { id: 2, menuId: 4, title: 'Paciente', path: '/users/create' },
    { id: 3, menuId: 3, title: 'Profesional', path: '/professionals/create' },
  ],
  user: {
    title: 'Mi cuenta',
    menuItems: [
      { id: 1, title: 'Perfil', path: '/profile' },
      { id: 2, title: 'Configuración', path: '/settings' },
      { id: 3, title: 'Salir', path: '/logout' },
    ],
  },
};
