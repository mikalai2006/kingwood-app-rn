import { ActivityIndicator, Text, View } from "react-native";
import React, { useMemo } from "react";

import { FlatList, ScrollView } from "react-native-gesture-handler";
import useTaskWorkers from "@/hooks/useTaskWorkers";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { TaskSchema, TaskWorkerSchema } from "@/schema";
import { SSkeleton } from "../ui/SSkeleton";
import { TaskWorkerItem } from "./TaskWorkerItem";
import dayjs from "@/utils/dayjs";
import TaskNotFound from "./TaskNotFound";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import { BSON } from "realm";
import UIButton from "../ui/UIButton";

export interface TaskWorkerTabsProps {
  setObjectId: (objectId: string) => void;
  objectId: string;
}

const TaskWorkerTabs = (props: TaskWorkerTabsProps) => {
  const userFromStore = useAppSelector(user);

  const { isLoading, error } = useTaskWorkers({
    workerId: userFromStore ? [userFromStore.id] : undefined,
    $limit: 100,
  });

  // const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
  //   items.filtered("workerId == $0 AND status != 'finish'", [userFromStore?.id])
  // ).filter(
  //   (y) =>
  //     dayjs(new Date()).isBetween(dayjs(y.from), dayjs(y.to), "day", "[]") ||
  //     dayjs(new Date())
  //       .add(1, "day")
  //       .isBetween(dayjs(y.from), dayjs(y.to), "day", "[]")
  // );
  const tasks = useQuery(TaskSchema);
  const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
    items.filtered(
      "workerId == $0 AND status != 'finish' AND status != 'autofinish'",
      userFromStore?.id
    )
  ).filter((y) => {
    const _task = tasks.find((x) => x._id.toString() == y.taskId);

    return (
      // _task?.status != "finish" &&
      dayjs(new Date()).isBetween(dayjs(y.from), dayjs(y.to), "day", "[]") ||
      dayjs(new Date())
        .add(1, "day")
        .isBetween(dayjs(y.from), dayjs(y.to), "day", "[]")
    );
  });

  const allObjects = useQuery(ObjectsSchema);

  const objectsForTask = useMemo(() => {
    const _allIds = taskWorkers.map((x) => x.objectId);
    const _ids: string[] = [];
    for (const _id of _allIds) {
      if (!_ids.includes(_id)) {
        _ids.push(_id);
      }
    }

    const _result = _ids.map(
      (x) => allObjects.filtered("_id == $0", new BSON.ObjectId(x))[0]
    );

    return _result;
  }, [taskWorkers]);

  return (
    <ScrollView horizontal className="flex p-4">
      <View className="flex-row gap-2 h-12">
        {isLoading ? (
          <ActivityIndicator size={30} />
        ) : // [1, 2, 3, 4, 5].map((item) => (
        //   <View key={item.toString()} className="flex-auto w-20">
        //     <SSkeleton className="flex-1 bg-white dark:bg-s-900" />
        //   </View>
        // ))
        objectsForTask.length ? (
          objectsForTask.map((item) => (
            <View
              key={item?._id.toString()}
              className="flex-auto flex items-center"
            >
              <UIButton
                type="link"
                disabled={item?._id.toString() == props.objectId}
                // {
                //   item?._id.toString() == props.objectId
                //     ? "primary"
                //     : "secondary"
                // }
                //className="bg-white dark:bg-s-900 p-4 m-0 rounded-lg"
                text={item?.name}
                className={
                  item?._id.toString() == props.objectId
                    ? "bg-white dark:bg-s-600 p-3 m-0 rounded-lg"
                    : "bg-s-100 dark:bg-s-900 p-3 m-0 rounded-lg"
                }
                textClass={
                  item?._id.toString() == props.objectId
                    ? "px-2 text-xl leading-6 text-s-950 dark:text-white leading-5"
                    : "px-2 text-xl leading-6 text-s-500 dark:text-s-400 leading-5"
                }
                onPress={() => {
                  props.setObjectId(item._id.toString());
                }}
              />
              {/* <View
                  className={
                    item?._id.toString() == props.objectId
                      ? "bg-white dark:bg-s-500 p-4 m-0 rounded-lg"
                      : "bg-white dark:bg-s-900 p-4 m-0 rounded-lg"
                  }
                >
                  <Text>{item?.name}</Text>
                </View>
              </UIButton> */}
            </View>
          ))
        ) : (
          <TaskNotFound />
        )}
      </View>
    </ScrollView>
  );
};

export default TaskWorkerTabs;
