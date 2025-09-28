import { View, Text } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import Card from "@/components/Card";
import { useColorScheme } from "nativewind";
import UILabel from "@/components/ui/UILabel";
import { useMemo } from "react";
import { useQuery } from "@realm/react";
import { OrderSchema } from "@/schema";
import OrderObject from "@/components/order/OrderObject";
import { useTranslation } from "react-i18next";
import OrderTasks from "@/components/order/OrderTasks";
import { ObjectsSchema } from "@/schema/ObjectsSchema";

export default function OrderIndexScreen() {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const pathname = usePathname();

  // let { orderId } = useLocalSearchParams<{ orderId: string }>();
  const userFromStore = useAppSelector(user);

  const { orderId } = useGlobalSearchParams<{
    orderId: string;
  }>();

  const allOrders = useQuery(OrderSchema);
  const allObjects = useQuery(ObjectsSchema);

  const currentOrder = useMemo(
    () => allOrders.find((x) => x._id.toString() === orderId),
    [orderId, allOrders]
  );

  const object = useMemo(
    () => allObjects.find((x) => x._id.toString() === currentOrder?.objectId),
    [orderId, currentOrder?.objectId]
  );
  const image = useMemo(
    () => null, //(userFromDB?.images ? userFromDB?.images[0] : null),
    []
  );

  return (
    <View className="flex-1">
      {/* <SafeAreaView className="flex-1"> */}
      {/* <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        header={
          <View className="flex flex-row items-center">
            <View className="flex-none">
              <UIButtonBack />
            </View>
            <View className="flex-auto">
              <Text className="px-4 text-lg leading-5 text-s-800 dark:text-s-200">
                {object?.name}, №{currentOrder?.number} - {currentOrder?.name}
              </Text>
            </View>
          </View>
        }
        headerImage={
          currentOrder?.images ? (
            <>
              <ImageSlider slides={currentOrder?.images} />
            </>
          ) : null
        }
      > */}
      <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
        <View className="flex-1">
          <View className="p-4">
            <Card className="mb-4">
              <UILabel text={t("object")} />
              {currentOrder?.objectId && (
                <OrderObject objectId={currentOrder.objectId} />
              )}
            </Card>

            {currentOrder?.description && (
              <Card className="mb-2">
                <UILabel text={t("notes")} />
                <Text className="text-xl text-g-700 dark:text-s-100 leading-6">
                  {currentOrder.description}
                </Text>
              </Card>
            )}

            <Card className="mb-2">
              <UILabel text={t("tasks")} />
              {currentOrder && (
                <OrderTasks orderId={currentOrder._id.toString()} />
              )}
            </Card>
          </View>
        </View>
      </ScrollView>
      {/* </ParallaxScrollView> */}
      {/* </SafeAreaView> */}
    </View>
  );
}
