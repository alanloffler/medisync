export const PROF_CONFIG = {
  buttons: {
    addProfessional: 'Agregar profesional',
  },
  filter: {
    title: 'Filtrar',
  },
  search: {
    placeholder: 'Buscar profesional o especialización',
  },
  table: {
    defaultPageSize: 10,
    defaultSortingId: 'lastName',
    defaultSortingType: false, // desc: true | false
    headers: ['Nombre', 'Área', 'Espec.', 'Disp.', 'Acciones'],
    itemsPerPage: [5, 10, 20],
    noResults: 'No hay resultados',
    pagination: {
      page: 'Página',
      of: 'de',
    },
    rowsPerPage: 'Filas por página',
    title: 'Listado de Profesionales',
  },
  title: 'Profesionales',
};

export const PROF_CREATE_CONFIG = {
  title: 'Crear un nuevo profesional',
  formTitle: 'Formulario de creación',
  formDescription: 'Ingresá los datos para dar de alta a un nuevo profesional',
  buttons: {
    cancel: 'Cancelar',
    create: 'Crear profesional',
  },
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Crear', path: '/create' },
  ],
  labels: {
    area: 'Área',
    available: 'Disponible',
    email: 'Correo electrónico',
    firstName: 'Nombre',
    lastName: 'Apellido',
    phone: 'Teléfono',
    specialization: 'Especialidad',
    titleAbbreviation: 'Título',
  },
  placeholders: {
    area: 'Ingresá el área',
    email: 'Ingresá el correo electrónico',
    firstName: 'Ingresá el nombre',
    lastName: 'Ingresá el apellido',
    phone: 'Ingresá el teléfono',
    specialization: 'Ingresá la especialidad',
    titleAbbreviation: 'Ingresá el título',
  },
};

// export const professionals: IProfessional[] = [
//   {
//     area: 'Medicina',
//     email: 'juan.perez@gmail.com',
//     firstName: 'Juan',
//     id: 1,
//     lastName: 'Pérez',
//     specialization: 'Cardiología',
//     titleAbbreviation: 'Dr.',
//   },
//   {
//     area: 'Medicina',
//     email: 'maria.gomez@gmail.com',
//     firstName: 'María',
//     id: 2,
//     lastName: 'Gómez',
//     specialization: 'Dermatología',
//     titleAbbreviation: 'Dra.',
//   },
//   {
//     area: 'Medicina',
//     email: 'carlos.lopez@gmail.com',
//     firstName: 'Carlos',
//     id: 3,
//     lastName: 'López',
//     specialization: 'Pediatría',
//     titleAbbreviation: 'Dr.',
//   },
//   {
//     area: 'Medicina',
//     email: 'ana.martinez@gmail.com',
//     firstName: 'Ana',
//     id: 4,
//     lastName: 'Martínez',
//     specialization: 'Neurología',
//     titleAbbreviation: 'Dra.',
//   },
//   {
//     area: 'Medicina',
//     email: 'luisa.rodriguez@gmail.com',
//     firstName: 'Luisa',
//     id: 5,
//     lastName: 'Rodríguez',
//     specialization: 'Ginecología',
//     titleAbbreviation: 'Dra.',
//   },
//   {
//     area: 'Medicina',
//     email: 'juan.perez@gmail.com',
//     firstName: 'Juan',
//     id: 6,
//     lastName: 'Pérez',
//     specialization: 'Cardiología',
//     titleAbbreviation: 'Dr.',
//   },
//   {
//     area: 'Medicina',
//     email: 'maria.gomez@gmail.com',
//     firstName: 'María',
//     id: 7,
//     lastName: 'Gómez',
//     specialization: 'Dermatología',
//     titleAbbreviation: 'Dra.',
//   },
//   {
//     area: 'Medicina',
//     email: 'carlos.lopez@gmail.com',
//     firstName: 'Carlos',
//     id: 8,
//     lastName: 'López',
//     specialization: 'Pediatría',
//     titleAbbreviation: 'Dr.',
//   },
//   {
//     area: 'Medicina',
//     email: 'ana.martinez@gmail.com',
//     firstName: 'Ana',
//     id: 9,
//     lastName: 'Martínez',
//     specialization: 'Neurología',
//     titleAbbreviation: 'Dra.',
//   },
//   {
//     area: 'Medicina',
//     email: 'luisa.rodriguez@gmail.com',
//     firstName: 'Luisa',
//     id: 10,
//     lastName: 'Rodríguez',
//     specialization: 'Ginecología',
//     titleAbbreviation: 'Dra.',
//   },
// ];
