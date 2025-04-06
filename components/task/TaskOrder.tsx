import { Text, View } from "react-native";
import { useObject } from "@realm/react";
import { useColorScheme } from "nativewind";
import { BSON } from "realm";
import { OrderSchema } from "@/schema";
import useOrders from "@/hooks/useOrders";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import { router } from "expo-router";
import { getObjectId } from "@/utils/utils";

export type TaskOrderProps = {
  orderId: string;
};

export function TaskOrder({ orderId }: TaskOrderProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  if (getObjectId(orderId) != "0") {
    useOrders({
      id: [orderId],
    });
  }

  const order = useObject(OrderSchema, new BSON.ObjectId(orderId));
  const object = useObject(ObjectsSchema, new BSON.ObjectId(order?.objectId));

  return order ? (
    <UIButton
      type="link"
      className="p-2 flex flex-row items-center"
      onPress={() => {
        if (getObjectId(order._id.toString()) != "0") {
          router.push({
            pathname: "/[orderId]",
            params: { orderId: order._id.toString() },
          });
        }
      }}
    >
      <View className="flex-auto">
        {/* <Text className="text-s-500 leading-5 mb-2">Изделие</Text> */}
        <Text className="text-xl font-medium leading-5 text-s-700 dark:text-s-100 pt-2">
          {order.number ? `№${order.number} - ` : ""}
          {order.name}
        </Text>
        <View className="flex flex-row items-center">
          {/* <View className="flex flex-row">
            <Text className="text-lg  text-s-500 dark:text-s-300 pr-1">
              {t("order")} №{order.number},
            </Text>
          </View> */}
          <View className="flex flex-row items-center">
            <Text className="text-xl font-medium text-s-500 dark:text-s-300 pr-1">
              {object?.name}
            </Text>
            {order.priority ? (
              <Text className="px-1 rounded-sm text-sm bg-red-300 dark:bg-red-300">
                {t("priorityOrder")}
              </Text>
            ) : null}
            {/* <Text className="text-xl leading-5 font-medium text-s-500 dark:text-s-300">
            {object?.name}
          </Text> */}
          </View>
        </View>
      </View>
      {getObjectId(order._id.toString()) != "0" && (
        <View>
          <SIcon
            path="iChevronRight"
            size={20}
            color={colorScheme === "dark" ? Colors.s[500] : Colors.s[300]}
          />
        </View>
      )}
    </UIButton>
  ) : (
    <Text>Not found order</Text>
  );
}
