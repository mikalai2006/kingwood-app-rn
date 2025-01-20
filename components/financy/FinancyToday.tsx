import { Text, View } from "react-native";
import { useQuery } from "@realm/react";
import { useColorScheme } from "nativewind";
import { WorkTimeSchema } from "@/schema";
import dayjs from "@/utils/dayjs";
import { useAppSelector } from "@/store/hooks";
import { user, workTime } from "@/store/storeSlice";
import { useEffect, useMemo } from "react";

export type FinancyTodayProps = {};

export function FinancyToday({}: FinancyTodayProps) {
  const { colorScheme } = useColorScheme();

  const userFromStore = useAppSelector(user);

  // const allWorkTimeToday = useMemo(() => {
  //   return allWorkTime.filter((x) =>
  //     dayjs(new Date())
  //       // .subtract(1, "day")
  //       .isBetween(
  //         dayjs(x.from).startOf("day"),
  //         dayjs(x.to).endOf("day"),
  //         "day",
  //         "[]"
  //       )
  //   );
  // }, []);

  const [dayWeek, day, year] = dayjs(new Date())
    .locale("ru")
    .format("dddd, D MMMM, YYYY")
    .split(",");

  // const order = useObject(OrderSchema, new BSON.ObjectId(orderId));

  return (
    <View className="p-2">
      <View className="flex flex-col items-center">
        {/* <View className="flex flex-row">
          <View className="flex-auto flex flex-row">
            <Text className="text-lg leading-8 font-medium text-p-600 dark:text-p-300">
              №
            </Text>
            <Text className="text-3xl leading-8 font-medium text-p-600 dark:text-p-300">
              {order.number}
            </Text>
          </View>
          <Text className="text-lg leading-5 font-medium text-p-600 dark:text-p-300">
            {order.object}
          </Text>
        </View> */}

        <Text className="text-lg leading-5 font-medium text-g-950 dark:text-s-100">
          {year}
        </Text>
        <Text className="text-3xl font-medium text-g-950 dark:text-s-100">
          {day}
        </Text>
        <Text className="text-lg leading-5 font-medium text-g-950 dark:text-s-100">
          {dayWeek}
        </Text>
      </View>
    </View>
  );
}
