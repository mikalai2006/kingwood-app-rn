import { Text, View } from "react-native";
import RImage from "../r/RImage";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useObject, useQuery, useRealm } from "@realm/react";
import { UserSchema } from "@/schema/UserSchema";
import { useColorScheme } from "nativewind";
// import { BSON } from "realm";
import { TaskSchema, TaskStatusSchema } from "@/schema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeTaskWorker,
  setTimeWorkEnd,
  setTimeWorkStart,
  timeWorkStart,
  timeWorkEnd,
  clearTimeWork,
  setActiveTaskWorker,
} from "@/store/storeSlice";
import { TaskWorkerNotifyTimer } from "./TaskWorkerNotifyTimer";
import { useState } from "react";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { ITaskWorker } from "@/types";
import { BSON, UpdateMode } from "realm";

export type TaskWorkerNotifyShortProps = {};

export function TaskWorkerNotifyShort({}: TaskWorkerNotifyShortProps) {
  const { colorScheme } = useColorScheme();

  const dispatch = useAppDispatch();

  const { onFetchWithAuth } = useFetchWithAuth();

  const realm = useRealm();

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);
  const timeWorkStartFromStore = useAppSelector(timeWorkStart);
  const timeWorkEndFromStore = useAppSelector(timeWorkEnd);

  const allTaskStatus = useQuery(TaskStatusSchema);
  // const activeTaskStatus = useObject(
  //   TaskStatusSchema,
  //   new BSON.ObjectId(activeTaskWorkerFromStore?.statusId)
  // );
  // const user = useObject(UserSchema, new BSON.ObjectId(task.userId));

  const [loading, setLoading] = useState(false);

  const onEndWorkTime = async () => {
    setLoading(true);

    const _status = allTaskStatus.find((x) => x.status === "pause");
    if (!_status) {
      return;
    }

    dispatch(setTimeWorkEnd(new Date().getTime()));

    await onFetchWithAuth(
      `${hostAPI}/task_worker/${activeTaskWorkerFromStore?.id.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          // statusId: "6749ffe3d6b4324345382aed",
          statusId: _status._id.toString(),
          status: _status.status,
        }),
      }
    )
      .then((res) => res.json())
      .then((res: ITaskWorker) => {
        try {
          isWriteConsole && console.log("onEndWorkTime res: ", res);

          if (res.id) {
            realm.write(() => {
              realm.create(
                "TaskWorkerSchema",
                {
                  ...res,
                  _id: new BSON.ObjectId(res.id),
                  sortOrder: res.sortOrder || 0,
                },
                UpdateMode.Modified
              );
            });
          }

          dispatch(setActiveTaskWorker(null));
        } catch (e) {
          isWriteConsole && console.log("onEndWorkTime error: ", e);
        }
      })
      .catch((e) => {
        isWriteConsole && console.log("onEndWorkTime Error", e);
      })
      .finally(() => {
        setLoading(false);
        dispatch(clearTimeWork());
      });
  };

  return (
    <View className="flex">
      <View className="flex items-center justify-center gap-1 bg-p-300 dark:bg-p-500 p-1 rounded-lg">
        {timeWorkStartFromStore != 0 && (
          <View className="flex flex-row items-start justify-center gap-1">
            {/* <View className="rounded-full">
              <SIcon
                path={"iTimer"}
                size={20}
                color={colorScheme === "dark" ? Colors.white : Colors.s[700]}
              />
            </View> */}
            <View className="">
              {/* <Text className="text-s-500 text-base">Общее рабочее время:</Text> */}
              {timeWorkStartFromStore > 0 && (
                <TaskWorkerNotifyTimer
                  short
                  className="text-s-900 font-medium dark:text-white text-base"
                />
              )}
              {/* <Text className="text-white text-lg">
                {timeWorkStartFromStore}
              </Text>
              <Text className="text-white text-lg">{timeWorkEndFromStore}</Text> */}
            </View>
          </View>
        )}
        {/* <View>
          {timeWorkStartFromStore ? (
            <UIButton
              type="secondary"
              text="Завершить рабочее время"
              loading={loading}
              onPress={() => {
                onEndWorkTime();
              }}
            />
          ) : (
            <UIButton
              type="secondary"
              text="Начать рабочее время"
              onPress={() => {
                dispatch(setTimeWorkStart(new Date().getTime()));
              }}
            />
          )}

          <View className="flex-initial pt-2">
            {timeWorkStartFromStore > 0 && <TaskWorkerNotifyActiveTask />}
          </View>
        </View> */}
      </View>
    </View>
  );
}
