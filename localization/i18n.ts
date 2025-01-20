import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./ru.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // compatibilityJSON: "v3", //To make it work for Android devices, add this line.
    resources: {
      "ru-RU": { translation: ru },
      ru: { translation: ru },
    },
    fallbackLng: false,
    lng: "ru", // default language to use.
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
