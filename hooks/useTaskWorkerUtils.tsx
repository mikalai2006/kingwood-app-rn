import {
  OrderSchema,
  TaskSchema,
  TaskStatusSchema,
  TaskWorkerSchema,
} from "@/schema";
import { useObject, useQuery, useRealm } from "@realm/react";
import { useCallback, useState } from "react";
import { useFetchWithAuth } from "./useFetchWithAuth";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeTaskWorker,
  setActiveTaskWorker,
  setWorkHistory,
  user,
  workHistory,
} from "@/store/storeSlice";
import { ITaskWorker } from "@/types";
import { BSON, UpdateMode } from "realm";
import dayjs from "@/utils/dayjs";
import { Alert, ToastAndroid } from "react-native";
import { useTranslation } from "react-i18next";
import useAuth from "./useAuth";
import { router } from "expo-router";
import { Dayjs } from "dayjs";

export const useTaskWorkerUtils = () => {
  const { t } = useTranslation();

  const { onLogout } = useAuth();

  const dispatch = useAppDispatch();

  const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const realm = useRealm();

  const allOrders = useQuery(OrderSchema);

  const allTaskStatus = useQuery(TaskStatusSchema);

  const { onFetchWithAuth } = useFetchWithAuth();

  const [loading, setLoading] = useState(false);

  const defaultTask = useObject(
    TaskSchema,
    new BSON.ObjectId("000000000000000000000000")
  );

  const defaultTaskWorker = useObject(
    TaskWorkerSchema,
    new BSON.ObjectId("000000000000000000000000")
  );

  // const onStartPrevTask = async () => {
  //   const _status = allTaskStatus.find((x) => x.status === "process");
  //   if (!_status) {
  //     return;
  //   }

  //   await onFetchWithAuth(
  //     `${hostAPI}/task_worker/${activeTaskWorkerFromStore?.id}`,
  //     {
  //       method: "PATCH",
  //       body: JSON.stringify({
  //         // statusId: "6749ffe3d6b4324345382aed",
  //         statusId: _status._id.toString(),
  //         status: _status.status,
  //       }),
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((res: ITaskWorker) => {
  //       try {
  //         isWriteConsole && console.log("onEndWorkTime res: ", res);

  //         realm.write(() => {
  //           if (res.id) {
  //             realm.create(
  //               "TaskWorkerSchema",
  //               {
  //                 ...res,
  //                 _id: new BSON.ObjectId(res.id),
  //                 sortOrder: res.sortOrder || 0,
  //               },
  //               UpdateMode.Modified
  //             );
  //           }
  //         });

  //         dispatch(setActiveTaskWorker(res));

  //         // _status.status && onWriteWorkHistory(_status.status, res);
  //       } catch (e) {
  //         isWriteConsole && console.log("onEndWorkTime error: ", e);
  //       }
  //     })
  //     .catch((e) => {
  //       isWriteConsole && console.log("onEndWorkTime Error", e);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //       // dispatch(clearTimeWork());
  //     });
  // };

  const onEndWorkTime = useCallback(
    async (date?: Dayjs) => {
      const _status = allTaskStatus.find((x) => x.status === "pause");
      if (!_status || workHistoryFromStore === null) {
        return;
      }
      // console.log("onEndWorkTime:", activeTaskWorkerFromStore);

      setLoading(true);
      // dispatch(setTimeWorkEnd(new Date().getTime()));
      const dataRequest: any = {
        // statusId: "6749ffe3d6b4324345382aed",
        statusId: _status._id.toString(),
        status: _status.status,
        workerId: userFromStore?.id,
      };
      if (date) {
        dataRequest.toWorkHistory = date.format();
      }
      await onFetchWithAuth(
        `${hostAPI}/task_worker/${workHistoryFromStore.taskWorkerId}`,
        {
          method: "PATCH",
          body: JSON.stringify(dataRequest),
        }
      )
        .then((res) => res.json())
        .then((res: ITaskWorker) => {
          try {
            isWriteConsole && console.log("onEndWorkTime res: ", res);

            realm.write(() => {
              if (res.id) {
                realm.create(
                  "TaskWorkerSchema",
                  {
                    ...res,
                    _id: new BSON.ObjectId(res.id),
                    sortOrder: res.sortOrder || 0,
                  },
                  UpdateMode.Modified
                );
                dispatch(setActiveTaskWorker(null));
                dispatch(setWorkHistory(null));

                // _status.status && onWriteWorkHistory(_status.status, res);
              }
            });
          } catch (e) {
            isWriteConsole && console.log("onEndWorkTime error: ", e);
          }
        })
        .catch((e) => {
          isWriteConsole && console.log("onEndWorkTime Error", e);
        })
        .finally(() => {
          setLoading(false);
          // dispatch(clearTimeWork());
        });

      // const timeDate = dayjs(new Date()).utc();

      // await onFetchWithAuth(`${hostAPI}/work_time/${workHistoryFromStore.id}`, {
      //   method: "PATCH",
      //   body: JSON.stringify({
      //     // statusId: "6749ffe3d6b4324345382aed",
      //     to: timeDate.format(),
      //     status: 1,
      //   }),
      // })
      //   .then((res) => res.json())
      //   .then((res: IWorkTime) => {
      //     try {
      //       isWriteConsole && console.log("onEndWorkTime res: ", res);

      //       realm.write(() => {
      //         if (res.id) {
      //           realm.create(
      //             "WorkTimeSchema",
      //             {
      //               ...res,
      //               _id: new BSON.ObjectId(res.id),
      //             },
      //             UpdateMode.Modified
      //           );
      //         }
      //         // dispatch(setActiveTaskWorker(null));
      //       });
      //     } catch (e) {
      //       isWriteConsole && console.log("onEndWorkTime error: ", e);
      //     }
      //   })
      //   .catch((e) => {
      //     isWriteConsole && console.log("onEndWorkTime Error", e);
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //     dispatch(setWorkTime(null));
      //     ToastAndroid.show(t("info.successEndWorkTime"), ToastAndroid.LONG);
      //   });
    },
    [workHistoryFromStore]
  );

  // const onEndWorkPrevDay = useCallback(
  //   async (date?: Dayjs) => {
  //     const _status = allTaskStatus.find((x) => x.status === "pause");
  //     if (!_status || workHistoryFromStore === null) {
  //       return;
  //     }
  //     // console.log("onEndWorkTime:", activeTaskWorkerFromStore);

  //     setLoading(true);
  //     // dispatch(setTimeWorkEnd(new Date().getTime()));
  //     const dataRequest: any = {
  //       // statusId: "6749ffe3d6b4324345382aed",
  //       statusId: _status._id.toString(),
  //       status: _status.status,
  //       workerId: userFromStore?.id,
  //     };
  //     if (date) {
  //       dataRequest.to = date.format();
  //     }
  //     await onFetchWithAuth(
  //       `${hostAPI}/task_worker/${workHistoryFromStore.taskWorkerId}`,
  //       {
  //         method: "PATCH",
  //         body: JSON.stringify(dataRequest),
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res: ITaskWorker) => {
  //         try {
  //           isWriteConsole && console.log("onEndWorkTime res: ", res);

  //           realm.write(() => {
  //             if (res.id) {
  //               realm.create(
  //                 "TaskWorkerSchema",
  //                 {
  //                   ...res,
  //                   _id: new BSON.ObjectId(res.id),
  //                   sortOrder: res.sortOrder || 0,
  //                 },
  //                 UpdateMode.Modified
  //               );
  //               dispatch(setActiveTaskWorker(null));
  //               dispatch(setWorkHistory(null));

  //               // _status.status && onWriteWorkHistory(_status.status, res);
  //             }
  //           });
  //         } catch (e) {
  //           isWriteConsole && console.log("onEndWorkTime error: ", e);
  //         }
  //       })
  //       .catch((e) => {
  //         isWriteConsole && console.log("onEndWorkTime Error", e);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //         // dispatch(clearTimeWork());
  //       });
  //   },
  //   [workHistoryFromStore]
  // );

  const onEndWorkTimeForBlocked = useCallback(async () => {
    const _status = allTaskStatus.find((x) => x.status === "autofinish");
    if (!_status || workHistoryFromStore === null) {
      return;
    }
    // console.log("onEndWorkTime:", activeTaskWorkerFromStore);

    setLoading(true);
    // dispatch(setTimeWorkEnd(new Date().getTime()));
    await onFetchWithAuth(
      `${hostAPI}/task_worker/${workHistoryFromStore.taskWorkerId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          // statusId: "6749ffe3d6b4324345382aed",
          statusId: _status._id.toString(),
          status: _status.status,
          workerId: userFromStore?.id,
        }),
      }
    )
      .then((res) => res.json())
      .then((res: ITaskWorker) => {
        try {
          isWriteConsole && console.log("onEndWorkTimeForBlocked res: ", res);

          realm.write(() => {
            if (res.id) {
              realm.create(
                "TaskWorkerSchema",
                {
                  ...res,
                  _id: new BSON.ObjectId(res.id),
                  sortOrder: res.sortOrder || 0,
                },
                UpdateMode.Modified
              );
              dispatch(setActiveTaskWorker(null));
              dispatch(setWorkHistory(null));
              onLogout();
              // _status.status && onWriteWorkHistory(_status.status, res);
            }
          });
        } catch (e) {
          isWriteConsole && console.log("onEndWorkTimeForBlocked error: ", e);
        }
      })
      .catch((e) => {
        isWriteConsole && console.log("onEndWorkTimeForBlocked Error", e);
      })
      .finally(() => {
        setLoading(false);
        // dispatch(clearTimeWork());
      });

    // const timeDate = dayjs(new Date()).utc();

    // await onFetchWithAuth(`${hostAPI}/work_time/${workHistoryFromStore.id}`, {
    //   method: "PATCH",
    //   body: JSON.stringify({
    //     // statusId: "6749ffe3d6b4324345382aed",
    //     to: timeDate.format(),
    //     status: 1,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((res: IWorkTime) => {
    //     try {
    //       isWriteConsole && console.log("onEndWorkTime res: ", res);

    //       realm.write(() => {
    //         if (res.id) {
    //           realm.create(
    //             "WorkTimeSchema",
    //             {
    //               ...res,
    //               _id: new BSON.ObjectId(res.id),
    //             },
    //             UpdateMode.Modified
    //           );
    //         }
    //         // dispatch(setActiveTaskWorker(null));
    //       });
    //     } catch (e) {
    //       isWriteConsole && console.log("onEndWorkTime error: ", e);
    //     }
    //   })
    //   .catch((e) => {
    //     isWriteConsole && console.log("onEndWorkTime Error", e);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //     dispatch(setWorkTime(null));
    //     ToastAndroid.show(t("info.successEndWorkTime"), ToastAndroid.LONG);
    //   });
  }, [workHistoryFromStore, allTaskStatus]);

  // const onStartWorkTime = async () => {
  //   if (!userFromStore) {
  //     return;
  //   }
  //   setLoading(true);

  //   const timeDate = dayjs(new Date()).utc();

  //   await onFetchWithAuth(`${hostAPI}/work_time`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       workerId: userFromStore.id,
  //       from: timeDate.format(),
  //       oklad: userFromStore.oklad,
  //       // status: _status.status,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res: IWorkTime) => {
  //       try {
  //         isWriteConsole && console.log("onStartWorkTime res: ", res);

  //         realm.write(() => {
  //           if (res.id) {
  //             realm.create(
  //               "WorkTimeSchema",
  //               {
  //                 ...res,
  //                 _id: new BSON.ObjectId(res.id),
  //               },
  //               UpdateMode.Modified
  //             );
  //           }
  //         });

  //         dispatch(setWorkTime(res));

  //         ToastAndroid.show(t("info.successStartWorkTime"), ToastAndroid.LONG);
  //       } catch (e) {
  //         isWriteConsole && console.log("onStartWorkTime error: ", e);
  //       }
  //     })
  //     .catch((e) => {
  //       isWriteConsole && console.log("onStartWorkTime Error", e);
  //     })
  //     .finally(() => {
  //       setLoading(false);

  //       // const orders = allOrders.filtered(
  //       //   "_id=$0",
  //       //   new BSON.ObjectId(activeTaskWorkerFromStore?.orderId)
  //       // );

  //       // if (orders.length) {
  //       //   Alert.alert(
  //       //     t("info.loadPrevTask"),
  //       //     t("info.loadPrevTaskDescription", { orderName: orders[0]?.name }),
  //       //     [
  //       //       // {
  //       //       //   text: "Ask me later",
  //       //       //   onPress: () => console.log("Ask me later pressed"),
  //       //       // },
  //       //       {
  //       //         text: t("button.no"),
  //       //         onPress: () => {
  //       //           dispatch(setActiveTaskWorker(null));
  //       //         },
  //       //         style: "cancel",
  //       //       },
  //       //       {
  //       //         text: t("button.yes"),
  //       //         onPress: () => {
  //       //           onStartPrevTask();
  //       //         },
  //       //       },
  //       //     ]
  //       //   );
  //       // }
  //       // dispatch(setTimeWorkStart(timeDate.millisecond()));
  //     });
  // };

  const onCompletedTask = useCallback(
    (task: TaskSchema, taskWorker: TaskWorkerSchema | null): void => {
      if (!taskWorker) {
        return;
      }

      const orders = allOrders.filtered(
        "_id=$0",
        new BSON.ObjectId(task.orderId)
      );

      if (!orders.length) {
        return;
      }

      Alert.alert(
        t("info.taskCompleted"),
        t("info.taskCompletedDescription", {
          orderName: `№${orders[0]?.number}: ${orders[0]?.name}`,
          taskName: task.name,
        }),
        [
          {
            text: t("button.no"),
            onPress: () => {},
            style: "cancel",
          },
          {
            text: t("button.yes"),
            onPress: async () => {
              // await toggleTaskWorker("finish");

              const _status = allTaskStatus.find((x) => x.status === "finish");
              if (!_status) {
                return;
              }

              // if (getObjectId(taskWorker?._id.toString()) != "0") {
              await onFetchWithAuth(
                `${hostAPI}/task_worker/${taskWorker?._id.toString()}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    //productId: params.id,
                    statusId: _status._id.toString(),
                    status: _status.status,
                    workerId: userFromStore?.id,
                  }),
                }
              )
                .then((res) => res.json())
                .then((res: ITaskWorker) => {
                  realm.write(() => {
                    try {
                      realm.create(
                        "TaskWorkerSchema",
                        {
                          ...res,
                          _id: new BSON.ObjectId(res.id),
                          sortOrder: res.sortOrder || 0,
                        },
                        UpdateMode.Modified
                      );

                      dispatch(setActiveTaskWorker(null));
                    } catch (e) {
                      isWriteConsole &&
                        console.log("onCompletedTask error: ", e);
                    }
                  });
                  return res;
                })
                .catch((e) => {
                  isWriteConsole && console.log("onCompletedTask Error", e);
                })
                .finally(() => {
                  setLoading(false);
                });

              // начинаем хоз работы как заглушку, пока не выберется новое задание
              const _statusProcess = allTaskStatus.find(
                (x) => x.status === "process"
              );
              if (!_statusProcess) {
                return;
              }

              // await onFetchWithAuth(
              //   `${hostAPI}/task_worker/${defaultTaskWorker?._id.toString()}`,
              //   {
              //     method: "PATCH",
              //     body: JSON.stringify({
              //       //productId: params.id,
              //       statusId: _statusProcess._id.toString(),
              //       status: _statusProcess.status,
              //       workerId: userFromStore?.id,
              //     }),
              //   }
              // )
              //   .then((res) => res.json())
              //   .then(async (res: ITaskWorker) => {
              //     await realm.write(() => {
              //       try {
              //         realm.create(
              //           "TaskWorkerSchema",
              //           {
              //             ...res,
              //             _id: new BSON.ObjectId(res.id),
              //             sortOrder: res.sortOrder || 0,
              //           },
              //           UpdateMode.Modified
              //         );

              //         dispatch(setActiveTaskWorker(Object.assign({}, res)));
              //       } catch (e) {
              //         isWriteConsole &&
              //           console.log("onCompletedTask2 error: ", e);
              //       }
              //     });
              //   })
              //   .catch((e) => {
              //     isWriteConsole && console.log("onCompletedTask2 Error", e);
              //   })
              //   .finally(() => {
              //     setLoading(false);
              //   });

              // предлагаем оставить сообщения для выполненного заказа.
              // Alert.alert(
              //   t("info.completedMessage"),
              //   t("info.completedMessageText"),
              //   [
              //     {
              //       text: t("button.no"),
              //       onPress: () => {},
              //       style: "cancel",
              //     },
              //     {
              //       text: t("button.yes"),
              //       onPress: async () => {
              //         router.push({
              //           pathname: "/[orderId]/message",
              //           params: {
              //             orderId: orders[0]._id.toString(),
              //           },
              //         });
              //       },
              //     },
              //   ]
              // );
            },
          },
        ]
      );
    },
    []
  );

  return {
    loading,
    // onStartPrevTask,
    // onStartWorkTime,
    onCompletedTask,
    onEndWorkTime,
    onEndWorkTimeForBlocked,
  };
};
