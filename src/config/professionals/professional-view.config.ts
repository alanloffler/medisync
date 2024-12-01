export const PROFESSIONAL_VIEW_CONFIG = {
  // In use
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Detalles', path: '/professionals/:id' },
  ],

  button: {
    back: 'Volver',
    cancel: 'Cancelar',
    deleteProfessional: 'Eliminar profesional',
    goToProfessionals: 'Ir a profesionales',
  },
  dialog: {
    title: 'Eliminar profesional',
    description: 'Acción irreversible. Al eliminar al profesional no vas a poder restaurar sus datos.',
  },
  dropdownMenu: [
    { id: 1, name: 'Enviar e-mail' },
    { id: 2, name: 'Enviar WhatsApp' },
    { id: 3, name: 'Editar profesional' },
  ],
  email: {
    subject: 'MediSync - Turnos médicos',
    body: ['Hola', ','],
  },
  phrases: {
    scheduleTitle: 'Días y horario de atención',
    contactTitle: 'Contacto',
  },
  // WIP: this traanslated and maybe in root file because is used in another components
  select: [
    { id: 0, label: 'Activo', value: true },
    { id: 1, label: 'Inactivo', value: false },
  ],
  title: 'Detalles del profesional',
  tooltip: {
    delete: 'Eliminar',
    edit: 'Editar',
    sendEmail: 'Enviar e-mail',
    sendWhatsApp: 'Enviar WhatsApp',
    share: 'Compartir',
  },
  words: {
    and: 'y',
    error: 'Error',
    hoursSeparator: 'a',
    slotsSeparator: '-',
  },
};


