import { Pressable, Text, View } from "react-native";
import { useQuery } from "@realm/react";
import { useColorScheme } from "nativewind";
import { OrderSchema, PaySchema, WorkHistorySchema } from "@/schema";
import dayjs from "@/utils/dayjs";
import { useAppSelector } from "@/store/hooks";
import { financyFilter, user, workHistory } from "@/store/storeSlice";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../Card";
import { TimerData } from "@/hooks/useTimer";
import usePay from "@/hooks/usePay";
import SIcon from "../ui/SIcon";
import { groupBy } from "@/utils/utils";
import { IOrder, IWorkHistory } from "@/types";
import { BSON } from "realm";
import { ObjectsSchema } from "@/schema/ObjectsSchema";

export type FinancyMonthTotalProps = {
  from: string;
  to: string;
  time: TimerData;
};

export function FinancyMonthTotal({ from, to, time }: FinancyMonthTotalProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);

  const financyFilterFromStore = useAppSelector(financyFilter);

  const workHistoryFromStore = useAppSelector(workHistory);

  const allOrders = useQuery(OrderSchema);
  const allObjects = useQuery(ObjectsSchema);

  usePay({
    workerId: userFromStore?.id ? [userFromStore?.id] : undefined,
    month: dayjs(from).month(),
    year: dayjs(from).year(),
  });

  const allPayMonth = useQuery(
    PaySchema,
    (items) =>
      items.filtered(
        "workerId == $0 AND month == $1 AND year == $2",
        userFromStore?.id,
        dayjs(from).month(),
        dayjs(from).year()
      ),
    [from]
  );

  const totalPay = useMemo(() => {
    if (!userFromStore) {
      return 0;
    }

    return allPayMonth.reduce((a, b) => a + b.total, 0);
  }, [allPayMonth]);

  const allWorkHistory = useQuery(WorkHistorySchema, (items) =>
    items.filtered("workerId == $0", userFromStore?.id)
  );

  const allWorkHistoryMonth = useMemo(() => {
    return allWorkHistory
      .filter(
        (x) =>
          dayjs(x.to).year() > 1 &&
          dayjs(x.date).isBetween(
            dayjs(from).startOf("day"),
            dayjs(to).endOf("day"),
            "day",
            "[]"
          )
      )
      .sort((a, b) => a.from.localeCompare(b.from));
  }, [allWorkHistory, to, from]);

  const groupsWorkHistoryMonth = useMemo(() => {
    const _group: { [key: string]: IWorkHistory[] } = groupBy(
      allWorkHistoryMonth,
      "orderId"
    );

    const _result: {
      orderId: string;
      order: OrderSchema;
      total: number;
      object: ObjectsSchema;
      totalTime: number;
    }[] = [];

    for (const orderId in _group) {
      const _total = _group[orderId].reduce((ac, el) => {
        return ac + el.total;
      }, 0);
      const _totalTime = _group[orderId].reduce((ac, el) => {
        return ac + el.totalTime;
      }, 0);
      const _order = allOrders.filtered(
        "_id == $0",
        new BSON.ObjectId(orderId)
      )[0];
      const _object = allObjects.filtered(
        "_id == $0",
        new BSON.ObjectId(_order.objectId)
      )[0];
      _result.push({
        orderId,
        order: _order,
        object: _object,
        total: _total,
        totalTime: _totalTime,
      });
    }

    return _result;
  }, [allWorkHistoryMonth]);

  const isToday = useMemo(() => {
    return (
      dayjs(workHistoryFromStore?.date).month() ===
      financyFilterFromStore.monthIndex
    );
  }, [workHistoryFromStore, to, from]);

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
  }, [time]);

  const zpFullDay = useMemo(() => {
    // if (!allWorkHistoryMonth.length) {
    //   return;
    // }

    // return allWorkHistoryToday.map((x) => {
    //   const to =
    //     dayjs(x.to).year() > 1 ? x.to : dayjs(new Date()).utc().format();

    //   const _timeWorkMinutes = dayjs(to).diff(dayjs(x.from), "minutes", true);
    //   return Math.ceil(_timeWorkMinutes) * (x.oklad / 60);
    // });
    const totalFromDb = allWorkHistoryMonth.reduce((a, b) => a + b.total, 0);
    return totalFromDb + (isToday ? Math.ceil(zp) : 0);
  }, [allWorkHistoryMonth, zp, time]);

  const [open, setOpen] = useState(false);

  return (
    <Pressable onPress={() => setOpen(!open)}>
      <Card className="mt-1">
        {open && (
          <View className="border-b border-black/10 dark:border-white/10 mb-2">
            {groupsWorkHistoryMonth.map((m) => (
              <View key={m.orderId} className="flex flex-row gap-2 mb-1">
                <Text
                  className={
                    "flex-auto font-medium " +
                    (m.total > 0
                      ? "text-s-800 dark:text-s-300 "
                      : "text-r-600 dark:text-r-400")
                  }
                >
                  {m.order.number ? "№" + m.order.number + " " : ""}
                  {m.order.name}
                  <Text className="text-g-300 dark:text-s-500">
                    , {m.object.name}
                  </Text>
                </Text>
                <Text
                  className={
                    m.total > 0
                      ? "text-gr-600 dark:text-p-300 font-medium"
                      : "text-r-600 dark:text-r-400 font-medium"
                  }
                >
                  {(m.total || 0).toLocaleString("ru-RU")} ₽
                </Text>
              </View>
            ))}

            {/* <View className="flex flex-row gap-2 mb-1">
              <Text className="flex-auto text-s-800 dark:text-s-300">
                {t("totalBy", {
                  date: `${financyFilterFromStore.monthText}, ${financyFilterFromStore.year}`,
                })}
              </Text>
              <Text className="text-p-600 dark:text-p-300">
                {(zpFullDay || 0).toLocaleString("ru-RU")} ₽
              </Text>
            </View> */}
            {allPayMonth.map((pay) => (
              <View
                key={pay._id.toString()}
                className="flex flex-row gap-2 mb-1"
              >
                <Text
                  className={
                    "flex-auto " +
                    (pay.total > 0
                      ? "text-s-800 dark:text-s-300 "
                      : "text-r-600 dark:text-r-400")
                  }
                >
                  {pay.name}
                </Text>
                <Text
                  className={
                    pay.total > 0
                      ? "text-p-600 dark:text-p-300 font-medium"
                      : "text-r-600 dark:text-r-400 font-medium"
                  }
                >
                  {pay.total.toLocaleString("ru-RU")} ₽
                </Text>
              </View>
            ))}
          </View>
        )}
        <View className="flex flex-row gap-2 items-center">
          <Text className="flex-auto text-lg leading-6 text-s-800 dark:text-s-300">
            {t("totalZpBy", {
              date: `${financyFilterFromStore.monthText}, ${financyFilterFromStore.year}`,
            })}
            :
          </Text>
          <Text className="text-2xl font-bold leading-7 text-p-600 dark:text-p-300">
            {(zpFullDay + totalPay || 0).toLocaleString("ru-RU")} ₽
          </Text>
          <View>
            <SIcon path={open ? "iChevronUp" : "iChevronDown"} size={20} />
          </View>
        </View>
        {/* {msFullDay && (
          <View className="flex flex-row gap-2">
            <Text className="text-lg leading-6 text-s-500 dark:text-s-400">
              {t("totalTimeDay")}:
            </Text>
            <TaskWorkerTime
              className="text-lg leading-6 text-s-800 dark:text-s-200"
              time={getObjectTime(msFullDay)}
            />
          </View>
        )} */}
      </Card>
    </Pressable>
  );
}
