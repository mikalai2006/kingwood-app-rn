import { isWriteConsole } from "@/utils/global";
import { useTranslation } from "react-i18next";
// import { Alert } from "react-native";

import { useErrContext } from "@/components/ErrContext";

export default function useErrors() {
  const { setErr, err } = useErrContext();
  const { t } = useTranslation();

  const onCreateError = (e: CustomError) => {
    let _err = e.message.toString();
    switch (e.message.toString()) {
      case "Network request failed":
      case "Aborted":
        _err = t(`error.${e.message.toString()}`);
        break;

      default:
        break;
    }
    setErr([...err, { ...e, message: _err }]);
    //   Alert.alert(t("error.title") + ` ${e.service}`, _err);
    isWriteConsole &&
      console.log(`onCreateError : ${e.service} > ${e.message}`);
  };
  return {
    onCreateError,
  };
}

export class CustomError extends Error {
  code: string;
  service: string;
  constructor(service: string, message: string, code: string = "0") {
    super(message); // Call the parent Error constructor
    this.name = "CustomError"; // Set the name of the custom error
    this.code = code; // Add the custom code property
    this.service = service;
  }
}
