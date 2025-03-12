import { OrderSchema, TaskStatusSchema } from "@/schema";
import { useQuery, useRealm } from "@realm/react";
import { useState } from "react";
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

export const useTaskWorkerUtils = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const realm = useRealm();

  const allOrders = useQuery(OrderSchema);

  const allTaskStatus = useQuery(TaskStatusSchema);

  const { onFetchWithAuth } = useFetchWithAuth();

  const [loading, setLoading] = useState(false);

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

  const onEndWorkTime = async () => {
    const _status = allTaskStatus.find((x) => x.status === "pause");
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
  };

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

  return {
    loading,
    // onStartPrevTask,
    // onStartWorkTime,
    onEndWorkTime,
  };
};
