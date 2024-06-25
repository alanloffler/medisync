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
  breadcrumb: [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Profesionales', path: '/professionals' },
    { id: 3, name: 'Crear', path: '/professionals/create' },
  ],
  buttons: {
    cancel: 'Cancelar',
    create: 'Crear profesional',
  },
  formDescription: 'Ingresá los datos para dar de alta a un nuevo profesional',
  formTitle: 'Formulario de creación',
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
  title: 'Crear un nuevo profesional',
};