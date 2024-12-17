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
        path: '/appointments',
        title: 'chart.dailyAppointments.title',
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
