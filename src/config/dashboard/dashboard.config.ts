import { APP_CONFIG } from '@config/app.config';

export const DASHBOARD_CONFIG = {
  statisticGroup: {
    charts: [
      {
        days: [
          { text: 'chart.dailyAppointments.date.day', value: 7, default: true },
          { text: 'chart.dailyAppointments.date.month', value: 30 }, // 30 per month
          { text: 'chart.dailyAppointments.date.year', value: 365 }, // 365 per year
        ],
        height: 80,
        label: {
          x: 'chart.dailyAppointments.label.x',
          y: 'chart.dailyAppointments.label.y',
        },
        margin: { top: 30, right: 20, bottom: 10, left: 20 },
        options: { axisX: false, axisY: false },
        path: `${APP_CONFIG.appPrefix}/appointments`,
        title: 'chart.dailyAppointments.title',
      },
    ],
    items: [
      {
        _id: 2,
        content: 'dashboard.lastMonth',
        path: `${APP_CONFIG.appPrefix}/appointments`,
        title: 'headerMenu.appointments',
      },
      {
        _id: 3,
        content: 'dashboard.newThisMonth',
        path: `${APP_CONFIG.appPrefix}/professionals`,
        title: 'headerMenu.professionals',
      },
      {
        _id: 4,
        content: 'dashboard.newThisMonth',
        path: `${APP_CONFIG.appPrefix}/users`,
        title: 'headerMenu.users',
      },
    ],
  },
};
