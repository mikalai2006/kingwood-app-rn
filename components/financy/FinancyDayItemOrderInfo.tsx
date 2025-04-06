import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { OperationSchema, OrderSchema, WorkHistorySchema } from "@/schema";
import { useTranslation } from "react-i18next";
import { useObject } from "@realm/react";
import { BSON } from "realm";
import { ObjectsSchema } from "@/schema/ObjectsSchema";

export type FinancyDayItemOrderInfoItemProps = {
  workHistory: WorkHistorySchema;
};

export function FinancyDayItemOrderInfo({
  workHistory,
}: FinancyDayItemOrderInfoItemProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const order = useObject(OrderSchema, new BSON.ObjectId(workHistory.orderId));

  const operation = useObject(
    OperationSchema,
    new BSON.ObjectId(workHistory.operationId)
  );

  const object = useObject(
    ObjectsSchema,
    new BSON.ObjectId(workHistory.objectId)
  );

  return (
    <View>
      <Text className="text-s-500 dark:text-s-300 text-lg leading-5">
        {operation?.name ? operation.name + ", " : ""}
        {order?.number ? "№" + order.number + " - " : ""}
        {order?.name} ({object?.name})
      </Text>
    </View>
  );
}
