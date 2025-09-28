import "react-native-get-random-values";
import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IUser } from "@/types";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { CustomError } from "./useErrors";
import { useError } from "./useError";

export interface IUseUserProps {
  id: string;
}

const UseUser = (props: IUseUserProps) => {
  const { id } = props;
  // console.log("UseUser---------------------->");

  const { t } = useTranslation();

  const realm = useRealm();
  // const usersFromRealm = useQuery(UserSchema);

  const { onFetchWithAuth } = useFetchWithAuth();

  const { onSendError } = useError();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState<IUser | null>(null);

  React.useEffect(() => {
    let ignore = false;
    const onGetUser = async () => {
      try {
        // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
        await onFetchWithAuth(
          `${hostAPI}/user/${id}?` +
            new URLSearchParams({
              lang: activeLanguageFromStore?.code || "en",
            }),
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            // node(id: "${featureFromStore?.id}") {
            // body: JSON.stringify({
            //   id,
            // }),
          }
        )
          .then((r) => r.json())
          .then((response) => {
            if (!ignore) {
              // console.log("UseUser: ", response, "========>", id);

              const responseUser: IUser = response;
              if (!responseUser) {
                // dispatch(setActiveNode(null));
                setUser(null);
                setTimeout(() => {
                  setLoading(false);
                }, 300);
                return;
              }

              // console.log("listDataForRealm: ", listDataForRealm);
              realm.write(() => {
                try {
                  realm.create(
                    "UserSchema",
                    {
                      ...responseUser,
                      _id: new BSON.ObjectId(responseUser.id),
                      images: responseUser?.images || [],
                      typeWork: responseUser?.typeWork || [],
                      // _id: existLocalUser?._id || new BSON.ObjectId(),
                    },
                    UpdateMode.Modified
                  );
                } catch (e) {
                  isWriteConsole && console.log("UseUser error: ", e);
                }
              });
              setUser(responseUser);

              setTimeout(() => {
                setLoading(false);
              }, 100);
              // console.log('activeMarker=', response);
              // dispatch(setActiveNode(responseNode));
            }
          })
          .catch((e) => {
            setTimeout(() => {
              setLoading(false);
            }, 300);
            throw e;
          });
      } catch (e: any) {
        // ToastAndroid.showWithGravity(
        //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
        //     ToastAndroid.LONG,
        //     ToastAndroid.TOP,
        // );
        setError(e.message);
        onSendError(new CustomError("useUser", e?.message));
        // console.log('UseNode error: ', e?.message);
      }
    };

    if (id && !ignore) {
      // setTimeout(onGetNodeInfo, 100);
      onGetUser();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  return {
    isLoading,
    user,
    setUser,
    error,
  };
};

export default UseUser;
