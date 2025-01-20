import { View, Text } from "react-native";
import React, { useMemo } from "react";
import { useObject, useQuery } from "@realm/react";
import RImage from "../r/RImage";
import { BSON } from "realm";
import { OrderSchema } from "@/schema";

export type OrderShortInfoProps = {
  id: string | undefined;
};

const OrderShortInfo = ({ id }: OrderShortInfoProps) => {
  const order = useObject(OrderSchema, new BSON.ObjectId(id));

  return (
    <View className="flex flex-row items-center gap-4">
      <View className="h-12 w-12">
        <RImage
          className="w-full h-full rounded-full object-contain"
          image={order?.images[0]}
        />
      </View>
      <View className="flex-auto">
        <Text
          className="text-base text-s-900 dark:text-s-200 leading-5"
          numberOfLines={2}
          lineBreakMode="tail"
        >
          {order?.description}
        </Text>

        {/* <ProductCost product={product} /> */}
      </View>
    </View>
  );
};

export default OrderShortInfo;
