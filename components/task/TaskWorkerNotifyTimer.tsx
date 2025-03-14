import { useAppSelector } from "@/store/hooks";
import { useTimer } from "@/hooks/useTimer";
import { user, workHistory } from "@/store/storeSlice";
import { TaskWorkerTime } from "./TaskWorkerTime";
import { useQuery } from "@realm/react";
import { WorkHistorySchema } from "@/schema";
import { useMemo } from "react";
import dayjs from "@/utils/dayjs";
import { Text } from "react-native";

export type TaskWorkerNotifyTimerProps = {
  className?: string;
  short?: boolean;
};

export function TaskWorkerNotifyTimer({
  className,
  short,
}: TaskWorkerNotifyTimerProps) {
  const workHistoryFromStore = useAppSelector(workHistory);

  const userFromStore = useAppSelector(user);

  // const allWorkTime = useQuery(WorkTimeSchema);

  // const currentWorkTime = useMemo(() => {
  //   return allWorkTime.find((x) => x._id.toString() === workTimeFromStore?.id);
  // }, []);

  // const { t } = useTranslation();

  const allWorkHistory = useQuery(WorkHistorySchema, (items) =>
    items.filtered("workerId == $0", userFromStore?.id)
  );

  const isToday = useMemo(() => {
    return workHistoryFromStore?.date
      ? dayjs(workHistoryFromStore?.date).isToday()
      : false;
  }, [workHistoryFromStore?.date]);

  const allWorkHistoryToday = useMemo(() => {
    return allWorkHistory
      .filter(
        (x) =>
          dayjs(workHistoryFromStore?.date).isBetween(
            dayjs(x.from),
            dayjs(x.to),
            "day",
            "[]"
          ) &&
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

  const totalTime = useMemo(() => {
    const totalMs = allWorkHistoryToday
      .map((item) => {
        // const to =
        //   dayjs(item.to).year() > 1 ? item.to : dayjs(new Date()).format();

        // const _timeWorkMs = dayjs(to).diff(dayjs(item.from));

        return item.totalTime;
      })
      .reduce((a, b) => a + b, 0);
    // const msActive =
    //   isToday && workHistoryFromStore
    //     ? dayjs(new Date()).diff(dayjs(workHistoryFromStore.from))
    //     : 0;
    return totalMs; // + msActive;
  }, [allWorkHistoryToday]);

  const { time, hours, minutes, seconds } = useTimer({
    startTime: workHistoryFromStore?.from,
    durationDays: 0,
    addedMs: totalTime,
  });

  return (
    <TaskWorkerTime time={time} className={className} short={short} />
    // <Text className={`${className}`}>
    //   {hours}
    //   {!short ? t("time.hours") + " " : ":"}
    //   {minutes}
    //   {!short ? t("time.minutes") + " " : ":"}
    //   {seconds}
    //   {!short ? t("time.seconds") + " " : ""}
    // </Text>
  );
}
