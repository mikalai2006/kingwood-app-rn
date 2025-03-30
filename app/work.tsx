import { View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { activeTaskWorker, setLinkParams } from "@/store/storeSlice";
import { TaskWorkerNotify } from "@/components/task/TaskWorkerNotify";
import UIButton from "@/components/ui/UIButton";
import { router } from "expo-router";

export default function TabWorkScreen() {
  const dispatch = useAppDispatch();

  const activeTaskFromStore = useAppSelector(activeTaskWorker);

  // const { isLoading, error } = useOrders({
  //   // userId: "",
  //   // query: "",
  // });

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View className="p-4">
            <TaskWorkerNotify />
          </View>
          {/* <Card>
            <Text>{JSON.stringify(activeTaskFromStore)}</Text>
          </Card>
          <UIButton type="link">
            <View className="rounded-full bg-p-500 p-6">
              <SIcon path="iTimer" size={50} />
            </View>
          </UIButton> */}
          {/* <View className="flex items-stretch flex-row flex-wrap py-2">
              {orders.map((item, index) => {
                <OrderListItem
                  key={item._id.toString() || index}
                  order={item}
                />;
              })}
            </View> */}
          {/* <UIButton
            type="primary"
            text="[orderId]"
            onPress={() => {
              router.push({
                pathname: "/[orderId]",
                params: { orderId: "6793bcdb9094050b013e54dc" },
              });
            }}
          />
          <UIButton
            type="primary"
            text="[orderId]/message"
            onPress={() => {
              router.push({
                pathname: "/[orderId]/message",
                params: { orderId: "6793bcdb9094050b013e54dc" },
              });
            }}
          />
          <UIButton
            type="primary"
            text="/(tabs)/order"
            onPress={() => {
              router.push({
                pathname: "/(tabs)/order",
                params: { objectId: "6793c5c0913e9988797a39f8" },
              });
              dispatch(setLinkParams({ objectId: "6793c5c0913e9988797a39f8" }));
            }}
          /> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
