import dayjs from "@/utils/dayjs";
import { isWriteConsole } from "@/utils/global";
import { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TimerProps = {
  startTime?: string | number;
  durationDays: number;
  addedMs?: number;
};
export type TimerData = {
  totalMinutes: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  days0: string;
  hours0: string;
  minutes0: string;
  seconds0: string;
  date: Dayjs;
};

function getObjectTime(ms: number, now?: dayjs.Dayjs) {
  const checkNum = (num: number) => {
    return num < 0 ? 0 : num;
  };

  // ms = Math.abs(ms);

  const daysMs = ms % (24 * 60 * 60 * 1000);
  const hoursMs = ms % (60 * 60 * 1000);
  const minutesMs = ms % (60 * 1000);

  const days = checkNum(Math.floor(ms / (24 * 60 * 60 * 1000)));
  const hours = checkNum(Math.floor(daysMs / (60 * 60 * 1000)));
  const minutes = checkNum(Math.floor(hoursMs / (60 * 1000)));
  const seconds = checkNum(Math.floor(minutesMs / 1000));
  const totalMinutes = checkNum(ms / (60 * 1000));

  return {
    totalMinutes,
    days,
    hours,
    minutes,
    seconds,
    days0: days > 9 ? days.toString() : "0" + days,
    hours0: hours > 9 ? hours.toString() : "0" + hours,
    minutes0: minutes > 9 ? minutes.toString() : "0" + minutes,
    seconds0: seconds > 9 ? seconds.toString() : "0" + seconds,
    date: now ? now : dayjs(new Date()).utc(true),
  };
}

const useTimer = function ({ startTime, durationDays, addedMs }: TimerProps) {
  //   console.log("timer");

  const [time, setTime] = useState<TimerData>({
    totalMinutes: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    days0: "00",
    hours0: "00",
    minutes0: "00",
    seconds0: "00",
    date: dayjs(new Date()),
  });

  if (!startTime) {
    startTime = dayjs(new Date()).millisecond();
    // console.log("Not startTime=", startTime);
    // return {
    //   time: 0,
    //   days: time.days,
    //   hours: 0,
    //   minutes: 0,
    //   seconds: 0,
    //   isTimerComplete: true,
    // };
  }

  // if (addedMs) {
  //   startTime = startTime + addedMs;
  // }
  // if (!durationDays) {
  //   durationDays = 10;
  // }

  const future = dayjs(startTime).add(durationDays, "days"); //, "YYYY-MM-DD HH:mm Z"
  // console.log(startTime, future.format());

  const setDate = () => {
    const now = dayjs(new Date()); //.utc(true);
    const diff = now.diff(future) + (addedMs || 0);
    // console.log("now=", now, " future=", future);

    const diffTime = getObjectTime(diff, now);
    setTime(diffTime);
  };

  let interval: NodeJS.Timeout | null = null;

  useEffect(() => {
    interval = setInterval(setDate, 1000);

    if (startTime === 0) {
      interval && clearInterval(interval);
      isWriteConsole && console.log("Stop timer");
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [startTime, addedMs]);

  const onClearTimer = useCallback(() => {
    interval && clearInterval(interval);
  }, [interval]);

  const hours = useMemo(
    () => (time ? (time?.hours > 9 ? time?.hours : "0" + time?.hours) : ""),
    [time?.hours]
  );
  const minutes = useMemo(
    () =>
      time ? (time?.minutes > 9 ? time?.minutes : "0" + time?.minutes) : "",
    [time?.minutes]
  );
  const seconds = useMemo(
    () =>
      time ? (time?.seconds > 9 ? time?.seconds : "0" + time?.seconds) : "",
    [time?.seconds]
  );
  const isTimerComplete = useMemo(
    () =>
      time.seconds === 0 &&
      time.days === 0 &&
      time.days === 0 &&
      time.hours === 0
        ? true
        : false,
    [time]
  );

  return {
    time,
    days: time.days,
    hours,
    minutes,
    seconds,
    isTimerComplete,

    onClearTimer,
  };
};

export { useTimer, getObjectTime };
