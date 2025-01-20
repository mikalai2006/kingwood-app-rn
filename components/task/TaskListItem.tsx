import { Text, View } from "react-native";
import RImage from "../r/RImage";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useObject } from "@realm/react";
import { UserSchema } from "@/schema/UserSchema";
import { useColorScheme } from "nativewind";
import { BSON } from "realm";
import { TaskSchema } from "@/schema";
import { useAppSelector } from "@/store/hooks";
import { activeTaskWorker } from "@/store/storeSlice";

export type TaskListItemProps = {
  task: TaskSchema;
};

export function TaskListItem({ task }: TaskListItemProps) {
  const { colorScheme } = useColorScheme();
  const activeTaskFromStore = useAppSelector(activeTaskWorker);

  // const user = useObject(UserSchema, new BSON.ObjectId(task.userId));

  return task ? (
    <View className="w-full p-2 px-4">
      <UIButton
        type="link"
        disabled={activeTaskFromStore !== null}
        className="flex flex-col items-stretch bg-white dark:bg-s-900 rounded-lg overflow-hidden"
        onPress={() => {
          router.push({
            pathname: "/order/[id]",
            params: { id: task._id.toString() },
          });
        }}
      >
        {/* <View style={{ aspectRatio: 1 }}>
          <RImage
            className="object-cover aspect-square"
            image={task?.images ? task?.images[0] : null}
            style={{ aspectRatio: 1, width: "100%" }}
          />
        </View> */}
        <View className="p-4">
          <Text
            className="text-xl leading-6 font-semibold text-g-950 dark:text-s-100"
            numberOfLines={2}
            lineBreakMode="tail"
          >
            {task.name}
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
  ) : (
    <Text>Not found task</Text>
  );
}
