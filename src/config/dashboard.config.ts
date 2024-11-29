export const DASHBOARD_CONFIG = {
  statisticGroup: {
    charts: [
      {
        days: [
          { text: 'chart.daylyAppointments.date.day', value: 7, default: true },
          { text: 'chart.daylyAppointments.date.month', value: 30 },
          { text: 'chart.daylyAppointments.date.year', value: 365 },
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
    // WIP: translate this
    items: [
      {
        content: 'el último mes',
        path: '/appointments',
        title: 'Turnos',
      },
      {
        content: 'nuevos este mes',
        path: '/professionals',
        title: 'Profesionales',
      },
      {
        content: 'nuevos este mes',
        path: '/users',
        title: 'Pacientes',
      },
    ],
  },
};
