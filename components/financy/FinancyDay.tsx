import { Text, View } from "react-native";
import { useQuery } from "@realm/react";
import { useColorScheme } from "nativewind";
import { WorkTimeSchema } from "@/schema";
import dayjs from "@/utils/dayjs";
import { useAppSelector } from "@/store/hooks";
import { user, workTime } from "@/store/storeSlice";
import { useMemo } from "react";
import { TimerData, getObjectTime } from "@/hooks/useTimer";
import { TaskWorkerTime } from "../task/TaskWorkerTime";
import { IWorkTime } from "@/types";
import { useTranslation } from "react-i18next";
import { FinancyDayItemItem } from "./FinancyDayItem";
import { FinancyDayItemActive } from "./FinancyDayItemActive";
import { isWriteConsole } from "@/utils/global";

export type FinancyDayProps = {
  currentWorkTime: IWorkTime | null;
  time: TimerData;
  dayFromParams: string;
};

export function FinancyDay({
  currentWorkTime,
  time,
  dayFromParams,
}: FinancyDayProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);

  const workTimeFromStore = useAppSelector(workTime);

  const allWorkTime = useQuery(WorkTimeSchema, (items) =>
    items.filtered("workerId == $0", userFromStore?.id)
  );

  const allWorkTimeToday = useMemo(() => {
    allWorkTime.forEach((x) => {
      isWriteConsole &&
        console.log(
          dayjs(dayFromParams),
          // dayjs(dayFromParams).utc(true),
          dayjs(x.from).startOf("day"),
          dayjs(x.to).endOf("day"),
          dayjs(dayFromParams)
            .endOf("day")
            // .subtract(1, "day")
            .isBetween(
              dayjs(x.from).startOf("day"),
              dayjs(x.to).endOf("day"),
              "day",
              "[]"
            )
        );
    });
    return allWorkTime
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
  }, [allWorkTime]);

  const zp = useMemo(() => {
    if (!userFromStore) {
      return 0;
    }
    const to =
      dayjs(workTimeFromStore?.to).year() > 1
        ? workTimeFromStore?.to
        : dayjs(new Date()).utc().format();

    const _timeWorkMinutes = dayjs(to).diff(
      dayjs(workTimeFromStore?.from),
      "minutes",
      true
    );

    return workTimeFromStore
      ? _timeWorkMinutes * (workTimeFromStore.oklad / 60)
      : 0;
  }, [time, currentWorkTime?.oklad]);

  const isToday = useMemo(() => {
    return dayFromParams ? dayjs(dayFromParams).isToday() : false;
  }, [dayFromParams]);

  const zpFullDay = useMemo(() => {
    if (!allWorkTimeToday.length) {
      return;
    }

    // return allWorkTimeToday.map((x) => {
    //   const to =
    //     dayjs(x.to).year() > 1 ? x.to : dayjs(new Date()).utc().format();

    //   const _timeWorkMinutes = dayjs(to).diff(dayjs(x.from), "minutes", true);
    //   return Math.ceil(_timeWorkMinutes) * (x.oklad / 60);
    // });
    const totalFromDb = allWorkTimeToday.reduce((a, b) => a + b.total, 0);
    return totalFromDb + (isToday ? Math.ceil(zp) : 0);
  }, [time, allWorkTimeToday, zp]);

  const msFullDay = useMemo(() => {
    if (!allWorkTimeToday.length) {
      return;
    }

    const msCompleted = allWorkTimeToday
      .map((x) => {
        const to = dayjs(x.to).year() > 1 ? x.to : new Date();

        return dayjs(to).diff(dayjs(x.from));
      })
      .reduce((a, b) => {
        return a + b;
      }, 0);

    const msActive =
      isToday && workTimeFromStore
        ? dayjs(new Date()).diff(dayjs(workTimeFromStore.from))
        : 0;

    return msCompleted + msActive;
  }, [time, allWorkTimeToday]);

  return (
    <View className="px-2">
      {allWorkTimeToday.map((item) => (
        <FinancyDayItemItem item={item} key={item._id.toString()} />
      ))}
      {isToday && workTimeFromStore ? (
        <FinancyDayItemActive
          currentWorkTime={currentWorkTime}
          time={time}
          item={workTimeFromStore}
        />
      ) : null}
      <View className="mt-4 pt-4">
        <View className="flex flex-row gap-2">
          <Text className="flex-auto text-lg leading-6 text-s-500 dark:text-s-400">
            {t("totalZpDay")}:
          </Text>
          <Text className="text-2xl font-bold leading-6 text-p-600 dark:text-p-300">
            {zpFullDay || 0} ₽
          </Text>
        </View>
        {msFullDay && (
          <View className="flex flex-row gap-2">
            <Text className="text-lg leading-6 text-s-500 dark:text-s-400">
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
