import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import dayjs, { formatDate, formatTime } from "@/utils/dayjs";
import { useAppSelector } from "@/store/hooks";
import { user, workHistory } from "@/store/storeSlice";
import { TimerData } from "@/hooks/useTimer";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TaskWorkerTime } from "../task/TaskWorkerTime";
import { IWorkHistory } from "@/types";
import Card from "../Card";
import { FinancyDayItemOrderInfo } from "./FinancyDayItemOrderInfo";

export type FinancyDayItemActiveProps = {
  item: IWorkHistory;
  currentWorkHistory: IWorkHistory | null;
  time: TimerData;
};

export function FinancyDayItemActive({
  item,
  currentWorkHistory,
  time,
}: FinancyDayItemActiveProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const zp = useMemo(() => {
    if (!userFromStore) {
      return 0;
    }
    const to =
      dayjs(workHistoryFromStore?.to).year() > 1
        ? workHistoryFromStore?.to
        : dayjs(new Date()).utc().format();

    const _timeWorkMinutes = dayjs(to).diff(
      dayjs(workHistoryFromStore?.from),
      "minutes",
      true
    );

    return workHistoryFromStore
      ? _timeWorkMinutes * (workHistoryFromStore.oklad / 60)
      : 0;
  }, [time, currentWorkHistory?.oklad, workHistoryFromStore]);

  return (
    <Card className="flex flex-row items-center mb-3 py-3">
      <View className="flex-auto">
        {item && (
          <FinancyDayItemOrderInfo
            workHistory={JSON.parse(JSON.stringify(item))}
          />
        )}
        <View className="flex flex-row gap-2 items-center">
          {/* <Text className="text-s-800 dark:text-s-200">
                    {t("from")}
                  </Text> */}
          <View>
            {/* <Text className="text-base leading-5 text-s-500 dark:text-s-200">
              {dayjs(item.from).format(formatDate)}
            </Text> */}
            <Text className="text-xl font-medium leading-6 text-s-800 dark:text-s-200">
              {dayjs(item.from).format(formatTime)}
            </Text>
          </View>
          <Text className="text-5xl text-s-800 dark:text-s-200">⇢</Text>
          <View>
            {/* <Text className="text-base leading-5 text-s-500 dark:text-s-200">
              {" "}
              {dayjs(time.date).format(formatDate)}
            </Text> */}
            <Text className="text-xl font-medium leading-6 text-s-800 dark:text-s-200">
              {" "}
              {dayjs(time.date).format(formatTime)}
            </Text>
          </View>
        </View>
        <Text className="text-md text-s-500 dark:text-s-500">
          {/* {t("worked")}:{" "} */}
          <TaskWorkerTime
            time={time}
            className="text-md text-s-500 dark:text-s-500"
            short={false}
          />
          {/* {time.hours ? time.hours + ":" : ""}
                {time.minutes}:{time.seconds} */}
        </Text>
      </View>
      <Text className="text-2xl font-bold text-p-600 dark:text-p-300">
        ~ {Math.ceil(zp)} ₽
      </Text>
    </Card>
  );
}
