import { Alert, Text, ToastAndroid, View } from "react-native";
import UIButton from "@/components/ui/UIButton";
import { useColorScheme } from "nativewind";
import {
  OrderSchema,
  TaskSchema,
  TaskStatusSchema,
  TaskWorkerSchema,
} from "@/schema";
import useTask from "@/hooks/useTask";
import { TaskOrder } from "./TaskOrder";
import { useMemo, useState } from "react";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { useObject, useQuery, useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { ITaskWorker, IWorkHistory } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeTaskWorker,
  setActiveTaskWorker,
  workTime,
  user,
  workHistory,
} from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import TaskIcon from "./TaskIcon";
import dayjs, { formatDate } from "@/utils/dayjs";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import { useTaskWorkerUtils } from "@/hooks/useTaskWorkerUtils";
import { getObjectId } from "@/utils/utils";
import { useWork } from "@/hooks/useWork";
import { router } from "expo-router";
import { Colors } from "@/utils/Colors";

export type TaskWorkerItemProps = {
  // taskWorker: TaskWorkerSchema;
  taskWorkerId: string;
};

export function TaskWorkerItem({ taskWorkerId }: TaskWorkerItemProps) {
  const { colorScheme } = useColorScheme();

  const userFromStore = useAppSelector(user);

  const taskWorkerFromStore = useAppSelector(activeTaskWorker);

  const { t } = useTranslation();

  const { onFetchWithAuth } = useFetchWithAuth();

  const realm = useRealm();

  const dispatch = useAppDispatch();

  // const workTimeFromStore = useAppSelector(workTime);

  const workHistoryFromStore = useAppSelector(workHistory);

  // const activeTaskFromStore = useAppSelector(activeTaskWorker);

  const taskWorker = useObject(
    TaskWorkerSchema,
    new BSON.ObjectId(taskWorkerId)
  );

  const activeOrder = useObject(
    OrderSchema,
    new BSON.ObjectId(
      workHistoryFromStore?.orderId
      // taskWorkerFromStore?.id == taskWorkerId
      //   ? workHistoryFromStore?.orderId
      //   : taskWorker?.orderId
    )
  );
  const activeTask = useObject(
    TaskSchema,
    new BSON.ObjectId(workHistoryFromStore?.taskId)
  );

  const activeObject = useObject(
    ObjectsSchema,
    new BSON.ObjectId(
      workHistoryFromStore?.objectId
      // taskWorkerFromStore?.id == taskWorkerId
      //   ? workHistoryFromStore?.objectId
      //   : taskWorker?.objectId
    )
  );
  if (taskWorker?.taskId && getObjectId(taskWorker?.taskId) != "0") {
    useTask({ id: [taskWorker.taskId] });
  }

  const allTaskStatus = useQuery(TaskStatusSchema);
  const allOrders = useQuery(OrderSchema);
  const allObjects = useQuery(ObjectsSchema);
  const defaultTask = useObject(
    TaskSchema,
    new BSON.ObjectId("000000000000000000000000")
  );

  const task = useObject(TaskSchema, new BSON.ObjectId(taskWorker?.taskId));

  const statusWait = useQuery(TaskStatusSchema, (items) =>
    items.filtered('status == "wait"')
  );
  const statusProcess = useQuery(TaskStatusSchema, (items) =>
    items.filtered('status == "process"')
  );
  const taskStatus = useObject(
    TaskStatusSchema,

    getObjectId(taskWorkerId) == "0"
      ? workHistoryFromStore?.taskWorkerId == taskWorkerId
        ? statusProcess[0]?._id
        : statusWait[0]?._id
      : new BSON.ObjectId(taskWorker?.statusId)
  );

  const [loading, setLoading] = useState(false);

  // const { onWriteWorkHistory } = useWork();

  // const onWriteWorkHistory = async (
  //   statusName: string,
  //   taskWorker: ITaskWorker
  // ) => {
  //   if (["process"].includes(statusName)) {
  //     await onFetchWithAuth(`${hostAPI}/work_history`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         status: 0,
  //         from: dayjs().utc().format(),
  //         objectId: taskWorker?.objectId,
  //         orderId: taskWorker?.orderId,
  //         taskId: taskWorker?.taskId,
  //         workerId: taskWorker?.workerId,
  //         operationId: taskWorker?.task.operationId,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((res: IWorkHistory) => {
  //         realm.write(() => {
  //           try {
  //             realm.create(
  //               "WorkHistorySchema",
  //               {
  //                 ...res,
  //                 _id: new BSON.ObjectId(res.id),
  //               },
  //               UpdateMode.Modified
  //             );
  //           } catch (e) {
  //             console.log("onWriteWorkHistory error: ", e);
  //           }
  //         });

  //         dispatch(setWorkHistory(res));
  //       })
  //       .catch((e) => {
  //         console.log("onWriteWorkHistory Error", e);
  //       });
  //   } else {
  //     await onFetchWithAuth(
  //       `${hostAPI}/work_history/${workHistoryFromStore?.id}`,
  //       {
  //         method: "PATCH",
  //         body: JSON.stringify({
  //           status: 1,
  //           to: dayjs().utc().format(),
  //         }),
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res: IWorkHistory) => {
  //         realm.write(() => {
  //           try {
  //             realm.create(
  //               "WorkHistorySchema",
  //               {
  //                 ...res,
  //                 _id: new BSON.ObjectId(res.id),
  //               },
  //               UpdateMode.Modified
  //             );

  //             dispatch(setWorkHistory(null));
  //           } catch (e) {
  //             console.log("onWriteWorkHistory error: ", e);
  //           }
  //         });
  //       })
  //       .catch((e) => {
  //         console.log("onWriteWorkHistory Error", e);
  //       });
  //   }
  // };

  const toggleTaskWorker = async (statusName: string) => {
    const _status = allTaskStatus.find((x) => x.status === statusName);
    if (!_status) {
      isWriteConsole &&
        console.log("Not found TaskStatus!", allTaskStatus.length, statusName);

      return;
    }

    const _statusPause = allTaskStatus.find((x) => x.status === "pause");
    if (!_statusPause) {
      return;
    }

    setLoading(true);

    // pause prev task.
    if (
      workHistoryFromStore != null &&
      workHistoryFromStore.id &&
      workHistoryFromStore.id != taskWorker?._id.toString()
    ) {
      // if (getObjectId(workHistoryFromStore.id) != "0") {
      await onFetchWithAuth(
        `${hostAPI}/task_worker/${workHistoryFromStore.taskWorkerId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            statusId: _statusPause._id.toString(),
            status: _statusPause?.status,
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

              // if (res.status === "process") {
              //   dispatch(setActiveTaskWorker(Object.assign({}, res)));
              // } else {
              //   dispatch(setActiveTaskWorker(null));
              // }

              // _statusPause.status &&
              //   onWriteWorkHistory(_statusPause.status, res);
              // ToastAndroid.show(
              //   t("info.successPauseTask", {
              //     orderName: `№${res.order.number}-${res.order.name}`,
              //   }),
              //   ToastAndroid.SHORT
              // );
            } catch (e) {
              isWriteConsole && console.log("toggleTask prev error: ", e);
            }
          });
        })
        .catch((e) => {
          isWriteConsole && console.log("toggleTaskWorker prev Error", e);
        });
      // } else {
      //   // fake taskWorker.
      //   taskWorker && (await onWriteWorkHistory("wait", taskWorker));
      // }
    }

    // if (getObjectId(taskWorker?._id.toString()) != "0") {
    await onFetchWithAuth(
      `${hostAPI}/task_worker/${taskWorker?._id.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          //productId: params.id,
          statusId: _status._id.toString(),
          status: statusName,
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

            if (res?.status === "process") {
              dispatch(setActiveTaskWorker(Object.assign({}, res)));
            } else {
              dispatch(setActiveTaskWorker(null));
            }

            if (statusName === "process") {
              if (res.order.number) {
                ToastAndroid.show(
                  t("info.successProcessTask", {
                    orderName: `№${res.order.number}-${res.order.name}`,
                  }),
                  ToastAndroid.SHORT
                );
              } else {
                ToastAndroid.show(
                  t("fake.successProcessFake"),
                  ToastAndroid.SHORT
                );
              }
            } else if (statusName === "pause") {
              if (res.order.number) {
                ToastAndroid.show(
                  t("info.successPauseTask", {
                    orderName: `№${res.order.number}-${res.order.name}`,
                  }),
                  ToastAndroid.SHORT
                );
              } else {
                ToastAndroid.show(
                  t("fake.successPauseFake"),
                  ToastAndroid.SHORT
                );
              }
            }
            // else if (statusName === "finish") {
            //   // если задание отмечается как выполненное, запускаем хоз работы
            //   if (defaultTask) {
            //     onProcessTask(defaultTask);
            //   }
            // }

            // onWriteWorkHistory(statusName, res);
            // if (res.statusId === "6749ffa6d6b4324345382aec") {
            // } else {
            //   dispatch(setActiveTaskWorker(null));
            // }
          } catch (e) {
            isWriteConsole && console.log("toggleTask error: ", e);
          }
        });
      })
      .catch((e) => {
        isWriteConsole && console.log("toggleTaskWorker Error", e);
      })
      .finally(() => {
        setLoading(false);
      });
    // } else {
    //   // fake taskWorker.
    //   // TODO

    //   setLoading(false);
    // }
  };

  const order = useMemo(() => {
    const orders = allOrders.filtered(
      "_id=$0",
      new BSON.ObjectId(taskWorker?.orderId)
    );

    return orders[0];
  }, []);

  function onPauseTask(task: TaskSchema): void {
    const orders = allOrders.filtered(
      "_id=$0",
      new BSON.ObjectId(task.orderId)
    );
    const objects = allObjects.filtered(
      "_id=$0",
      new BSON.ObjectId(task.objectId)
    );

    if (!orders.length) {
      return;
    }

    Alert.alert(
      t("info.taskPause"),
      getObjectId(orders[0]?._id.toString()) != "0"
        ? t("info.taskPauseDescription", {
            orderName: `${task.name} №${orders[0]?.number}: ${orders[0]?.name} (${objects[0].name})`,
          })
        : t("fake.taskPauseDescription"),
      [
        // {
        //   text: "Ask me later",
        //   onPress: () => console.log("Ask me later pressed"),
        // },
        {
          text: t("button.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("button.yes"),
          onPress: async () => {
            await toggleTaskWorker("pause");
            // if (getObjectId(task._id.toString()) != "0") {
            // } else {
            //   taskWorker && (await onWriteWorkHistory("wait", taskWorker));
            // }
          },
        },
      ]
    );
  }

  const { onCompletedTask } = useTaskWorkerUtils();

  async function onProcessTask(task: TaskSchema): Promise<void> {
    const orders = allOrders.filtered(
      "_id=$0",
      new BSON.ObjectId(task.orderId)
    );
    const objects = allObjects.filtered(
      "_id=$0",
      new BSON.ObjectId(task.objectId)
    );

    if (!orders.length) {
      return;
    }

    Alert.alert(
      t("info.taskProcess"),
      workHistoryFromStore != null
        ? t("info.taskProcessRunOtherDescription", {
            orderName:
              getObjectId(orders[0]?._id.toString()) == "0"
                ? t("fake.nameOrder")
                : `${task?.name} №${orders[0]?.number}: ${orders[0]?.name} (${objects[0].name})`,
            prevOrderName:
              getObjectId(activeOrder?._id.toString()) == "0"
                ? t("fake.nameOrder")
                : `${activeTask?.name} №${activeOrder?.number}: ${activeOrder?.name} (${activeObject?.name})`,
          })
        : getObjectId(orders[0]._id.toString()) != "0"
        ? t("info.taskProcessDescription", {
            orderName: `${task?.name} №${orders[0]?.number}: ${orders[0]?.name} (${objects[0].name})`,
          })
        : t("fake.taskProcessDescription"),
      [
        // {
        //   text: "Ask me later",
        //   onPress: () => console.log("Ask me later pressed"),
        // },
        {
          text: t("button.no"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("button.yes"),
          onPress: async () => {
            // if (workTimeFromStore == null) {
            //   await onStartWorkTime();
            // }
            await toggleTaskWorker("process");
            // if (getObjectId(task._id.toString()) != "0") {
            // } else {
            //   taskWorker && (await onWriteWorkHistory("process", taskWorker));
            // }
          },
        },
      ]
    );
  }

  const isBlocked = useMemo(
    () => userFromStore?.blocked == 1 || userFromStore?.archive == 1,
    [userFromStore]
  );

  return task && taskWorker ? (
    <View className="w-full p-2 px-4">
      {/* <Text>{JSON.stringify(isBlocked)}</Text> */}
      <View
        className={
          (taskStatus?.status === "process"
            ? " bg-gr-100 dark:bg-gr-900 "
            : " bg-white dark:bg-s-800 ") +
          " rounded-lg shadow-lg " +
          (!dayjs(new Date()).isBetween(
            dayjs(taskWorker.from),
            dayjs(taskWorker.to),
            "day",
            "[]"
          ) && !["finish", "autofinish"].includes(taskWorker.status)
            ? " opacity-60 "
            : "")
        }
        // style={{ backgroundColor: taskStatus?.color }}
      >
        <View className="rounded-t-lg p-2 pb-0">
          {/* {order.priority && (
            <Text className="self-start p-1 rounded-sm text-base bg-red-300 dark:bg-red-400">
              Срочный заказ
            </Text>
          )} */}
          <View className="px-1">
            <TaskOrder orderId={task.orderId} />
          </View>
        </View>

        <View
          className={
            (!dayjs(new Date()).isBetween(
              dayjs(taskWorker.from),
              dayjs(taskWorker.to),
              "day",
              "[]"
            ) && !["finish", "autofinish"].includes(taskWorker.status)
              ? " opacity-35 dark:opacity-15 "
              : "") + " p-2 pt-0 rounded-b-lg"
          }
        >
          {/* <View style={{ aspectRatio: 1 }}>
          <RImage
            className="object-cover aspect-square"
            image={task?.images ? task?.images[0] : null}
            style={{ aspectRatio: 1, width: "100%" }}
          />
        </View> */}
          <View className="flex flex-row items-center px-2">
            {taskStatus?.icon && (
              <TaskIcon
                key={taskStatus._id.toString()}
                statusId={taskStatus._id.toString()}
                className="p-2"
              />
            )}
            <View className="p-2">
              {/* <Text className="text-s-500 leading-5 mb-1">Задача</Text> */}
              <Text
                className="text-base leading-6 text-s-700 dark:text-s-100"
                numberOfLines={2}
                lineBreakMode="tail"
              >
                <Text className="text-base text-s-400">{t("yourTask")}: </Text>
                <Text className="font-medium text-base">{task.name}</Text>
              </Text>
              <View className="flex flex-row gap-0">
                <Text className="text-base text-s-400">
                  {t("taskStatus")}:{" "}
                </Text>
                <Text
                  className={
                    (taskStatus?.status === "process"
                      ? "bg-gr-600 dark:bg-gr-600 text-white"
                      : "text-s-800 dark:text-s-100") +
                    " px-2 rounded-lg text-base font-medium"
                  }
                >
                  {taskStatus?.name}
                </Text>
              </View>
            </View>
          </View>
          {taskStatus?.status &&
            !["finish", "autofinish"].includes(taskStatus?.status) && (
              <View className="flex flex-row p-2 gap-1">
                <View className="flex-auto flex items-start">
                  {/* <Text>{JSON.stringify(activeTaskFromStore)}</Text> */}
                  {taskStatus?.status === "process" ? (
                    <UIButton
                      type="primary"
                      text={t("button.pauseTask")}
                      loading={loading}
                      disabled={loading}
                      onPress={() => onPauseTask(task)}
                    />
                  ) : (
                    <UIButton
                      type="secondary"
                      text={t("button.goTask")}
                      loading={loading}
                      disabled={
                        // workTimeFromStore === null ||
                        !dayjs(new Date()).isBetween(
                          dayjs(taskWorker.from),
                          dayjs(taskWorker.to),
                          "day",
                          "[]"
                        ) ||
                        order?.status < 1 || //!order?.stolyarComplete //activeTaskFromStore !== null ||
                        taskStatus?.status == "autofinish" ||
                        isBlocked
                      }
                      onPress={() => onProcessTask(task)}
                    />
                  )}
                </View>
                {getObjectId(taskWorker?._id.toString()) != "0" && (
                  <UIButton
                    type="secondary"
                    text={t("button.finishTask")}
                    disabled={
                      // taskWorkerFromStore?.id !== taskWorker._id.toString() ||
                      !dayjs(new Date()).isBetween(
                        dayjs(taskWorker.from),
                        dayjs(taskWorker.to),
                        "day",
                        "[]"
                      ) ||
                      loading ||
                      isBlocked
                    }
                    // className="bg-lime-600 dark:bg-lime-700 rounded-lg flex items-center justify-center px-2"
                    onPress={() => onCompletedTask(task, taskWorker)}
                  >
                    {/* <View className="">
                      <Text className="text-white">
                        {t("button.finishTask")}
                      </Text>
                    </View> */}
                  </UIButton>
                )}
              </View>
            )}
          {/* {numColumns === 1 && (
          <View className="px-4 pb-4 flex flex-row gap-2">
            <View className="flex-auto flex flex-row flex-wrap items-start gap-2">
              <View className="bg-p-500 py-0.5 px-1.5 rounded-lg">
                <Text className="text-white">Отдам даром</Text>
              </View>
              <View className="bg-green-500 py-0.5 px-1.5 rounded-lg">
                <Text className="text-white">Обмен</Text>
              </View>
            </View>

            <View className="flex flex-row gap-4 items-end"></View>
          </View>
        )} */}
        </View>
      </View>

      {!dayjs(new Date()).isBetween(
        dayjs(taskWorker.from),
        dayjs(taskWorker.to),
        "day",
        "[]"
      ) && !["finish", "autofinish"].includes(taskWorker.status) ? (
        <View className="absolute top-0 right-0 left-0 bottom-6 flex items-center justify-end">
          <Text className="text-s-500 dark:text-s-500 font-bold">
            {t("info.taskFuture", {
              dateStart: dayjs(taskWorker.from).format(formatDate),
            })}
          </Text>
        </View>
      ) : null}
    </View>
  ) : //  : taskWorker ? (
  //   <View className="w-full p-2 px-4">
  //     <View className="rounded-lg shadow-lg bg-white dark:bg-s-800">
  //       <View className="flex-auto p-4">
  //         <View className="flex flex-row items-center mb-1">
  //           {/* <View className="flex flex-row">
  //           <Text className="text-lg  text-s-500 dark:text-s-300 pr-1">
  //             {t("order")} №{order.number},
  //           </Text>
  //         </View> */}
  //           <View className="flex flex-row items-center">
  //             <Text className="text-xl font-medium text-s-600 dark:text-s-300 pr-1">
  //               Цех
  //             </Text>
  //             {/* <Text className="text-xl leading-5 font-medium text-s-500 dark:text-s-300">
  //           {object?.name}
  //         </Text> */}
  //           </View>
  //         </View>

  //         {/* <Text className="text-s-500 leading-5 mb-2">Изделие</Text> */}
  //         <Text className="text-xl font-medium leading-5 text-s-700 dark:text-s-100">
  //           Хозяйственные работы
  //         </Text>
  //       </View>
  //       {/* <View className="rounded-t-lg p-2 pb-0">
  //         <View className="px-1">
  //           <Text className="self-start p-1 rounded-sm text-base bg-red-300 dark:bg-red-400">
  //             Хозяйственная работа
  //           </Text>
  //         </View>
  //       </View> */}
  //       <View className="p-2 pt-0 rounded-b-lg">
  //         {taskStatus?.status &&
  //           !["finish", "autofinish"].includes(taskStatus?.status) && (
  //             <View className="flex flex-row p-2 gap-1">
  //               <View className="flex-auto flex items-start">
  //                 {/* <Text>{JSON.stringify(activeTaskFromStore)}</Text> */}
  //                 {taskStatus?.status === "process" ? (
  //                   <UIButton
  //                     type="primary"
  //                     text={t("button.pauseTask")}
  //                     loading={loading}
  //                     onPress={() => onPauseTask(task)}
  //                   ></UIButton>
  //                 ) : (
  //                   <UIButton
  //                     type="secondary"
  //                     text={t("button.goTask")}
  //                     loading={loading}
  //                     disabled={
  //                       // workTimeFromStore === null ||
  //                       !dayjs(new Date()).isBetween(
  //                         dayjs(taskWorker.from),
  //                         dayjs(taskWorker.to),
  //                         "day",
  //                         "[]"
  //                       ) ||
  //                       order?.status < 1 || //!order?.stolyarComplete //activeTaskFromStore !== null ||
  //                       taskStatus?.status == "autofinish"
  //                     }
  //                     onPress={() => onProcessTask(task)}
  //                   ></UIButton>
  //                 )}
  //               </View>
  //               {/* <UIButton
  //                 type="secondary"
  //                 text={t("button.finishTask")}
  //                 disabled={
  //                   activeTaskFromStore?.id !== taskWorker._id.toString()
  //                 }
  //                 onPress={() => onCompletedTask(task)}
  //               ></UIButton> */}
  //             </View>
  //           )}
  //         {/* {numColumns === 1 && (
  //         <View className="px-4 pb-4 flex flex-row gap-2">
  //           <View className="flex-auto flex flex-row flex-wrap items-start gap-2">
  //             <View className="bg-p-500 py-0.5 px-1.5 rounded-lg">
  //               <Text className="text-white">Отдам даром</Text>
  //             </View>
  //             <View className="bg-green-500 py-0.5 px-1.5 rounded-lg">
  //               <Text className="text-white">Обмен</Text>
  //             </View>
  //           </View>

  //           <View className="flex flex-row gap-4 items-end"></View>
  //         </View>
  //       )} */}
  //       </View>
  //     </View>
  //   </View>
  // )
  null; // <TaskNotFound />
  null;
}
