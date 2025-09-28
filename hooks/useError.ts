import { hostAPI, isWriteConsole } from "@/utils/global";
import { useAppSelector } from "@/store/hooks";
import { tokens } from "@/store/storeSlice";
import useErrors, { CustomError } from "./useErrors";

const useError = () => {
  const tokensFromStore = useAppSelector(tokens);
  const { onCreateError } = useErrors();

  const onSendError = async (error: CustomError) => {
    // Показываем ошибку.
    onCreateError(error);

    // пытаемся отправить ошибку.
    if (tokensFromStore) {
      const err = {
        status: 0,
        error: error?.service + ": " + error?.message,
        code: error?.code,
        stack: error?.stack,
      };
      // isWriteConsole && console.log("onSendError: err=", err.error);
      if (error.message.toString().indexOf("Network request failed") == -1) {
        await fetch(`${hostAPI}/app_error`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokensFromStore?.access_token}`,
            "Access-Control-Allow-Origin-Type": "*",
          },
          body: JSON.stringify(err),
        })
          .then((res) => res.json())
          .then((res: any) => {})
          .catch((e) => {
            isWriteConsole &&
              console.log(`onSendError [${error.service}][${error.message}]`);

            isWriteConsole && console.log("записываем в store");
            // const err = new CustomError("OnSendError", e.message, "100");
            // onCreateError(err);
          });
      }
    }
  };

  return {
    onSendError,
  };
};

export { useError };
