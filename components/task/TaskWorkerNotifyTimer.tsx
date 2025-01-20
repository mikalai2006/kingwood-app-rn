import { Text } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { useTimer } from "@/hooks/useTimer";
import { useTranslation } from "react-i18next";
import { useQuery } from "@realm/react";
import { WorkTimeSchema } from "@/schema";
import { useMemo } from "react";
import { workTime } from "@/store/storeSlice";
import { TaskWorkerTime } from "./TaskWorkerTime";

export type TaskWorkerNotifyTimerProps = {
  className?: string;
  short?: boolean;
};

export function TaskWorkerNotifyTimer({
  className,
  short,
}: TaskWorkerNotifyTimerProps) {
  const workTimeFromStore = useAppSelector(workTime);

  const allWorkTime = useQuery(WorkTimeSchema);

  // const currentWorkTime = useMemo(() => {
  //   return allWorkTime.find((x) => x._id.toString() === workTimeFromStore?.id);
  // }, []);

  const { t } = useTranslation();

  const { time, hours, minutes, seconds } = useTimer({
    startTime: workTimeFromStore?.from,
    durationDays: 0,
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
