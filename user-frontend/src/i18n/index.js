import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources'; // Make sure resources file is correctly named and located

i18n.use(initReactI18next) // pass i18n down to react-i18next
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en', // fallback language
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
