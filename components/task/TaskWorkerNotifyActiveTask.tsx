import { Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { activeTaskWorker, setLinkParams } from "@/store/storeSlice";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import {
  OperationSchema,
  OrderSchema,
  TaskSchema,
  TaskStatusSchema,
} from "@/schema";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useMemo } from "react";
import useOrders from "@/hooks/useOrders";
import { TouchableOpacity } from "react-native-gesture-handler";

export type TaskWorkerNotifyActiveTaskProps = {};

export function TaskWorkerNotifyActiveTask({}: TaskWorkerNotifyActiveTaskProps) {
  const dispatch = useAppDispatch();

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);
  // if (!activeTaskWorkerFromStore) {
  //   return null;
  // }

  // const allTaskStatus = useQuery(TaskStatusSchema);
  // const allTask = useQuery(TaskSchema);

  const activeTaskStatus = useObject(
    TaskStatusSchema,
    new BSON.ObjectId(activeTaskWorkerFromStore?.statusId)
  );
  // useMemo(
  //   () =>
  //     activeTaskWorkerFromStore
  //       ? allTaskStatus.find(
  //           (x) => x._id.toString() === activeTaskWorkerFromStore.statusId
  //         )
  //       : null,
  //   [activeTaskWorkerFromStore]
  // );

  const activeTask = useObject(
    TaskSchema,
    new BSON.ObjectId(activeTaskWorkerFromStore?.taskId)
  );
  // useMemo(
  //   () =>
  //     activeTaskWorkerFromStore
  //       ? allTask.find(
  //           (x) => x._id.toString() === activeTaskWorkerFromStore?.taskId
  //         )
  //       : null,
  //   [activeTaskWorkerFromStore]
  // );
  // const activeOrder = useObject(
  //   OrderSchema,
  //   new BSON.ObjectId(activeTask?.orderId)
  // );
  // const activeObject = useObject(
  //   ObjectsSchema,
  //   new BSON.ObjectId(activeOrder?.objectId)
  // );

  // if (activeTask) {
  //   useOrders({
  //     id: [activeTask.orderId],
  //   });
  // }

  const order = useObject(
    OrderSchema,
    new BSON.ObjectId(activeTaskWorkerFromStore?.orderId)
  );

  const operation = useObject(
    OperationSchema,
    new BSON.ObjectId(activeTaskWorkerFromStore?.operationId)
  );

  const object = useObject(
    ObjectsSchema,
    new BSON.ObjectId(activeTaskWorkerFromStore?.objectId)
  );

  return activeTaskWorkerFromStore ? (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(tabs)/order",
        });
        dispatch(
          setLinkParams({ objectId: activeTaskWorkerFromStore.objectId })
        );
      }}
    >
      <View className="bg-s-300 dark:bg-s-800 rounded-lg p-2 px-4 flex flex-row items-center gap-4">
        <View className="flex-auto">
          <Text className="text-s-900 dark:text-white leading-5 text-lg font-bold">
            {activeTaskStatus?.name} {activeTask?.name.toLowerCase()}
          </Text>
          <Text className="text-s-900 dark:text-white leading-5 text-base">
            {/* {activeTask?.number} - {activeOrder?.name} ({activeObject?.name}) */}
            {order?.number ? "№" + order.number + " - " : ""}
            {order?.name} ({object?.name})
          </Text>
        </View>
        <View className="">
          <SIcon path="iChevronRight" size={25} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  ) : null;
}
