export const LOGIN_SCHEMA = {
  email: {
    message: 'Debes ingresar un e-mail válido',
  },
  password: {
    message: 'Debes ingresar una constraseña',
    min: {
      value: 6,
      message: 'La contraseña debe poseer al menos 6 caracteres',
    },
    max: {
      value: 20,
      message: 'La contraseña no debe superar los 20 caracteres',
    },
  },
};
