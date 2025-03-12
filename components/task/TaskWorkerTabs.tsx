import { ActivityIndicator, Text, View } from "react-native";
import React, { useMemo } from "react";

import { FlatList, ScrollView } from "react-native-gesture-handler";
import useTaskWorkers from "@/hooks/useTaskWorkers";
import { useAppSelector } from "@/store/hooks";
import { user, workHistory } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { TaskSchema, TaskStatusSchema, TaskWorkerSchema } from "@/schema";
import { SSkeleton } from "../ui/SSkeleton";
import { TaskWorkerItem } from "./TaskWorkerItem";
import dayjs from "@/utils/dayjs";
import TaskNotFound from "./TaskNotFound";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import { BSON } from "realm";
import UIButton from "../ui/UIButton";
import TaskIcon from "./TaskIcon";

export interface TaskWorkerTabsProps {
  setObjectId: (objectId: string) => void;
  objectId: string;
}

const TaskWorkerTabs = (props: TaskWorkerTabsProps) => {
  const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const statusProcess = useQuery(TaskStatusSchema, (items) =>
    items.filtered("status == 'process'")
  );

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
      "workerId IN $0 AND status != 'finish' AND status != 'autofinish'",
      [userFromStore?.id, "000000000000000000000000"]
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

  // const taskWorkers1 = useQuery(TaskWorkerSchema, (items) =>
  //   items.filtered("_id == $0", new BSON.ObjectId("000000000000000000000000"))
  // );
  // console.log("taskWorkers1: ", taskWorkers1);

  const allObjects = useQuery(ObjectsSchema);

  const objectsForTask = useMemo(() => {
    const _allIds = taskWorkers.map((x) => x.objectId);
    const _ids: string[] = [];
    for (const _id of _allIds) {
      if (!_ids.includes(_id)) {
        _ids.push(_id);
      }
    }
    // _ids.push("000000000000000000000000");

    const _result = _ids.map(
      (x) => allObjects.filtered("_id == $0", new BSON.ObjectId(x))[0]
    );

    return _result;
  }, [taskWorkers]);

  return (
    <ScrollView horizontal className="flex">
      <View className="p-4">
        {/* <Text>{JSON.stringify(objectsForTask)}</Text> */}
        <View className="flex-row gap-2 h-12">
          {/* <Text>{props.objectId}</Text> */}
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
                className="flex-auto flex items-center relative"
              >
                <UIButton
                  type="link"
                  disabled={item?._id.toString() == props.objectId}
                  focusable={item?._id.toString() == props.objectId}
                  // {
                  //   item?._id.toString() == props.objectId
                  //     ? "primary"
                  //     : "secondary"
                  // }
                  //className="bg-white dark:bg-s-900 p-4 m-0 rounded-lg"
                  text={item?.name}
                  className={
                    item?._id.toString() == props.objectId
                      ? "bg-p-600 dark:bg-p-600 p-3 m-0 rounded-lg"
                      : "bg-s-300 dark:bg-s-900 p-3 m-0 rounded-lg"
                  }
                  textClass={
                    item?._id.toString() == props.objectId
                      ? "px-2 text-xl leading-6 text-white dark:text-white leading-5"
                      : "px-2 text-xl leading-6 text-s-700 dark:text-s-400 leading-5"
                  }
                  onPress={() => {
                    props.setObjectId(item._id.toString());
                  }}
                />
                {workHistoryFromStore?.objectId == item._id.toString() &&
                  statusProcess.length && (
                    // <View className="absolute top-0 w-4 h-4 bg-s-500 rounded-full"></View>
                    <TaskIcon
                      key={"status"}
                      statusId={statusProcess[0]._id.toString()}
                      className="p-2 absolute -top-2 right-0"
                    />
                  )}
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
      </View>
    </ScrollView>
  );
};

export default TaskWorkerTabs;
