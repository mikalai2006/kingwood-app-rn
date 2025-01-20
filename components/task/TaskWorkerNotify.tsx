import { Alert, Text, View } from "react-native";
import RImage from "../r/RImage";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useObject, useQuery, useRealm } from "@realm/react";
import { UserSchema } from "@/schema/UserSchema";
import { useColorScheme } from "nativewind";
// import { BSON } from "realm";
import {
  OrderSchema,
  TaskSchema,
  TaskStatusSchema,
  WorkTimeSchema,
} from "@/schema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeTaskWorker,
  // setTimeWorkEnd,
  // setTimeWorkStart,
  // timeWorkStart,
  // timeWorkEnd,
  // clearTimeWork,
  setActiveTaskWorker,
  setWorkTime,
  user,
  workTime,
} from "@/store/storeSlice";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import { TaskWorkerNotifyTimer } from "./TaskWorkerNotifyTimer";
import { TaskWorkerNotifyActiveTask } from "./TaskWorkerNotifyActiveTask";
import { useMemo, useState } from "react";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI } from "@/utils/global";
import { ITaskWorker, IWorkTime } from "@/types";
import { BSON, UpdateMode } from "realm";
import dayjs from "@/utils/dayjs";
import { useTranslation } from "react-i18next";
import { TaskWorkerNotifyActiveTaskNo } from "./TaskWorkerNotifyActiveTaskNo";
import { useTaskWorkerUtils } from "@/hooks/useTaskWorkerUtils";

export type TaskWorkerNotifyProps = {
  short?: boolean;
};

export function TaskWorkerNotify({ short }: TaskWorkerNotifyProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  // const userFromStore = useAppSelector(user);

  const workTimeFromStore = useAppSelector(workTime);

  // const allWorkTime = useQuery(WorkTimeSchema);

  // const currentWorkTime = useMemo(() => {
  //   return allWorkTime.find((x) => x._id.toString() === workTimeFromStore?.id);
  // }, []);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const { loading, onEndWorkTime, onStartWorkTime } = useTaskWorkerUtils();

  return (
    <View className="flex gap-4">
      <View className="flex gap-2 bg-white dark:bg-s-700 p-2 rounded-lg">
        {!short && workTimeFromStore !== null && (
          <View className="flex flex-row items-center gap-4">
            <View className="rounded-full">
              <SIcon
                path={"iTimer"}
                size={40}
                color={colorScheme === "dark" ? Colors.white : Colors.s[700]}
              />
            </View>
            <View className="">
              <Text className="text-s-700 dark:text-s-200 text-base">
                Общее рабочее время:
              </Text>
              {workTimeFromStore !== null && (
                <TaskWorkerNotifyTimer className="text-s-900 font-medium dark:text-white text-2xl leading-8 " />
              )}
              {/* <Text className="text-white text-lg">
                {timeWorkStartFromStore}
              </Text>
              <Text className="text-white text-lg">{timeWorkEndFromStore}</Text> */}
            </View>
          </View>
        )}
        <View>
          {workTimeFromStore !== null ? (
            <UIButton
              type="primary"
              text={t("button.endWorkTime")}
              loading={loading}
              onPress={() => {
                Alert.alert(
                  t("info.endWorkTime"),
                  t("info.endWorkTimeDescription"),
                  [
                    {
                      text: t("button.no"),
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: t("button.yes"),
                      onPress: () => {
                        onEndWorkTime();
                      },
                    },
                  ]
                );
              }}
            />
          ) : (
            <UIButton
              type="primary"
              text={t("button.startWorkTime")}
              onPress={() => {
                Alert.alert(
                  t("info.startWorkTime"),
                  t("info.startWorkTimeDescription"),
                  [
                    {
                      text: t("button.no"),
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: t("button.yes"),
                      onPress: () => {
                        onStartWorkTime();
                      },
                    },
                  ]
                );
              }}
            />
          )}

          {workTimeFromStore !== null ? (
            activeTaskWorkerFromStore !== null ? (
              <View className="flex-initial pt-2">
                <TaskWorkerNotifyActiveTask />
              </View>
            ) : (
              <TaskWorkerNotifyActiveTaskNo />
            )
          ) : null}
        </View>
      </View>
    </View>
  );
}
