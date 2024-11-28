export const USER_UPDATE_CONFIG = {
  breadcrumb: [
    { id: 1, name: 'breadcrumb.home', path: '/' },
    { id: 2, name: 'breadcrumb.users', path: '/users' },
    { id: 3, name: 'breadcrumb.update', path: '/users/update/:id' },
  ],
  button: {
    // back: 'Volver',
    cancel: 'Cancelar',
    update: 'Actualizar',
    updating: 'Actualizando',
  },
  dialog: {
    title: 'Error al actualizar el paciente',
    button: {
      close: 'Cerrar',
    },
  },
  formDescription: 'Editá los datos para actualizar el paciente',
  formTitle: 'Actualización de paciente',
  label: {
    dni: 'DNI',
    email: 'Correo electrónico',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
  },
  placeholder: {
    dni: 'Ingresá el DNI',
    email: 'Ingresá el correo electrónico',
    firstName: 'Ingresá el nombre',
    lastName: 'Ingresá el apellido',
    phone: 'Ingresá el teléfono',
  },
};
