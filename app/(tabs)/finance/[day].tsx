import { View, Text, Alert, ActivityIndicator } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/store/hooks";
import { user, workTime } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useTimer } from "@/hooks/useTimer";
import { useEffect, useMemo } from "react";
import { useQuery } from "@realm/react";
import { WorkTimeSchema } from "@/schema";
import UseWorkTime from "@/hooks/useWorkTime";
import dayjs from "@/utils/dayjs";
import { useLocalSearchParams } from "expo-router";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { FinancyDay } from "@/components/financy/FinancyDay";

export default function FinanceDay() {
  const { day: dayFromParams } = useLocalSearchParams<{ day: string }>();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);

  const workTimeFromStore = useAppSelector(workTime);

  const allWorkTime = useQuery(WorkTimeSchema);

  const { isLoading } = UseWorkTime(
    {
      date: dayjs(dayFromParams).format(),
      workerId: [userFromStore.id],
    },
    []
  );

  // const currentWorkTime = useMemo(() => {
  //   return allWorkTime.find((x) =>
  //     dayjs(dayFromParams).isBetween(dayjs(x.from), dayjs(x.to), "day", "[]")
  //   );
  // }, []);

  const { time, onClearTimer } = useTimer({
    startTime: workTimeFromStore?.from || 0,
    durationDays: 0,
  });

  useEffect(() => {
    if (!workTimeFromStore) {
      onClearTimer();
    }
  }, [workTimeFromStore]);

  const [dayWeek, day, year] = dayjs(dayFromParams)
    .locale("ru")
    .format("dddd, D MMMM, YYYY")
    .split(",");

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row gap-2 px-4 mb-2 items-center">
          <UIButtonBack />
          <View className="flex-auto">
            <Text className="text-lg leading-5 text-s-800 dark:text-s-300 font-medium">
              {t("title.workTimeToday", {
                dateToday: `${day} ${year}`,
              })}
            </Text>
          </View>
        </View>
        <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
          {/* <View className="p-4">
            <Card>
              <UILabel text={t("title.today")} />
              <FinancyDay key={workTimeFromStore?.id} />
            </Card>
          </View> */}
          {/* <View className="flex flex-row px-2">
            <UIButton type="secondary">
              <View className="flex flex-row items-center">
                <SIcon path="iChevronLeft" size={20} />
                <Text className="text-lg text-s-500 dark:text-s-200">Prev</Text>
              </View>
            </UIButton>
            <View className="flex-auto"></View>
            {
              <UIButton type="secondary">
                <View className="flex flex-row items-center">
                  <Text className="text-lg text-s-500 dark:text-s-200">
                    Next
                  </Text>
                  <SIcon path="iChevronRight" size={20} />
                </View>
              </UIButton>
            }
          </View> */}
          <View className="p-4 mb-8">
            {/* <Card>
              <UILabel
                text={t("title.workTimeToday", {
                  dateToday: `${day} (${dayWeek})`,
                })}
              /> */}
            {/* <Text>{JSON.stringify(workTimeFromStore)}</Text> */}
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <FinancyDay
                currentWorkTime={workTimeFromStore}
                time={time}
                dayFromParams={dayFromParams}
              />
            )}
            {/* </Card> */}
          </View>
          {/* <View className="p-4" key={product?.id}>
            {isLoading ? (
              <>
                <SSkeleton className="h-72 bg-s-100 dark:bg-s-800 flex items-center justify-center">
                  <View className="flex-1 flex-row flex-wrap p-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <View key={item.toString()} className="h-32 w-1/3 p-2">
                        <SSkeleton className="flex-1 bg-s-50 dark:bg-s-900" />
                      </View>
                    ))}
                  </View>
                </SSkeleton>

                <SSkeleton className="mt-4 h-24 bg-s-100 dark:bg-s-800 flex items-center justify-center">
                  <ActivityIndicator size={30} color={Colors.s[500]} />
                </SSkeleton>

                <SSkeleton className="mt-4 h-48 bg-s-100 dark:bg-s-800 flex items-center justify-center" />
              </>
            ) : (
              <>
                <Text>Create</Text>
              </>
            )}
          </View> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
