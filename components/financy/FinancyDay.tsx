import { Text, View } from "react-native";
import { useQuery } from "@realm/react";
import { useColorScheme } from "nativewind";
import dayjs from "@/utils/dayjs";
import { useAppSelector } from "@/store/hooks";
import { user, workHistory } from "@/store/storeSlice";
import { useMemo } from "react";
import { TimerData, getObjectTime } from "@/hooks/useTimer";
import { TaskWorkerTime } from "../task/TaskWorkerTime";
import { IWorkHistory } from "@/types";
import { useTranslation } from "react-i18next";
import { FinancyDayItemItem } from "./FinancyDayItem";
import { FinancyDayItemActive } from "./FinancyDayItemActive";
import { isWriteConsole } from "@/utils/global";
import { WorkHistorySchema } from "@/schema";

export type FinancyDayProps = {
  currentWorkHistory: IWorkHistory | null;
  time: TimerData;
  dayFromParams: string;
};

export function FinancyDay({
  currentWorkHistory,
  time,
  dayFromParams,
}: FinancyDayProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const allWorkHistory = useQuery(WorkHistorySchema, (items) =>
    items.filtered("workerId == $0", userFromStore?.id)
  );

  const allWorkHistoryToday = useMemo(() => {
    allWorkHistory.forEach((x) => {
      // isWriteConsole &&
      //   console.log(
      //     dayjs(dayFromParams),
      //     // dayjs(dayFromParams).utc(true),
      //     dayjs(x.from).startOf("day"),
      //     dayjs(x.to).endOf("day"),
      //     dayjs(dayFromParams)
      //       .endOf("day")
      //       // .subtract(1, "day")
      //       .isBetween(
      //         dayjs(x.from).startOf("day"),
      //         dayjs(x.to).endOf("day"),
      //         "day",
      //         "[]"
      //       )
      //   );
    });
    return allWorkHistory
      .filter(
        (x) =>
          dayjs(x.to).year() > 1 &&
          dayjs(dayFromParams)
            .utc(true)
            .endOf("day")
            // .subtract(1, "day")
            .isBetween(
              dayjs(x.from).utc(true).startOf("day"),
              dayjs(x.to).utc(true).endOf("day"),
              "day",
              "[]"
            )
      )
      .sort((a, b) => a.from.localeCompare(b.from));
  }, [allWorkHistory]);

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
  }, [time, currentWorkHistory?.oklad]);

  const isToday = useMemo(() => {
    return dayFromParams ? dayjs(dayFromParams).isToday() : false;
  }, [dayFromParams]);

  const zpFullDay = useMemo(() => {
    if (!allWorkHistoryToday.length) {
      return;
    }

    const totalFromDb = allWorkHistoryToday.reduce((a, b) => a + b.total, 0);
    return totalFromDb + (isToday ? Math.ceil(zp) : 0);
  }, [time, allWorkHistoryToday, zp]);

  const msFullDay = useMemo(() => {
    if (!allWorkHistoryToday.length) {
      return;
    }

    const msCompleted = allWorkHistoryToday
      .map((x) => {
        const to = dayjs(x.to).year() > 1 ? x.to : new Date();

        return dayjs(to).diff(dayjs(x.from));
      })
      .reduce((a, b) => {
        return a + b;
      }, 0);

    const msActive =
      isToday && workHistoryFromStore
        ? dayjs(new Date()).diff(dayjs(workHistoryFromStore.from))
        : 0;

    return msCompleted + msActive;
  }, [time, allWorkHistoryToday]);

  return (
    <View className="px-2">
      {allWorkHistoryToday.map((item) => (
        <FinancyDayItemItem item={item} key={item._id.toString()} />
      ))}
      {isToday && workHistoryFromStore ? (
        <FinancyDayItemActive
          currentWorkHistory={currentWorkHistory}
          time={time}
          item={workHistoryFromStore}
        />
      ) : null}
      <View className="mt-4 pt-4 flex gap-2">
        <View className="flex flex-row gap-2 border-b border-black/10 dark:border-white/10 pb-2">
          <Text className="flex-auto text-lg leading-6 text-s-600 dark:text-s-400">
            {t("totalZpDay")}:
          </Text>
          <Text className="text-2xl font-bold leading-6 text-p-600 dark:text-p-300">
            {zpFullDay || 0} ₽
          </Text>
        </View>
        {msFullDay && (
          <View className="flex flex-row gap-2">
            <Text className="flex-auto text-lg leading-6 text-s-600 dark:text-s-400">
              {t("totalTimeDay")}:
            </Text>
            <TaskWorkerTime
              className="text-lg leading-6 text-s-800 dark:text-s-200"
              time={getObjectTime(msFullDay)}
            />
          </View>
        )}
      </View>
    </View>
  );
}
