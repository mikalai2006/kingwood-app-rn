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
import { ITaskWorker } from "@/types";
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
import dayjs from "@/utils/dayjs";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import { useTaskWorkerUtils } from "@/hooks/useTaskWorkerUtils";

export type TaskWorkerItemProps = {
  // taskWorker: TaskWorkerSchema;
  taskWorkerId: string;
};

export function TaskWorkerItem({ taskWorkerId }: TaskWorkerItemProps) {
  const { colorScheme } = useColorScheme();

  const userFromStore = useAppSelector(user);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const { t } = useTranslation();

  const { onFetchWithAuth } = useFetchWithAuth();

  const realm = useRealm();

  const dispatch = useAppDispatch();

  const workTimeFromStore = useAppSelector(workTime);

  const workHistoryFromStore = useAppSelector(workHistory);

  const activeTaskFromStore = useAppSelector(activeTaskWorker);

  const taskWorker = useObject(
    TaskWorkerSchema,
    new BSON.ObjectId(taskWorkerId)
  );

  taskWorker?.taskId && useTask({ id: [taskWorker.taskId] });

  const allTaskStatus = useQuery(TaskStatusSchema);
  const allOrders = useQuery(OrderSchema);
  const allObjects = useQuery(ObjectsSchema);

  const task = useObject(TaskSchema, new BSON.ObjectId(taskWorker?.taskId));

  const taskStatus = useObject(
    TaskStatusSchema,
    new BSON.ObjectId(taskWorker?.statusId)
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
    setLoading(true);

    const _status = allTaskStatus.find((x) => x.status === statusName);
    if (!_status) {
      return;
    }

    const _statusPause = allTaskStatus.find((x) => x.status === "pause");
    if (!_statusPause) {
      return;
    }

    // pause prev task.
    if (
      activeTaskFromStore != null &&
      activeTaskFromStore.id != taskWorker?._id.toString()
    ) {
      await onFetchWithAuth(
        `${hostAPI}/task_worker/${activeTaskFromStore.id}`,
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
    }

    return await onFetchWithAuth(
      `${hostAPI}/task_worker/${taskWorker?._id.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          //productId: params.id,
          statusId: _status._id.toString(),
          status: statusName,
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
              ToastAndroid.show(
                t("info.successProcessTask", {
                  orderName: `№${res.order.number}-${res.order.name}`,
                }),
                ToastAndroid.SHORT
              );
            } else if (statusName === "pause") {
              ToastAndroid.show(
                t("info.successPauseTask", {
                  orderName: `№${res.order.number}-${res.order.name}`,
                }),
                ToastAndroid.SHORT
              );
            }

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
      t("info.taskPauseDescription", {
        orderName: `№${orders[0]?.number}: ${orders[0]?.name} (${objects[0].name})`,
      }),
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
          onPress: () => {
            toggleTaskWorker("pause");
          },
        },
      ]
    );
  }

  const { onStartWorkTime } = useTaskWorkerUtils();

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
      activeTaskFromStore != null && workTimeFromStore != null
        ? t("info.taskProcessRunOtherDescription", {
            orderName: `№${orders[0]?.number}: ${orders[0]?.name} (${objects[0].name})`,
            prevOrderName: `№${activeTaskFromStore.order?.number}: ${activeTaskFromStore.order?.name} (${activeTaskFromStore.object?.name})`,
          })
        : t("info.taskProcessDescription", {
            orderName: `№${orders[0]?.number}: ${orders[0]?.name} (${objects[0].name})`,
          }),
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
            if (workTimeFromStore == null) {
              await onStartWorkTime();
            }

            await toggleTaskWorker("process");
          },
        },
      ]
    );
  }

  function onCompletedTask(task: TaskSchema): void {
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
          onPress: () => {
            toggleTaskWorker("finish");
          },
        },
      ]
    );
  }

  return task && taskWorker ? (
    <View className="w-full p-2 px-4">
      <View
        className="rounded-lg shadow-lg bg-white dark:bg-s-800"
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
        <View className="p-2 pt-0 rounded-b-lg">
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
                className="text-base leading-6 text-s-700 dark:text-s-300"
                numberOfLines={2}
                lineBreakMode="tail"
              >
                {t("yourTask")}: {task.name}
              </Text>
              <Text className="text-s-400 dark:text-s-400 leading-5 mb-1">
                {taskStatus?.name}{" "}
              </Text>
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
                      onPress={() => onPauseTask(task)}
                    ></UIButton>
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
                        taskStatus?.status == "autofinish"
                      }
                      onPress={() => onProcessTask(task)}
                    ></UIButton>
                  )}
                </View>
                <UIButton
                  type="secondary"
                  text={t("button.finishTask")}
                  disabled={
                    activeTaskFromStore?.id !== taskWorker._id.toString()
                  }
                  onPress={() => onCompletedTask(task)}
                ></UIButton>
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
    </View>
  ) : // <TaskNotFound />
  null;
}
