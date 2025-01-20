import { View, Text } from "react-native";
import React from "react";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { TaskSchema, TaskWorkerSchema } from "@/schema";
import OrderTaskWorker from "./OrderTaskWorker";
import TaskIcon from "../task/TaskIcon";

export type OrderTaskWorkersProps = {
  taskId: string;
};

const OrderTaskWorkers = ({ taskId }: OrderTaskWorkersProps) => {
  const task = useObject(TaskSchema, new BSON.ObjectId(taskId));

  const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
    items.filtered("taskId==$0", task?._id.toString())
  );

  return (
    <View>
      {taskWorkers?.map((taskWorker) => (
        <View
          key={taskWorker._id.toString()}
          className="flex flex-row items-center gap-1 mt-1"
        >
          <View>
            {taskWorker?.statusId && (
              <TaskIcon
                statusId={taskWorker.statusId}
                size={15}
                className="p-1"
              />
            )}
          </View>
          <View className="flex-auto">
            <OrderTaskWorker workerId={taskWorker.workerId} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default OrderTaskWorkers;
