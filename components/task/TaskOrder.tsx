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

export type TaskOrderProps = {
  orderId: string;
};

export function TaskOrder({ orderId }: TaskOrderProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  useOrders({
    id: [orderId],
  });

  const order = useObject(OrderSchema, new BSON.ObjectId(orderId));
  const object = useObject(ObjectsSchema, new BSON.ObjectId(order?.objectId));

  return order ? (
    <UIButton
      type="link"
      className="p-2 flex flex-row items-center"
      onPress={() => {
        router.push({
          pathname: "/(tabs)/order/[id]",
          params: { id: order._id.toString() },
        });
      }}
    >
      <View className="flex-auto">
        <View className="flex flex-row items-center mb-1">
          {/* <View className="flex flex-row">
            <Text className="text-lg  text-s-500 dark:text-s-300 pr-1">
              {t("order")} №{order.number},
            </Text>
          </View> */}
          <View className="flex flex-row items-center">
            <Text className="text-lg font-medium text-s-500 dark:text-s-400 pr-1">
              {object?.name}
            </Text>
            {/* <Text className="text-xl leading-5 font-medium text-s-500 dark:text-s-300">
            {object?.name}
          </Text> */}
          </View>
        </View>

        {/* <Text className="text-s-500 leading-5 mb-2">Изделие</Text> */}
        <Text className="text-xl font-medium leading-5 text-g-950 dark:text-s-100">
          №{order.number} - {order.name}
        </Text>
      </View>
      <View>
        <SIcon
          path="iChevronRight"
          size={20}
          color={colorScheme === "dark" ? Colors.s[500] : Colors.s[300]}
        />
      </View>
    </UIButton>
  ) : (
    <Text>Not found order</Text>
  );
}
