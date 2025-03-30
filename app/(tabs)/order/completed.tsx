import { ActivityIndicator, Text, View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import {
  OrderSchema,
  TaskSchema,
  TaskStatusSchema,
  TaskWorkerSchema,
} from "@/schema";
import { useMemo } from "react";
import useTaskWorkers from "@/hooks/useTaskWorkers";
import { TaskWorkerItem } from "@/components/task/TaskWorkerItem";
import { SSkeleton } from "@/components/ui/SSkeleton";

export default function FollowScreen() {
  const userFromStore = useAppSelector(user);

  const allTaskStatus = useQuery(TaskStatusSchema);

  const startStatus = useMemo(
    () => allTaskStatus.find((x) => x.start),
    [allTaskStatus]
  );

  const { isLoading, error } = useTaskWorkers({
    workerId: userFromStore ? [userFromStore.id] : undefined,
    $limit: 30,
    // statusId: startStatus?._id ? [startStatus?._id.toString()] : [],
  });

  const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
    items.filtered("workerId == $0 AND status IN {'finish', 'autofinish'}", [
      userFromStore?.id,
    ])
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
        <ActivityIndicator size={30} />
      ) : (
        <FlatList
          data={taskWorkers}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TaskWorkerItem taskWorkerId={item._id.toString()} />
          )}
        />
      )}
      {/* </SafeAreaView> */}
    </View>
  );
}
