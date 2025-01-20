import { Text } from "react-native";
import { TimerData } from "@/hooks/useTimer";
import { useTranslation } from "react-i18next";

export type TaskWorkerTimeProps = {
  time: TimerData;
  className?: string;
  short?: boolean;
  hideSeconds?: boolean;
};

export function TaskWorkerTime({
  className,
  short,
  time,
  hideSeconds,
}: TaskWorkerTimeProps) {
  const { t } = useTranslation();

  return (
    <Text className={`${className}`}>
      {/* {JSON.stringify(time)} */}
      {time.hours > 0 ? (!short ? time.hours0 : time.hours) : ""}
      {time.hours > 0 ? (!short ? t("time.hours") + " " : ":") : ""}
      {!short ? time.minutes : time.minutes0}
      {!short ? t("time.minutes") + " " : ":"}
      {!hideSeconds ? time.seconds0 : ""}
      {!hideSeconds ? (!short ? t("time.seconds") + " " : "") : ""}
    </Text>
  );
}
