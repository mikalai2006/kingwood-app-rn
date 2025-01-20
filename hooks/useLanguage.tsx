import { setLangCode } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import dayjs from "@/utils/dayjs";

export default function useLanguage() {
  const { i18n } = useTranslation();
  // console.log('i18n.languages=', i18n.options.resources);

  // const activeLang = useAppSelector(langCode);
  const dispatch = useAppDispatch();

  const onChangeLocale = (lang: string) => {
    i18n.changeLanguage && i18n.changeLanguage(lang);
    dayjs.locale(lang);
  };

  const onChooseLanguage = (lang: string) => {
    dispatch(setLangCode(lang));
    onChangeLocale(lang);
  };
  return {
    onChooseLanguage,
    onChangeLocale,
  };
}
