import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { WorkTimeSchema } from "@/schema";
import dayjs, { formatDate, formatDateTime, formatTime } from "@/utils/dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getObjectTime } from "@/hooks/useTimer";
import { TaskWorkerTime } from "../task/TaskWorkerTime";
import Card from "../Card";

export type FinancyDayItemItemProps = {
  item: WorkTimeSchema;
};

export function FinancyDayItemItem({ item }: FinancyDayItemItemProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const zp = useMemo(() => {
    if (!item) {
      return { zp: 0, totalMinutes: 0, timeWorkMs: 0 };
    }

    const _timeWorkMinutes = dayjs(item.to).diff(
      dayjs(item.from),
      "minutes",
      true
    );
    const _timeWorkMs = dayjs(item.to).diff(dayjs(item.from));

    return {
      zp: _timeWorkMinutes * (item.oklad / 60),
      totalMinutes: _timeWorkMinutes,
      timeWorkMs: _timeWorkMs,
    };
  }, [item]);

  const time = useMemo(() => {
    return getObjectTime(zp.timeWorkMs);
  }, [zp]);

  return (
    <Card className="flex flex-row items-center mb-3 py-3">
      <View className="flex-auto">
        <View className=" flex flex-row gap-2">
          {/* <Text className="text-s-800 dark:text-s-200">
            {dayjs("2025-01-14T21:01:59.742Z").utc(true).format(formatDate)}
          </Text> */}
          <View>
            <Text className="text-xs leading-5 text-s-500 dark:text-s-400">
              {dayjs(item.from).utc(true).format(formatDate)}
            </Text>
            <Text className="text-xl font-medium leading-6 text-s-800 dark:text-s-200">
              {dayjs(item.from).utc(true).format(formatTime)}
            </Text>
          </View>
          <Text className="text-5xl text-s-800 dark:text-s-200">⇢</Text>
          <View>
            <Text className="text-xs leading-5 text-s-500 dark:text-s-400">
              {" "}
              {dayjs(item.to).utc(true).format(formatDate)}
            </Text>
            <Text className="text-xl font-medium leading-6 text-s-800 dark:text-s-200">
              {" "}
              {dayjs(item.to).utc(true).format(formatTime)}
            </Text>
          </View>
        </View>
        <Text className="text-md text-s-500 dark:text-s-500">
          {t("worked")}:{" "}
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
        {/* {" "}
        {zp.zp} ₽ /  */}
        {item.total} ₽
      </Text>
    </Card>
  );
}
