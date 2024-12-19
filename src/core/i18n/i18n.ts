import Backend from 'i18next-http-backend';
import en from './lang/en-us.json';
import es from './lang/es-ar.json';
import i18n from 'i18next';
import { APP_CONFIG } from '@config/app.config';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('i18nextLng') || APP_CONFIG.i18n.locale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        switch (format) {
          case 'number':
            return new Intl.NumberFormat(lng, {
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            }).format(value);
        }
        return value;
      },
    },
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
  });

export default i18n;
