export const EMAIL_SCHEMA = {
  body: {
    message: 'Debes ingresar un cuerpo del email',
    max: {
      message: 'El mensaje debe poseer menos de 2000 caracteres',
      value: 2000,
    },
    min: {
      message: 'El mensaje debe poseer al menos 5 caracteres',
      value: 5,
    },
  },
  subject: {
    message: 'Debes ingresar un asunto del email',
    max: {
      message: 'El asunto debe poseer menos de 256 caracteres',
      value: 256,
    },
    min: {
      message: 'El asunto debe poseer al menos 5 caracteres',
      value: 5,
    },
  },
  to: {
    message: 'Debes ingresar un email de destinatario'
  },
};
