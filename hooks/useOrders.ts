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
import { IOrder } from "@/types";
import { useError } from "./useError";
import { CustomError } from "./useErrors";

export interface IUseOrderProps {
  id?: string[];
  name?: string;
  group?: string[];
  status?: number[];
  stolyarComplete?: number;
  shlifComplete?: number;
  malyarComplete?: number;
  goComplete?: number;
  montajComplete?: number;
}

const useOrders = (props: IUseOrderProps) => {
  const { t } = useTranslation();

  const realm = useRealm();

  const { id } = props;

  const { onFetchWithAuth } = useFetchWithAuth();

  const { onSendError } = useError();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [products, setProducts] = useState<IProduct[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;

      const onFindOrders = async () => {
        try {
          isWriteConsole && console.log("useOrders params: ", props);
          const searchParams = new URLSearchParams({
            lang: activeLanguageFromStore?.code || "en",
          });

          await onFetchWithAuth(`${hostAPI}/order/find?` + searchParams, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...props,
            }),
          })
            .then((r) => r.json())
            .then((response) => {
              if (!ignore) {
                isWriteConsole && console.log("useOrders response: ", response);

                const responseOrdersData: IOrder[] = response.data;
                if (!responseOrdersData) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                const listDataForRealm = responseOrdersData.map((x: IOrder) => {
                  return {
                    ...x,
                    // _id: existLocalNode?._id || new BSON.ObjectId(),
                    _id: new BSON.ObjectId(x.id),
                    object: x?.object,
                    tasks: x?.tasks || [],
                  };
                });

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
                          "OrderSchema",
                          listDataForRealm[i],
                          UpdateMode.Modified
                        );

                        if (listDataForRealm[i].object) {
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

                        if (listDataForRealm[i].tasks.length) {
                          for (
                            let j = 0, total = listDataForRealm[i].tasks.length;
                            j < total;
                            j++
                          ) {
                            const _task = listDataForRealm[i].tasks[j];

                            realm.create(
                              "TaskSchema",
                              {
                                ..._task,
                                _id: new BSON.ObjectId(_task.id),
                              },
                              UpdateMode.Modified
                            );

                            if (_task.workers.length) {
                              for (
                                let k = 0, total = _task.workers.length;
                                k < total;
                                k++
                              ) {
                                const _worker = _task.workers[k];
                                realm.create(
                                  "TaskWorkerSchema",
                                  {
                                    ..._worker,
                                    _id: new BSON.ObjectId(_worker.id),
                                  },
                                  UpdateMode.Modified
                                );

                                if (_worker.worker) {
                                  realm.create(
                                    "UserSchema",
                                    {
                                      ..._worker.worker,
                                      _id: new BSON.ObjectId(_worker.worker.id),
                                    },
                                    UpdateMode.Modified
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    } catch (e) {
                      isWriteConsole && console.log("useOrders error: ", e);
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
          onSendError(new CustomError("useOrders", e));
          // console.log('UseNode error: ', e?.message);
        }
      };

      if (!ignore) {
        // setTimeout(onGetNodeInfo, 100);
        onFindOrders();
      }

      return () => {
        ignore = true;
      };
    }, [])
  );

  return {
    isLoading,
    error,
  };
};

export default useOrders;
