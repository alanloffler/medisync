export const USER_SCHEMA = {
  dni: {
    message: 'Debes ingresar un DNI',
    min: {
      value: 1000000,
      message: 'El DNI debe poseer al menos 7 dígitos',
    },
    max: {
      value: 99999999,
      message: 'El DNI no debe superar los 8 dígitos',
    },
  },

  lastName: {
    message: 'Debes ingresar un apellido',
    min: {
      value: 2,
      message: 'El apellido debe poseer al menos 2 caracteres',
    },
    max: {
      value: 15,
      message: 'El apellido no debe superar los 15 caracteres',
    },
  },

  firstName: {
    message: 'Debes ingresar un nombre',
    min: {
      value: 3,
      message: 'El nombre debe poseer al menos 3 caracteres',
    },
    max: {
      value: 20,
      message: 'El nombre no debe superar los 20 caracteres',
    },
  },

  phone: {
    message: 'Debes ingresar un número de teléfono',
    min: {
      value: 1000000000,
      message: 'El teléfono debe poseer al menos 10 dígitos',
    },
    max: {
      value: 9999999999,
      message: 'El teléfono no debe superar los 10 dígitos',
    },
  },

  email: {
    message: 'Debes ingresar un e-mail válido',
  },
};
