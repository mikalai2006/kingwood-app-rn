import { Alert, Text, View } from "react-native";
import UIButton from "../ui/UIButton";
import { useColorScheme } from "nativewind";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { activeTaskWorker, workHistory } from "@/store/storeSlice";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import { TaskWorkerNotifyTimer } from "./TaskWorkerNotifyTimer";
import { TaskWorkerNotifyActiveTask } from "./TaskWorkerNotifyActiveTask";
import { useTranslation } from "react-i18next";
import { TaskWorkerNotifyActiveTaskNo } from "./TaskWorkerNotifyActiveTaskNo";
import { useTaskWorkerUtils } from "@/hooks/useTaskWorkerUtils";

export type TaskWorkerNotifyProps = {
  short?: boolean;
};

export function TaskWorkerNotify({ short }: TaskWorkerNotifyProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  // const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const { loading, onEndWorkTime } = useTaskWorkerUtils();

  return (
    <View className="flex gap-4">
      {workHistoryFromStore !== null ? (
        <View className="flex gap-2 bg-white dark:bg-s-700 p-2 rounded-lg">
          {!short && workHistoryFromStore !== null && (
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
                  {t("totalWorkTime")}:
                </Text>
                {workHistoryFromStore !== null && (
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
            {
              workHistoryFromStore !== null ? (
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
              ) : null
              // <UIButton
              //   type="primary"
              //   text={t("button.startWorkTime")}
              //   onPress={() => {
              //     Alert.alert(
              //       t("info.startWorkTime"),
              //       t("info.startWorkTimeDescription"),
              //       [
              //         {
              //           text: t("button.no"),
              //           onPress: () => {},
              //           style: "cancel",
              //         },
              //         {
              //           text: t("button.yes"),
              //           onPress: async () => {
              //             await onStartWorkTime();

              //             const orders = allOrders.filtered(
              //               "_id=$0",
              //               new BSON.ObjectId(activeTaskWorkerFromStore?.orderId)
              //             );
              //             if (orders.length) {
              //               Alert.alert(
              //                 t("info.loadPrevTask"),
              //                 t("info.loadPrevTaskDescription", {
              //                   orderName: orders[0]?.name,
              //                 }),
              //                 [
              //                   // {
              //                   //   text: "Ask me later",
              //                   //   onPress: () => console.log("Ask me later pressed"),
              //                   // },
              //                   {
              //                     text: t("button.no"),
              //                     onPress: () => {
              //                       dispatch(setActiveTaskWorker(null));
              //                     },
              //                     style: "cancel",
              //                   },
              //                   {
              //                     text: t("button.yes"),
              //                     onPress: () => {
              //                       onStartPrevTask();
              //                     },
              //                   },
              //                 ]
              //               );
              //             }
              //           },
              //         },
              //       ]
              //     );
              //   }}
              // />
            }

            {activeTaskWorkerFromStore !== null ? (
              <View className="flex-initial pt-2">
                <TaskWorkerNotifyActiveTask />
              </View>
            ) : (
              <TaskWorkerNotifyActiveTaskNo />
            )}
          </View>
        </View>
      ) : (
        <TaskWorkerNotifyActiveTaskNo />
      )}
    </View>
  );
}
