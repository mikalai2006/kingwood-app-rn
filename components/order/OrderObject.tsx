import { View, Text } from "react-native";
import React from "react";
import { useObject } from "@realm/react";
import { BSON } from "realm";
import { ObjectsSchema } from "@/schema/ObjectsSchema";

export type OrderObjectProps = {
  objectId: string;
};

const OrderObject = ({ objectId }: OrderObjectProps) => {
  // const order = useObject(OrderSchema, new BSON.ObjectId(id));
  const object = useObject(ObjectsSchema, new BSON.ObjectId(objectId));

  return (
    <View className="flex flex-row items-center gap-4">
      <View className="flex-auto">
        <Text
          className="text-xl font-medium text-s-900 dark:text-s-200 leading-5"
          numberOfLines={2}
          lineBreakMode="tail"
        >
          {object?.name}
        </Text>
      </View>
    </View>
  );
};

export default OrderObject;
