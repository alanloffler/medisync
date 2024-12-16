export const HEADER_CONFIG = {
  appName: 'MediSync',
  headerMenu: [
    { id: 1, key: 'headerMenu.dashboard', path: '/dashboard' },
    { id: 2, key: 'headerMenu.appointments', path: '/appointments' },
    { id: 3, key: 'headerMenu.professionals', path: '/professionals' },
    { id: 4, key: 'headerMenu.users', path: '/users' },
  ],
  actionsButton: [
    { id: 1, key: 'headerMenu.links.appointment', menuId: 2, path: '/reserve', default: true },
    { id: 2, key: 'headerMenu.links.user', menuId: 4, path: '/users/create' },
    { id: 3, key: 'headerMenu.links.professional', menuId: 3, path: '/professionals/create' },
  ],
  user: {
    title: 'Mi cuenta',
    menuItems: [
      { id: 1, key: 'user.menuItems.profile', path: '/profile' },
      { id: 2, key: 'user.menuItems.settings', path: '/settings' },
      { id: 3, key: 'user.menuItems.logout', path: '/logout' },
    ],
  },
};
