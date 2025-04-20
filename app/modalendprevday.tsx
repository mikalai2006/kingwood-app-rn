import Card from "@/components/Card";
import RText from "@/components/r/RText";
import UIButton from "@/components/ui/UIButton";
import UIInput from "@/components/ui/UIInput";
import { useTaskWorkerUtils } from "@/hooks/useTaskWorkerUtils";
import { useAppSelector } from "@/store/hooks";
import { workHistory } from "@/store/storeSlice";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import dayjs, { formatDate, formatDateTime, formatTime } from "@/utils/dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import { isWriteConsole } from "@/utils/global";
import { addStartNull } from "@/utils/utils";
import SIcon from "@/components/ui/SIcon";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";

export default function ModalEndPredDay() {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const { loading, onEndWorkTime } = useTaskWorkerUtils();
  const workHistoryFromStore = useAppSelector(workHistory);

  const [hourEnd, setHourEnd] = useState("0");
  const [minuteEnd, setMinuteEnd] = useState("0");

  useEffect(() => {
    setHourEnd(dayjs(workHistoryFromStore?.from).hour().toString());
    setMinuteEnd(dayjs(workHistoryFromStore?.from).minute().toString());
  }, [workHistoryFromStore]);

  const minHour = useMemo(
    () => dayjs(workHistoryFromStore?.from).hour(),
    [workHistoryFromStore]
  );
  const minMinute = useMemo(
    () => dayjs(workHistoryFromStore?.from).minute(),
    [workHistoryFromStore]
  );

  const onInputHour = useCallback((value: string) => {
    if (!value) value = "0";
    let v = parseInt(value);
    if (v < 0) {
      v = 0;
    } else if (v > 24) {
      v = 24;
    }
    const h = addStartNull(v);
    h && setHourEnd(h);
  }, []);

  const onInputMinute = (value: string) => {
    if (!value) value = "0";
    let v = parseInt(value);
    if (v < 0) {
      v = 0;
    } else if (v > 59) {
      v = 59;
    }
    const m = addStartNull(v);
    m && setMinuteEnd(m);
  };

  const dateTimeEnd = useMemo(
    () =>
      dayjs(workHistoryFromStore?.from)
        .set("hours", parseInt(hourEnd))
        .set("minute", parseInt(minuteEnd)),
    [hourEnd, minuteEnd, workHistoryFromStore]
  );

  const isAfter = useMemo(
    () =>
      dayjs(dateTimeEnd)
        .utc()
        .isAfter(dayjs(workHistoryFromStore?.from), "minute"),
    [dateTimeEnd, workHistoryFromStore]
  );

  const onClosePrevDay = async () => {
    // isWriteConsole &&
    //   console.log(
    //     addStartNull(hourEnd),
    //     addStartNull(minuteEnd),
    //     dateTimeEnd,
    //     isAfter
    //   );
    onEndWorkTime(dateTimeEnd).then(() => {
      router.back();
    });
  };

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950 p-4">
      <SafeAreaView style={{ flex: 1 }}>
        <Card className="gap-4">
          <RText
            text={t("titlePrevDay", {
              prevDay: dayjs(workHistoryFromStore?.from).format(formatDate),
            })}
          />

          <View className="flex flex-row gap-4 items-center rounded-lg p-4 bg-p-100 dark:bg-p-800">
            <View>
              <SIcon
                path="iWarning"
                size={30}
                color={colorScheme === "dark" ? Colors.p[200] : Colors.p[700]}
              />
            </View>
            <View className="flex-auto">
              <Text className="text-p-700 dark:text-p-200">
                {t("detectPrevDay")}
              </Text>
            </View>
          </View>
          <View className="mt-6 bg-p-100 dark:bg-s-700 p-4 rounded-lg">
            <Text className="text-lg text-black dark:text-white">
              {t("textTimeEndPrevDayBefore", {
                timePrevDay: dayjs(workHistoryFromStore?.from).format(
                  formatDate
                ),
              })}
            </Text>
            <View className="flex flex-row items-center gap-2 pt-4">
              <UIInput
                className="w-20 bg-white dark:bg-s-200 p-4 rounded-lg text-xl"
                keyboardType="number-pad"
                value={hourEnd}
                title={t("hourEnd")}
                onChangeText={onInputHour}
              />
              <View>
                <Text className="text-black dark:text-s-400 mt-4 text-2xl">
                  :
                </Text>
              </View>
              <UIInput
                className="w-20 bg-white dark:bg-s-200 p-4 rounded-lg text-xl"
                keyboardType="number-pad"
                value={minuteEnd}
                title={t("minuteEnd")}
                onChangeText={onInputMinute}
              />
            </View>
            <Text className="text-lg mt-4 text-black dark:text-white">
              {t("textTimeEndPrevDayAfter")}
            </Text>
          </View>

          {/* <UIButton
          type="secondary"
          text="Сделать фото"
          icon="iCamera"
          onPress={() => {
            router.back();
            router.setParams({ typePicker: "photo" });
          }}
        />*/}
          {isAfter ? null : (
            <View className="flex flex-row gap-4 items-center rounded-lg p-4 bg-r-300">
              <View>
                <SIcon path="iWarning" size={30} color={Colors.r[700]} />
              </View>
              <View className="flex-auto">
                <Text className="text-base text-r-900">
                  {t("timeMustBeAfter", {
                    from: dayjs(workHistoryFromStore?.from).format(formatTime),
                  })}
                </Text>
              </View>
            </View>
          )}

          <UIButton
            type="primary"
            disabled={hourEnd == "0" || minuteEnd == "" || !isAfter}
            loading={loading}
            text={t("btnEndPrevDay")}
            onPress={onClosePrevDay}
          />
        </Card>
      </SafeAreaView>
    </View>
  );
}
