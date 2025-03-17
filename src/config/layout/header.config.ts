import { APP_CONFIG } from '@config/app.config';

export const HEADER_CONFIG = {
  appName: APP_CONFIG.appName,
  headerMenu: [
    { id: 1, key: 'headerMenu.dashboard', path: `${APP_CONFIG.appPrefix}/dashboard` },
    { id: 2, key: 'headerMenu.appointments', path: `${APP_CONFIG.appPrefix}/appointments` },
    { id: 3, key: 'headerMenu.professionals', path: `${APP_CONFIG.appPrefix}/professionals` },
    { id: 4, key: 'headerMenu.users', path: `${APP_CONFIG.appPrefix}/users` },
  ],
  actionsButton: [
    { id: 1, key: 'headerMenu.links.appointment', menuId: 2, path: `${APP_CONFIG.appPrefix}/reserve`, default: true },
    { id: 2, key: 'headerMenu.links.user', menuId: 4, path: `${APP_CONFIG.appPrefix}/users/create` },
    { id: 3, key: 'headerMenu.links.professional', menuId: 3, path: `${APP_CONFIG.appPrefix}/professionals/create` },
  ],
  user: {
    title: 'Mi cuenta',
    menuItems: [
      { id: 1, key: 'user.menuItems.profile', path: `${APP_CONFIG.appPrefix}/profile` },
      { id: 2, key: 'user.menuItems.settings', path: `${APP_CONFIG.appPrefix}/settings` },
      { id: 3, key: 'user.menuItems.logout', path: `${APP_CONFIG.appPrefix}/logout` },
    ],
  },
};
