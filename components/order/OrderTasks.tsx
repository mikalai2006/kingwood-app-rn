import { View, Text } from "react-native";
import React from "react";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { OrderSchema, TaskSchema } from "@/schema";
import useTask from "@/hooks/useTask";
import OrderTaskWorkers from "./OrderTaskWorkers";
import TaskIcon from "../task/TaskIcon";

export type OrderTasksProps = {
  orderId: string;
};

const OrderTasks = ({ orderId }: OrderTasksProps) => {
  const order = useObject(OrderSchema, new BSON.ObjectId(orderId));

  useTask({
    orderId: order ? [order._id.toString()] : undefined,
  });

  const tasks = useQuery(TaskSchema, (items) =>
    items.filtered("orderId==$0", orderId).sorted("sortOrder", false)
  );

  return (
    <View>
      {tasks?.map((task, index) => (
        <View
          key={task._id.toString()}
          className="flex flex-row items-center gap-4"
        >
          <View>
            {task?.statusId && (
              <TaskIcon statusId={task.statusId} className="p-2" />
            )}
            <View className="flex-auto flex items-center">
              {index < tasks?.length - 1 && (
                <View className="w-0.5 my-1 bg-s-300 dark:bg-s-600 flex-auto" />
              )}
            </View>
          </View>
          <View className="flex-auto min-h-32">
            <Text
              className="text-2xl text-s-900 dark:text-s-200 leading-6"
              lineBreakMode="tail"
            >
              {task.name}
            </Text>
            <OrderTaskWorkers taskId={task._id.toString()} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default OrderTasks;
