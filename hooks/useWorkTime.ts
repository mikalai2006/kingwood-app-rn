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
import { IWorkTime } from "@/types";
import { useError } from "./useError";
import { CustomError } from "./useErrors";

export interface IUseWorkTimeProps {
  id?: string[];
  workerId?: string[];
  date?: string;
  from?: string;
  to?: string;
}

const UseWorkTime = (props: IUseWorkTimeProps, deps: any[]) => {
  const { t } = useTranslation();

  const realm = useRealm();

  const { onFetchWithAuth } = useFetchWithAuth();

  const { onSendError } = useError();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindItems = async () => {
        try {
          isWriteConsole && console.log("UseWorkTime props: ", props);

          await onFetchWithAuth(
            `${hostAPI}/work_time/populate?` +
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
                ...props,
              }),
            }
          )
            .then((r) => r.json())
            .then((response) => {
              if (!ignore) {
                // console.log("UseWorkTime response: ", response);

                const responseData: IWorkTime[] = response.data;
                if (!responseData) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                const listDataForRealm = responseData.map((x: IWorkTime) => {
                  return {
                    ...x,
                    _id: new BSON.ObjectId(x.id),
                  };
                });

                // console.log("listDataForRealm: ", listDataForRealm);
                if (listDataForRealm.length) {
                  realm.write(() => {
                    try {
                      for (
                        let i = 0, total = listDataForRealm.length;
                        i < total;
                        i++
                      ) {
                        realm.create(
                          "WorkTimeSchema",
                          listDataForRealm[i],
                          UpdateMode.Modified
                        );

                        // if (listDataForRealm[i].object) {
                        //   realm.create(
                        //     "ObjectsSchema",
                        //     {
                        //       ...listDataForRealm[i].object,
                        //       _id: new BSON.ObjectId(
                        //         listDataForRealm[i].objectId
                        //       ),
                        //     },
                        //     UpdateMode.Modified
                        //   );
                        // }

                        // if (listDataForRealm[i].workers) {
                        //   for (
                        //     let j = 0,
                        //       total = listDataForRealm[i].workers.length;
                        //     j < total;
                        //     j++
                        //   ) {
                        //     realm.create(
                        //       "TaskWorkerSchema",
                        //       {
                        //         ...listDataForRealm[i].workers[j],
                        //         _id: new BSON.ObjectId(
                        //           listDataForRealm[i].workers[j].id
                        //         ),
                        //       },
                        //       UpdateMode.Modified
                        //     );

                        //     if (listDataForRealm[i].workers[j].worker) {
                        //       realm.create(
                        //         "UserSchema",
                        //         {
                        //           ...listDataForRealm[i].workers[j].worker,
                        //           _id: new BSON.ObjectId(
                        //             listDataForRealm[i].workers[j].worker.id
                        //           ),
                        //         },
                        //         UpdateMode.Modified
                        //       );
                        //     }
                        //   }
                        // }
                      }
                    } catch (e) {
                      isWriteConsole && console.log("UseWorkTime error: ", e);
                    }
                  });
                }
                // console.log("productsFromRealm: ", localOffersMap);
                // setProducts(responseProductsData);

                // console.log('activeMarker=', response);
                // dispatch(setActiveNode(responseNode));
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
          onSendError(new CustomError("useWorkTime", e?.message));
          // console.log('UseNode error: ', e?.message);
        }
      };

      if (!ignore) {
        // setTimeout(onGetNodeInfo, 100);
        onFindItems();
      }

      return () => {
        ignore = true;
      };
    }, [...deps])
  );

  return {
    isLoading,
    error,
  };
};

export default UseWorkTime;
