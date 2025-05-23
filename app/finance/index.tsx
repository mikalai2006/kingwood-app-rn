import { View, ActivityIndicator, Text } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/store/hooks";
import { financyFilter, user, workHistory } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useTimer } from "@/hooks/useTimer";
import { useEffect, useMemo } from "react";
import dayjs, { formatDate } from "@/utils/dayjs";
import { FinancyDate } from "@/components/financy/FinancyDate";
import { addStartNull } from "@/utils/utils";
import { FinancyMonthItem } from "@/components/financy/FinancyMonthItem";
import { FinancyMonthTotal } from "@/components/financy/FinancyMonthTotal";
import useWorkHistory from "@/hooks/useWorkHistory";
import UIButtonBack from "@/components/ui/UIButtonBack";

export default function FinanceIndex() {
  const { t } = useTranslation();

  const workHistoryFromStore = useAppSelector(workHistory);

  const userFromStore = useAppSelector(user);

  const financyFilterFromStore = useAppSelector(financyFilter);

  // const allWorkTime = useQuery(WorkTimeSchema);

  const from = useMemo(
    () =>
      dayjs(
        `01.${addStartNull(financyFilterFromStore?.month)}.${
          financyFilterFromStore?.year
        }`,
        formatDate
      ).format(),
    [financyFilterFromStore]
  );

  const to = useMemo(
    () =>
      dayjs(
        `${dayjs(
          `${financyFilterFromStore?.year}-${addStartNull(
            financyFilterFromStore?.month
          )}-25`
        ).daysInMonth()}.${addStartNull(financyFilterFromStore?.month)}.${
          financyFilterFromStore?.year
        }`,
        formatDate
      )
        .endOf("day")
        .format(),
    [financyFilterFromStore]
  );

  const { isLoading } = useWorkHistory(
    {
      from,
      to,
      workerId: userFromStore ? [userFromStore?.id] : undefined,
    },
    [from, to, userFromStore]
  );

  const months = useMemo(
    () =>
      [
        ...Array(
          dayjs(
            `${financyFilterFromStore?.year}-${addStartNull(
              financyFilterFromStore?.month
            )}-25`
          ).daysInMonth()
        ).keys(),
      ].map((x) => ++x),
    [financyFilterFromStore]
  );

  const { time, onClearTimer } = useTimer({
    startTime: workHistoryFromStore?.from || 0,
    durationDays: 0,
  });

  useEffect(() => {
    if (!workHistoryFromStore) {
      onClearTimer();
    }
  }, [workHistoryFromStore]);

  const [dayWeek, month, year] = dayjs(from)
    .locale("ru")
    .format("dddd, MMMM, YYYY")
    .split(",");

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row items-center gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            <Text className="text-lg leading-5 text-s-800 dark:text-s-300 font-medium">
              {t("title.financyByMonth", {
                dateToday: `${month} ${dayjs(from).year()}`,
              })}
            </Text>
          </View>
        </View>
        <View className="px-4 mb-4">
          <View className="mb-1">
            <FinancyDate />
          </View>
          <FinancyMonthTotal time={time} from={from} to={to} />
        </View>
        <View className="flex-1 bg-s-200 dark:bg-s-950">
          <View
            className="flex-1"
            key={`${financyFilterFromStore?.year}-${financyFilterFromStore?.month}`}
          >
            {/* <UIButton
              type="secondary"
              text="yersterday"
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/finance/[day]",
                  params: {
                    day: date.subtract(1, "day").format(),
                  },
                });
              }}
            />
            <UIButton
              type="secondary"
              text="today"
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/finance/[day]",
                  params: {
                    day: date.format(),
                  },
                });
              }}
            /> */}
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={months}
                keyExtractor={(item) =>
                  `${financyFilterFromStore?.year}-${
                    financyFilterFromStore?.month
                  }-${item.toString()}`
                }
                renderItem={({ item }) => (
                  <FinancyMonthItem
                    key={item.toString()}
                    time={time}
                    date={dayjs(
                      `${financyFilterFromStore?.year}-${addStartNull(
                        financyFilterFromStore?.month
                      )}-${addStartNull(item)}`
                    ).format()}
                  />
                )}
              />
              // months.map((x) => (
              //     <FinancyMonthItem
              //       key={x.toString()}
              //       date={dayjs(
              //         `${financyFilterFromStore?.year}-${addStartNull(
              //           financyFilterFromStore?.month
              //         )}-${addStartNull(x)}`
              //       ).format()}
              //     />
              //   ))
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
