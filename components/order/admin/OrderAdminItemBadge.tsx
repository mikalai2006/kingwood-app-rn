import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import {
  OrderSchema,
  TaskSchema,
  TaskWorkerSchema,
  UserSchema,
} from "@/schema";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import dayjs from "@/utils/dayjs";
import { useMemo } from "react";
import { getShortFIO } from "@/utils/utils";

export type OrderAdminItemBadgeProps = {
  orderId: string;
  taskId: string;
};

export function OrderAdminItemBadge({
  orderId,
  taskId,
}: OrderAdminItemBadgeProps) {
  const { colorScheme } = useColorScheme();

  const userFromStore = useAppSelector(user);

  const { t } = useTranslation();

  const order = useObject(OrderSchema, new BSON.ObjectId(orderId));

  const task = useObject(TaskSchema, new BSON.ObjectId(taskId));

  const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
    items.filtered("orderId = $0 AND taskId = $1", orderId, taskId)
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
    <View
      key={task._id.toString()}
      className={
        (task.status === "finish" ? "bg-gr-500" : "bg-s-200") +
        " min-w-32 min-h-12 rounded-md p-2 mr-2"
      }
    >
      <Text
        className={
          (task.status === "finish" ? "text-gr-800 dark:text-white" : "") +
          " leading-5"
        }
      >
        {task.name}
      </Text>
      <View>
        {workers.map((worker) => (
          <Text key={worker._id.toString()} className="leading-5">
            {getShortFIO(worker.user?.name)}
          </Text>
        ))}
      </View>
    </View>
  ) : (
    <View>
      <Text>Not found info task</Text>
    </View>
  );
}
