import { View, TextInput, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import SIcon from "@/components/ui/SIcon";
import UIButton from "@/components/ui/UIButton";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import { activeTaskWorker } from "@/store/storeSlice";
import { TaskWorkerNotify } from "@/components/task/TaskWorkerNotify";

export default function TabListScreen() {
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
