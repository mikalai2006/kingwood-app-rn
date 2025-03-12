import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { OrderSchema, TaskStatusSchema, TaskWorkerSchema } from "@/schema";
import { useObject } from "@realm/react";
import { BSON } from "realm";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { activeTaskWorker, user, workHistory } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { TaskWorkerNotify } from "./TaskWorkerNotify";
import { TaskWorkerNotifyTimer } from "./TaskWorkerNotifyTimer";
import TaskIcon from "./TaskIcon";
import { TaskWorkerNotifyActiveTaskNoModal } from "./TaskWorkerNotifyActiveTaskNoModal";
import { getObjectId } from "@/utils/utils";

export type TaskWorkItemStatusIconProps = {};

export function TaskWorkerItemStatusIcon({}: TaskWorkItemStatusIconProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const taskWorker = useObject(
    TaskWorkerSchema,
    new BSON.ObjectId(workHistoryFromStore?.taskWorkerId)
  );
  const activeOrder = useObject(
    OrderSchema,
    new BSON.ObjectId(workHistoryFromStore?.orderId)
  );

  const taskStatus = useObject(
    TaskStatusSchema,
    new BSON.ObjectId(activeTaskWorkerFromStore?.statusId)
  );

  return (
    <View>
      {taskStatus?._id ? (
        <View>
          {taskStatus?.icon && (
            <TaskIcon
              key={taskStatus._id.toString()}
              statusId={taskStatus._id.toString()}
              size={30}
            />
          )}
        </View>
      ) : (
        <View>
          <SIcon
            path={"iTimer"}
            size={30}
            color={colorScheme === "dark" ? Colors.white : Colors.white}
          />
        </View>
      )}
      <View className="relative">
        {activeTaskWorkerFromStore == null && workHistoryFromStore == null && (
          <View className="absolute bottom-5 -left-36 w-80 p-0 m-0 rounded-md">
            {/* <TaskWorkerNotifyActiveTaskNo /> */}
            <TaskWorkerNotifyActiveTaskNoModal />
          </View>
        )}
        {
          workHistoryFromStore !== null ? (
            <View className="absolute -bottom-8 -left-9 flex items-center w-[90px] rounded-lg bg-p-300 dark:bg-p-600 pt-1.5">
              <Text className="text-base text-s-900 dark:text-white whitespace-nowrap leading-4 text-center">
                {activeOrder
                  ? getObjectId(activeOrder._id.toString()) == "0"
                    ? t("fake.name")
                    : `${t("order")} №${activeOrder?.number.toString()}`
                  : t("title.work")}
              </Text>
              <TaskWorkerNotifyTimer
                short
                className="leading-4 font-medium text-s-900 dark:text-white text-base"
              />
            </View>
          ) : null
          // (
          //   <View className="absolute bottom-5 -left-36 w-80 p-0 rounded-md">
          //     <TaskWorkerNotify short />
          //   </View>
          // )
        }
      </View>
    </View>
  );
}
