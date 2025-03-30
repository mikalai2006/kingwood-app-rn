import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeLanguage,
  setActiveTaskWorker,
  setWorkHistory,
  user,
} from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { useError } from "./useError";
import { IWorkHistory, IWorkHistoryPopulate } from "@/types";
import { getObjectId } from "@/utils/utils";

export interface IUseWorkHistoryProps {
  workerId?: string[];
  status?: number;
  date?: string;
  from?: string;
  to?: string;
}

const useWorkHistory = (props: IUseWorkHistoryProps, deps: any[]) => {
  const { t } = useTranslation();

  const realm = useRealm();

  const userFromStore = useAppSelector(user);

  const dispatch = useAppDispatch();

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
          if (!userFromStore) {
            return;
          }

          isWriteConsole && console.log("useWorkHistory props=", props);
          // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
          await onFetchWithAuth(
            `${hostAPI}/work_history/populate?` +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
              }),
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              // node(id: "${featureFromStore?.id}") {
              body: JSON.stringify(props),
            }
          )
            .then((r) => r.json())
            .then((response) => {
              if (!ignore) {
                isWriteConsole &&
                  console.log(
                    "useWorkHistory response=",
                    response.data?.length
                  );
                // console.log(
                //   "useObjects response: ",
                //   response,
                //   !response.data?.length
                // );

                const responseData: IWorkHistory[] = response.data;

                // устанавливаем активную запись выполняемой
                if (!responseData?.length) {
                  dispatch(setWorkHistory(null));
                  dispatch(setActiveTaskWorker(null));

                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                } else {
                  if (
                    props?.status === 0 &&
                    responseData[0]?.workerId == userFromStore?.id
                  ) {
                    dispatch(setWorkHistory(responseData[0]));
                  }
                }

                const listDataForRealm = responseData.map(
                  (x: IWorkHistoryPopulate) => {
                    return {
                      ...x,
                      // _id: existLocalNode?._id || new BSON.ObjectId(),
                      _id: new BSON.ObjectId(x.id),
                    };
                  }
                );

                // console.log("listDataForRealm: ", listDataForRealm);
                if (listDataForRealm?.length) {
                  realm.write(() => {
                    try {
                      for (
                        let i = 0, total = listDataForRealm.length;
                        i < total;
                        i++
                      ) {
                        realm.create(
                          "WorkHistorySchema",
                          listDataForRealm[i],
                          UpdateMode.Modified
                        );

                        if (
                          listDataForRealm[i].object &&
                          getObjectId(listDataForRealm[i].object?.id) != "0"
                        ) {
                          realm.create(
                            "ObjectsSchema",
                            {
                              ...listDataForRealm[i].object,

                              _id: new BSON.ObjectId(
                                listDataForRealm[i].object?.id
                              ),
                            },
                            UpdateMode.Modified
                          );
                        }

                        if (
                          listDataForRealm[i].order &&
                          getObjectId(listDataForRealm[i].order?.id) != "0"
                        ) {
                          realm.create(
                            "OrderSchema",
                            {
                              ...listDataForRealm[i].order,

                              _id: new BSON.ObjectId(
                                listDataForRealm[i].order?.id
                              ),
                            },
                            UpdateMode.Modified
                          );
                        }
                      }
                    } catch (e) {
                      isWriteConsole &&
                        console.log("useWorkHistory error: ", e);
                    }
                  });
                }
                // console.log("listDataForRealm: ", listDataForRealm);
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
          onSendError(e);
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

export default useWorkHistory;
