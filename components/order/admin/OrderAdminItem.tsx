import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { OrderSchema, TaskSchema } from "@/schema";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import dayjs from "@/utils/dayjs";
import { TaskOrder } from "@/components/task/TaskOrder";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { OrderAdminItemBadge } from "./OrderAdminItemBadge";
import { OrderAdminItemStep } from "./OrderAdminItemStep";

export type OrderAdminItemProps = {
  orderId: string;
};

export function OrderAdminItem({ orderId }: OrderAdminItemProps) {
  const { colorScheme } = useColorScheme();

  const userFromStore = useAppSelector(user);

  const { t } = useTranslation();

  const order = useObject(OrderSchema, new BSON.ObjectId(orderId));

  const tasks = useQuery(TaskSchema, (items) =>
    items
      .filtered("orderId = $0", order?._id.toString())
      .sorted("sortOrder", false)
  );

  return order ? (
    <View className="p-2 px-4">
      <View
        className="rounded-lg shadow-lg bg-white dark:bg-s-800"
        // style={{ backgroundColor: taskStatus?.color }}
      >
        <View className="rounded-t-lg p-2 pb-0">
          <View className="px-1">
            <TaskOrder orderId={order._id.toString()} />
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
          <View className="flex items-start px-2">
            {/* {taskStatus?.icon && (
              <TaskIcon
                key={taskStatus._id.toString()}
                statusId={taskStatus._id.toString()}
                className="p-2"
              />
            )} */}
            {/* <View className="p-2">
              <Text
                className="text-xl leading-6 text-g-950 dark:text-s-100"
                numberOfLines={2}
                lineBreakMode="tail"
              >
                {task.name}
              </Text>
              <Text className="text-s-500 leading-5 mb-1">
                {taskStatus?.name}{" "}
              </Text>
            </View> */}
            {/* <FlatList horizontal >
              <View className="flex-1 flex-row gap-2">
                {tasks.map((item) => (
                  <View
                    key={item._id.toString()}
                    className="w-32 h-12 bg-gr-600 rounded-md p-2"
                  >
                    <Text>{item.name}</Text>
                  </View>
                ))}
              </View>
            </Flat> */}
            {/* <FlatList
              data={tasks}
              horizontal
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <OrderAdminItemBadge
                  orderId={item.orderId.toString()}
                  taskId={item._id.toString()}
                />
              )}
            /> */}
            {tasks.map((task, index) => (
              <OrderAdminItemStep
                key={task._id.toString()}
                indexTask={index}
                countTask={tasks.length}
                orderId={task.orderId}
                taskId={task._id.toString()}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  ) : (
    <View>
      <Text>Not found info order</Text>
    </View>
  );
}
