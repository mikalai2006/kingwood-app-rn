import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import {
  OrderSchema,
  TaskSchema,
  TaskStatusSchema,
  TaskWorkerSchema,
  UserSchema,
} from "@/schema";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import TaskIcon from "@/components/task/TaskIcon";

export type OrderAdminItemStepProps = {
  orderId: string;
  taskId: string;
  indexTask: number;
  countTask: number;
};

export function OrderAdminItemStep({
  orderId,
  taskId,
  countTask,
  indexTask,
}: OrderAdminItemStepProps) {
  const { colorScheme } = useColorScheme();

  const userFromStore = useAppSelector(user);

  const { t } = useTranslation();

  const order = useObject(OrderSchema, new BSON.ObjectId(orderId));

  const task = useObject(TaskSchema, new BSON.ObjectId(taskId));

  const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
    items.filtered("orderId = $0 AND taskId = $1", orderId, taskId)
  );
  const taskStatus = useObject(
    TaskStatusSchema,
    new BSON.ObjectId(task?.statusId)
  );

  const allUsers = useQuery(UserSchema);

  const workers = useMemo(
    () =>
      taskWorkers.map((x) => {
        const _user = allUsers.find((u) => u._id.toString() === x.workerId);
        return {
          ...x,
          user: _user,
        };
      }),
    [allUsers, taskWorkers]
  );

  return task ? (
    <View className="flex flex-row items-center gap-2">
      <View className="relative">
        {/* <View>
          {workers.map((worker) => (
            <Text key={worker._id.toString()} className="leading-5">
              {getShortFIO(worker.user?.name)}
            </Text>
          ))}
        </View> */}
        {/* <View
          className={
            (task.status === "finish" ? "border-gr-500" : "border-s-200") +
            " rounded-full border-2 w-4 h-4 z-10"
          }
        ></View> */}
        <TaskIcon statusId={task.statusId} size={15} className="p-0.5" />
        {indexTask < countTask - 1 ? (
          <View className="w-[2px] h-2 bg-s-300 absolute -bottom-2 left-[8px] z-0"></View>
        ) : null}
      </View>
      <View>
        <Text
          // className={
          //   (task.status === "finish"
          //     ? "text-gr-800 dark:text-gr-400"
          //     : task.status === "wait"
          //     ? "text-g-300 dark:text-s-500"
          //     : task.status === "pause"
          //     ? "text-g-300 dark:text-s-500"
          //     : "") + " leading-6"
          // }
          className="leading-6"
          style={{ color: taskStatus?.color }}
        >
          {task.name}
        </Text>
      </View>
    </View>
  ) : (
    <View>
      <Text>Not found info task</Text>
    </View>
  );
}
