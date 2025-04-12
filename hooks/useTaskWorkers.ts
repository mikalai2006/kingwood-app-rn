import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeLanguage,
  activeTaskWorker,
  setActiveTaskWorker,
  workHistory,
} from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { ITaskWorker, ITaskWorkerPopulate } from "@/types";
import { useError } from "./useError";

export interface IUseTaskWorkersProps {
  query?: string;
  id?: string[];
  objectId?: string[];
  orderId?: string[];
  taskId?: string[];
  workerId?: string[];
  status?: string[];
  $limit?: number;
  $skip?: number;
}

const useTaskWorkers = (props: IUseTaskWorkersProps) => {
  const { t } = useTranslation();

  const realm = useRealm();

  const dispatch = useAppDispatch();

  const { query, workerId, $limit } = props;

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeWorkHistoryFromStore = useAppSelector(workHistory);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const { onSendError } = useError();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState<ITaskWorker[]>([]);

  const [total, setTotal] = useState(0);
  // const [products, setProducts] = useState<IProduct[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindItems = async () => {
        try {
          isWriteConsole && console.log("useTaskWorkers props: ", props);

          // if (!workerId) {
          //   return;
          // }
          // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
          await onFetchWithAuth(
            `${hostAPI}/task_worker/populate?` +
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
              // node(id: "${featureFromStore?.id}") {
              // body: JSON.stringify({
              //   userId: userId || undefined,
              //   query: query || undefined,
              //   id,
              // }),
            }
          )
            .then((r) => r.json())
            .then((response) => {
              if (!ignore) {
                if (response?.total) {
                  setTotal(response.total);
                }

                isWriteConsole &&
                  console.log(
                    "useTaskWorkers response: ",
                    response.data.length
                  );

                const responseTaskWorkersData: ITaskWorker[] = response.data;
                if (!responseTaskWorkersData) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                setItems(responseTaskWorkersData);

                const listDataForRealm = responseTaskWorkersData.map(
                  (x: ITaskWorkerPopulate) => {
                    return {
                      ...x,
                      // _id: existLocalNode?._id || new BSON.ObjectId(),
                      sortOrder: x.sortOrder || 0,
                      _id: new BSON.ObjectId(x.id),
                      task: {
                        ...x.task,
                        _id: new BSON.ObjectId(x.task.id),
                      },
                      taskStatus: {
                        ...x.taskStatus,
                        _id: new BSON.ObjectId(x.taskStatus.id),
                        enabled: x.taskStatus.enabled || 0,
                        // start: x.taskStatus.start || 0,
                        // finish: x.taskStatus.finish || 0,
                        // process: x.taskStatus.process || 0,
                      },
                      order: {
                        ...x.order,
                        _id: new BSON.ObjectId(x.order.id),
                      },
                      object: {
                        ...x.object,
                        _id: new BSON.ObjectId(x.object?.id),
                      },
                    };
                  }
                );

                // console.log("listDataForRealm: ", listDataForRealm);
                if (listDataForRealm.length) {
                  realm.write(() => {
                    try {
                      for (
                        let i = 0, _total = listDataForRealm.length;
                        i < _total;
                        i++
                      ) {
                        realm.create(
                          "TaskWorkerSchema",
                          listDataForRealm[i],
                          UpdateMode.Modified
                        );

                        if (
                          (activeTaskWorkerFromStore == null ||
                            activeTaskWorkerFromStore?.id !=
                              activeWorkHistoryFromStore?.taskWorkerId) &&
                          listDataForRealm[i].id ==
                            activeWorkHistoryFromStore?.taskWorkerId
                        ) {
                          dispatch(
                            setActiveTaskWorker(
                              Object.assign(
                                {},
                                JSON.parse(JSON.stringify(listDataForRealm[i]))
                              )
                            )
                          );
                        }

                        if (listDataForRealm[i].task) {
                          realm.create(
                            "TaskSchema",
                            listDataForRealm[i].task,
                            UpdateMode.Modified
                          );
                        }

                        if (listDataForRealm[i].taskStatus) {
                          realm.create(
                            "TaskStatusSchema",
                            {
                              ...listDataForRealm[i].taskStatus,
                              enabled:
                                listDataForRealm[i].taskStatus.enabled || 0,
                              start:
                                listDataForRealm[i].taskStatus.enabled || 0,
                              finish:
                                listDataForRealm[i].taskStatus.enabled || 0,
                              process:
                                listDataForRealm[i].taskStatus.enabled || 0,
                            },
                            UpdateMode.Modified
                          );
                        }

                        if (listDataForRealm[i].order) {
                          realm.create(
                            "OrderSchema",
                            listDataForRealm[i].order,
                            UpdateMode.Modified
                          );
                        }

                        if (listDataForRealm[i].object) {
                          realm.create(
                            "ObjectsSchema",
                            listDataForRealm[i].object,
                            UpdateMode.Modified
                          );
                        }
                      }
                    } catch (e) {
                      isWriteConsole &&
                        console.log("useTaskWorkers error: ", e);
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
          onSendError(e);
          // console.log('UseNode error: ', e?.message);
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
    }, [props?.$skip])
  );

  return {
    taskWorkers: items,
    isLoading,
    total,
    error,
  };
};

export default useTaskWorkers;
