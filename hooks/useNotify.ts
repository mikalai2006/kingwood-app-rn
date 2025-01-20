import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { INotify } from "@/types";
import { useError } from "./useError";

export interface IUseNotifyProps {
  id?: string[];
  userId?: string[];
  userTo?: string[];
  status?: number;
  $sort?: { key: string; value: number }[];
  $limit?: number;
  $skip?: number;
}

const useNotify = (props: IUseNotifyProps) => {
  const { t } = useTranslation();

  const realm = useRealm();

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState<INotify[]>([]);
  // const [products, setProducts] = useState<IProduct[]>([]);

  const { onSendError } = useError();

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindItems = async () => {
        try {
          isWriteConsole && console.log("UseNotify props: ", props);

          // if (!workerId) {
          //   return;
          // }
          // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
          await onFetchWithAuth(
            `${hostAPI}/notify/populate?` +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
              }),
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...(props || {}),
              }),
            }
          )
            .then((r) => r.json())
            .then((response) => {
              // console.log("UseNotify response: ", response);
              if (!ignore) {
                const responseData: INotify[] = response.data;

                if (!responseData) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                setItems(responseData);

                const listDataForRealm = responseData.map((x: INotify) => {
                  return {
                    ...x,
                    // _id: existLocalNode?._id || new BSON.ObjectId(),
                    _id: new BSON.ObjectId(x.id),
                    images: x.images ? x.images : [],
                    user: {
                      ...x.user,
                      _id: new BSON.ObjectId(x.user?.id),
                      images: x.user?.images || [],
                      typeWork: x.user?.typeWork || [],
                    },
                    recepient: {
                      ...x.recepient,
                      _id: new BSON.ObjectId(x.recepient?.id),
                      images: x.recepient?.images || [],
                      typeWork: x.recepient?.typeWork || [],
                    },
                  };
                });

                // console.log("listDataForRealm: ", listDataForRealm);
                if (listDataForRealm?.length) {
                  realm.write(() => {
                    for (
                      let i = 0, total = listDataForRealm.length;
                      i < total;
                      i++
                    ) {
                      realm.create(
                        "NotifySchema",
                        listDataForRealm[i],
                        UpdateMode.Modified
                      );

                      if (listDataForRealm[i].user) {
                        realm.create(
                          "UserSchema",
                          listDataForRealm[i].user,
                          UpdateMode.Modified
                        );
                      }

                      if (listDataForRealm[i].recepient) {
                        realm.create(
                          "UserSchema",
                          listDataForRealm[i].recepient,
                          UpdateMode.Modified
                        );
                      }
                    }
                  });
                }
              }
            })
            .catch((e) => {
              // setTimeout(() => {
              //   setLoading(false);
              // }, 300);
              throw e;
            })
            .finally(() => {
              setTimeout(() => {
                setLoading(false);
              }, 300);
            });
        } catch (e: any) {
          // ToastAndroid.showWithGravity(
          //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
          //     ToastAndroid.LONG,
          //     ToastAndroid.TOP,
          // );
          setError(e.message);
          onSendError(e);
          isWriteConsole && console.log("UseNotify error: ", e);
        }
      };

      if (!ignore) {
        setLoading(true);
        // setTimeout(onGetNodeInfo, 100);
        onFindItems();
      }

      return () => {
        ignore = true;
      };
    }, [])
  );

  return {
    items,
    isLoading,
    error,
  };
};

export default useNotify;
