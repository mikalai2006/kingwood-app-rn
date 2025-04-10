import { View, Text } from "react-native";
import React from "react";
import { useObject, useQuery } from "@realm/react";
import { BSON } from "realm";
import { UserSchema } from "@/schema";
import { getShortFIO } from "@/utils/utils";

export type OrderTaskWorkerProps = {
  workerId: string;
};

const OrderTaskWorker = ({ workerId }: OrderTaskWorkerProps) => {
  const worker = useObject(UserSchema, new BSON.ObjectId(workerId));

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
      </View>
    </View>
  );
};

export default OrderTaskWorker;
