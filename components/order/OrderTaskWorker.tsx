import { View, Text } from "react-native";
import React from "react";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { TaskStatusSchema, UserSchema } from "@/schema";
import { getShortFIO } from "@/utils/utils";

export type OrderTaskWorkerProps = {
  workerId: string;
  statusId: string | undefined;
};

const OrderTaskWorker = ({ workerId, statusId }: OrderTaskWorkerProps) => {
  const worker = useObject(UserSchema, new BSON.ObjectId(workerId));

  const taskStatus = useObject(TaskStatusSchema, new BSON.ObjectId(statusId));

  return (
    <View>
      <View className="flex flex-row items-center gap-4">
        <View className="flex-auto">
          <Text
            className="text-base text-s-900 dark:text-s-200 leading-5"
            lineBreakMode="tail"
          >
            {getShortFIO(worker?.name)}
          </Text>
        </View>
        <View>
          <Text
            className="px-1.5 rounded-md text-white dark:text-black"
            style={{ backgroundColor: taskStatus?.color }}
          >
            {taskStatus?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderTaskWorker;
