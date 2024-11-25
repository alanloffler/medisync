// import { APP_CONFIG } from '@config/app.config';
import en from './lang/en.json';
import es from './lang/es.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
.use(initReactI18next)
.init({
  // lng: APP_CONFIG.i18n.locale,
  lng: 'es',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
});

export default i18n;
