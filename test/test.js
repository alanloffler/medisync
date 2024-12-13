// const selectedLanguage = 'es';

// const area = {
//   _id: '6661f82135345c8c83e2b916',
//   name: 'medicina',
//   plural: 'medicinas',
//   description: 'Área de médicina en general',
//   active: 1,
// };
// console.log(area, selectedLanguage);

// const date = '12/12/24';

// const shorten = date.slice(0, -3);

// console.log(shorten);

class Utils {
  static url = {
    create: (path) => {
      return path;
    },
  };
}

console.log(Utils.url.create('http://localhost:3000'));
