import { Text, View } from "react-native";
import RImage from "../r/RImage";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useObject } from "@realm/react";
import { UserSchema } from "@/schema/UserSchema";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { BSON } from "realm";
import { OrderSchema } from "@/schema";

export type OrderListItemProps = {
  order: OrderSchema;
};

export function OrderListItem({ order }: OrderListItemProps) {
  const { colorScheme } = useColorScheme();

  const user = useObject(UserSchema, new BSON.ObjectId(order.userId));

  return (
    <View className="w-full p-2 px-4">
      <UIButton
        type="link"
        className="flex flex-col items-stretch bg-white dark:bg-s-900 rounded-lg overflow-hidden"
        onPress={() => {
          router.push({
            pathname: "/order/[id]",
            params: { id: order._id.toString() },
          });
        }}
      >
        <View style={{ aspectRatio: 1 }}>
          <RImage
            className="object-cover aspect-square"
            image={order?.images[0]}
            style={{ aspectRatio: 1, width: "100%" }}
          />

          {/* <View className="absolute bottom-0 left-0 right-0 px-4 pt-4">
            <LinearGradient
              colors={[
                "transparent",
                colorScheme === "dark" ? Colors.s[800] : Colors.white,
              ]}
              locations={[0, 0.5]}
              dither={false}
              className="absolute bottom-0 left-0 right-0 h-28"
            />
          </View> */}
        </View>
        <View className="p-4">
          <Text
            className="text-xl leading-6 font-semibold text-g-950 dark:text-s-100"
            numberOfLines={2}
            lineBreakMode="tail"
          >
            {order.description}
          </Text>
          <View className="pt-2 flex flex-row items-center">
            <View className="flex-auto">
              {/* <ProductLocation userId={user?._id.toString()} /> */}
            </View>
            <View className="">
              {/* <Text className="text-xl text-p-500 font-bold leading-5">
                  <ProductCost product={product} />
                </Text> */}
              <Text className="text-xl text-p-500 dark:text-p-300 font-bold leading-6">
                text
                {/* {product.actions?.includes(1) ? "Отдам первому" : "Аукцион"} */}
              </Text>
            </View>
          </View>
        </View>
        {/* {numColumns === 1 && (
          <View className="px-4 pb-4 flex flex-row gap-2">
            <View className="flex-auto flex flex-row flex-wrap items-start gap-2">
              <View className="bg-p-500 py-0.5 px-1.5 rounded-lg">
                <Text className="text-white">Отдам даром</Text>
              </View>
              <View className="bg-green-500 py-0.5 px-1.5 rounded-lg">
                <Text className="text-white">Обмен</Text>
              </View>
            </View>

            <View className="flex flex-row gap-4 items-end"></View>
          </View>
        )} */}
      </UIButton>
    </View>
  );
}
