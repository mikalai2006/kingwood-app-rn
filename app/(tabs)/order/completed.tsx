import { ActivityIndicator, Text, View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { OrderSchema, TaskSchema, TaskWorkerSchema } from "@/schema";
import { useState } from "react";
import useTaskWorkers from "@/hooks/useTaskWorkers";
import { TaskWorkerItem } from "@/components/task/TaskWorkerItem";
import UIButton from "@/components/ui/UIButton";

export default function FollowScreen() {
  const userFromStore = useAppSelector(user);

  const [skip, setSkip] = useState(0);

  const { isLoading, error, total } = useTaskWorkers({
    workerId: userFromStore ? [userFromStore.id] : undefined,
    status: ["finish", "autofinish"],
    $limit: 2,
    $skip: skip,
    $sort: [
      {
        key: "number",
        value: -1,
      },
    ],
  });

  const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
    items
      .filtered("workerId == $0 AND status IN {'finish', 'autofinish'}", [
        userFromStore?.id,
      ])
      .sorted("orderId", true)
  );

  const allOrder = useQuery(OrderSchema);
  const tasks = useQuery(
    TaskSchema,
    (items) => items //.filtered("userId == $0", userFromStore?.id)
  );

  // const productsFormMyOffers = useMemo(() => {
  //   const idsProducts = tasks.map((x) => x.productId);
  //   return allOrder.filter((x) => idsProducts.includes(x._id.toString()));
  // }, [tasks]);

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      {/* <SafeAreaView className="flex-1"> */}
      {/* <Text className="text-xl text-s-900 dark:text-s-200">
          Заказы в работе
        </Text> */}
      {/* <View className="p-4">
        <UIButton
          type="secondary"
          text="addProduct"
          onPress={() => router.push("/lots/create")}
        />
      </View> */}
      {/* <Text>{JSON.stringify(tasks)}</Text> */}

      {isLoading ? (
        // <View className="flex p-2">
        //   {[1, 2, 3, 4, 5].map((item) => (
        //     <View key={item.toString()} className="flex-auto h-64 pb-4 px-2">
        //       <SSkeleton className="flex-1 bg-white dark:bg-s-900" />
        //     </View>
        //   ))}
        // </View>
        <View className="absolute top-0 bottom-0 left-0 right-0 flex-1 items-center justify-center">
          <ActivityIndicator size={30} />
        </View>
      ) : null}
      <>
        {/* <Text>
          {taskWorkers.length}, {total}, {skip}
        </Text> */}
        <FlatList
          data={taskWorkers}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item, index }) => (
            <>
              <TaskWorkerItem taskWorkerId={item._id.toString()} />
              {index == taskWorkers.length - 1 && total > taskWorkers.length ? (
                <View className="px-4 py-2">
                  <UIButton
                    type="secondary"
                    loading={isLoading}
                    disabled={isLoading}
                    text="Загрузить еще"
                    onPress={() => setSkip(taskWorkers.length - 1)}
                  />
                </View>
              ) : null}
            </>
          )}
        />
      </>
      {/* </SafeAreaView> */}
    </View>
  );
}
