import { Text, View } from "react-native";
import React, { useMemo } from "react";

import { FlatList } from "react-native-gesture-handler";
import useTaskWorkers from "@/hooks/useTaskWorkers";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { TaskSchema, TaskWorkerSchema } from "@/schema";
import { SSkeleton } from "../ui/SSkeleton";
import { TaskWorkerItem } from "./TaskWorkerItem";
import dayjs from "@/utils/dayjs";
import TaskNotFound from "./TaskNotFound";
import Card from "../Card";
import { useTranslation } from "react-i18next";

export interface TaskWorkerListProps {
  objectId: string;
}

const TaskWorkerList = (props: TaskWorkerListProps) => {
  const userFromStore = useAppSelector(user);

  const { t } = useTranslation();

  const tasks = useQuery(TaskSchema);
  // const { isLoading, error } = useTaskWorkers({
  //   workerId: userFromStore ? [userFromStore.id] : undefined,
  //   $limit: 100,
  // });

  const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
    items.filtered(
      "workerId IN $0 AND objectId == $1 AND status != 'finish' AND status != 'autofinish'",
      [userFromStore?.id, "000000000000000000000000"],
      props.objectId
    )
  ).filter((y) => {
    const _task = tasks.find((x) => x._id.toString() == y.taskId);

    return (
      // _task?.status != "finish" &&
      dayjs(new Date()).isBetween(dayjs(y.from), dayjs(y.to), "day", "[]") ||
      dayjs(new Date())
        .add(1, "day")
        .isBetween(dayjs(y.from), dayjs(y.to), "day", "[]") ||
      y._id.toString() === "000000000000000000000000"
    );
  });

  return (
    <View className="flex-1">
      {/* <Text>
        {props.objectId}-{taskWorkers.length}
      </Text> */}
      {/* isLoading ? (
        <View className="flex p-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item.toString()} className="flex-auto h-64 pb-4 px-2">
              <SSkeleton className="flex-1 bg-white dark:bg-s-900" />
            </View>
          ))}
        </View>
      ) :  */}
      {taskWorkers.length ? (
        <FlatList
          data={taskWorkers}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TaskWorkerItem taskWorkerId={item._id.toString()} />
          )}
        />
      ) : (
        <View className="px-4 mt-4">
          <View className="relative p-4 bg-s-500 dark:bg-s-500 rounded-lg">
            <View className="w-8 h-8 rotate-45 absolute -top-4 left-3 bg-s-500 dark:bg-s-500"></View>
            <Text className="text-lg text-white dark:text-black leading-6">
              {t("info.taskForOrderNotFound")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TaskWorkerList;
