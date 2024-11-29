export const DASHBOARD_CONFIG = {
  statisticGroup: {
    charts: [
      {
        days: [
          { text: 'chart.daylyAppointments.date.day', value: 7, default: true },
          { text: 'chart.daylyAppointments.date.month', value: 30 }, // 30 per month
          { text: 'chart.daylyAppointments.date.year', value: 365 }, // 365 per year
        ],
        height: 80,
        label: {
          x: 'chart.daylyAppointments.label.x',
          y: 'chart.daylyAppointments.label.y',
        },
        margin: { top: 30, right: 20, bottom: 10, left: 20 },
        options: { axisX: false, axisY: false },
        path: '/appointments',
        title: 'chart.daylyAppointments.title',
      },
    ],
    items: [
      {
        content: 'dashboard.lastMonth',
        path: '/appointments',
        title: 'headerMenu.appointments',
      },
      {
        content: 'dashboard.newThisMonth',
        path: '/professionals',
        title: 'headerMenu.professionals',
      },
      {
        content: 'dashboard.newThisMonth',
        path: '/users',
        title: 'headerMenu.users',
      },
    ],
  },
};
