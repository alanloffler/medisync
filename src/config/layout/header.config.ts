export const HEADER_CONFIG = {
  appName: 'MediSync',
  headerMenu: [
    { id: 1, key: 'headerMenu.dashboard', path: '/dashboard' },
    { id: 2, key: 'headerMenu.appointments', path: '/appointments' },
    { id: 3, key: 'headerMenu.professionals', path: '/professionals' },
    { id: 4, key: 'headerMenu.users', path: '/users' },
  ],
  actionsButton: [
    { id: 1, key: 'headerMenu.appointments', menuId: 2, path: '/reserve', default: true },
    { id: 2, key: 'headerMenu.users', menuId: 4, path: '/users/create' },
    { id: 3, key: 'headerMenu.professionals', menuId: 3, path: '/professionals/create' },
  ],
  // Until here is used on header menu
  user: {
    title: 'Mi cuenta',
    menuItems: [
      { id: 1, title: 'Perfil', path: '/profile' },
      { id: 2, title: 'Configuración', path: '/settings' },
      { id: 3, title: 'Salir', path: '/logout' },
    ],
  },
};
