import { hostAPI, isWriteConsole } from "@/utils/global";
import { useAppSelector } from "@/store/hooks";
import { tokens } from "@/store/storeSlice";

const useError = () => {
  const tokensFromStore = useAppSelector(tokens);

  const onSendError = async (error: any) => {
    if (tokensFromStore) {
      await fetch(`${hostAPI}/app_error`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokensFromStore?.access_token}`,
          "Access-Control-Allow-Origin-Type": "*",
        },
        body: JSON.stringify({
          status: 0,
          error: error?.message,
          code: error?.code,
          stack: error?.stack,
        }),
      })
        .then((res) => res.json())
        .then((res: any) => {})
        .catch((e) => {
          isWriteConsole && console.log("onSendError Error", e);
        });
    }
  };

  return {
    onSendError,
  };
};

export { useError };
