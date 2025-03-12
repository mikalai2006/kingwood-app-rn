import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useAppSelector } from "@/store/hooks";
import { financyFilter, user, workHistory } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import SIcon from "../ui/SIcon";
import { useQuery } from "@realm/react";
import { useMemo } from "react";
import dayjs from "@/utils/dayjs";
import { getObjectTime, TimerData } from "@/hooks/useTimer";
import { TaskWorkerTime } from "../task/TaskWorkerTime";
import { WorkHistorySchema } from "@/schema";

export type FinancyMonthItemProps = {
  date: string;
  time: TimerData;
};

export function FinancyMonthItem({ date, time }: FinancyMonthItemProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);

  const workHistoryFromStore = useAppSelector(workHistory);

  const financyFilterFromStore = useAppSelector(financyFilter);

  const allWorkHistory = useQuery(WorkHistorySchema, (items) =>
    items.filtered("workerId == $0", userFromStore?.id)
  );

  const isToday = useMemo(() => {
    return date ? dayjs(date).isToday() : false;
  }, [date]);

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
  }, [time, workHistoryFromStore?.oklad]);

  const allWorkHistoryToday = useMemo(() => {
    return allWorkHistory
      .filter(
        (x) =>
          dayjs(date).isBetween(dayjs(x.from), dayjs(x.to), "day", "[]") &&
          // dayjs(date)
          //   // .subtract(1, "day")
          //   .isBetween(
          //     dayjs(x.from).startOf("day"),
          //     dayjs(x.to).endOf("day"),
          //     "day",
          //     "[]"
          //   )
          dayjs(x.to).year() > 1
      )
      .sort((a, b) => a.from.localeCompare(b.from));
  }, [allWorkHistory]);

  const total = useMemo(
    () =>
      (allWorkHistoryToday.length
        ? allWorkHistoryToday.reduce((a, b) => a + b.total, 0)
        : 0) + (isToday ? zp : 0),
    [time]
  );

  const totalTime = useMemo(() => {
    const totalMs = allWorkHistoryToday
      .map((item) => {
        const to =
          dayjs(item.to).year() > 1 ? item.to : dayjs(new Date()).format();

        const _timeWorkMs = dayjs(to).diff(dayjs(item.from));

        return _timeWorkMs;
      })
      .reduce((a, b) => a + b, 0);
    const msActive =
      isToday && workHistoryFromStore
        ? dayjs(new Date()).diff(dayjs(workHistoryFromStore.from))
        : 0;
    return totalMs + msActive;
  }, [allWorkHistoryToday, time]);

  return (
    <UIButton
      type="secondary"
      className="border-t border-black/10 dark:border-white/10 py-4 px-6"
      onPress={() => {
        router.push({
          pathname: "/finance/[day]",
          params: {
            day: date,
          },
        });
      }}
    >
      <View className="flex flex-row items-center gap-2">
        <View className="flex flex-auto">
          <Text className="text-lg text-s-700 dark:text-s-400">
            {dayjs(date).locale("ru").format("D")}
          </Text>
        </View>
        {totalTime ? (
          <Text className="text-base text-s-700 dark:text-s-400">
            {
              <TaskWorkerTime
                time={getObjectTime(totalTime)}
                className="text-md text-s-700 dark:text-s-300"
                short={false}
                // hideSeconds
              />
            }
          </Text>
        ) : null}
        {total > 0 ? (
          <Text className="text-xl font-bold text-p-600 dark:text-p-300">
            {Math.ceil(total)} ₽
          </Text>
        ) : (
          <Text className="text-s-300 dark:text-s-700">------</Text>
        )}
        <View>
          <SIcon path="iChevronRight" size={20} />
        </View>
      </View>
    </UIButton>
  );
}
