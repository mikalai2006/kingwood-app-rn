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
    <View className="flex flex-col items-start justify-start">
      <View className="flex items-start justify-start ">
        {activeTaskWorkerFromStore == null && workHistoryFromStore == null && (
          <View className="p-0 rounded-md">
            {/* <TaskWorkerNotifyActiveTaskNo /> */}
            <TaskWorkerNotifyActiveTaskNoModal />
          </View>
        )}
        {
          workHistoryFromStore !== null ? (
            <View className="flex-1 flex-row items-stretch justify-start gap-2 p-0">
              <View className="flex-auto self-center rounded-lg pt-1.5 ">
                <View className="flex flex-row gap-2">
                  {/* {taskStatus?._id ? (
                    <View>
                      {taskStatus?.icon && (
                        <TaskIcon
                          key={taskStatus._id.toString()}
                          statusId={taskStatus._id.toString()}
                          size={20}
                        />
                      )}
                    </View>
                  ) : (
                    <View>
                      <SIcon
                        path={"iTimer"}
                        size={20}
                        color={
                          colorScheme === "dark" ? Colors.white : Colors.white
                        }
                      />
                    </View>
                  )} */}
                  <TaskWorkerNotifyTimer
                    short
                    className="leading-6 font-medium text-white text-xl"
                  />
                </View>
                <Text
                  numberOfLines={2}
                  className=" text-white whitespace-nowrap"
                  style={{ fontSize: 12 }}
                >
                  {activeOrder
                    ? getObjectId(activeOrder._id.toString()) == "0"
                      ? t("fake.name")
                      : `№${activeOrder?.number.toString()} ${activeOrder.name}`
                    : t("title.work")}
                </Text>
              </View>
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
