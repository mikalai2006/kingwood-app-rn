import Card from "@/components/Card";
import RText from "@/components/r/RText";
import UIButton from "@/components/ui/UIButton";
import * as Notifications from "expo-notifications";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { schedules, setSchedules } from "@/store/storeSlice";
import dayjs from "@/utils/dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import { isWriteConsole } from "@/utils/global";

export default function ModalSchedule() {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const schedulesFromStore = useAppSelector(schedules);

  useEffect(() => {
    const _go = async () => {
      if (Platform.OS === "android") {
        // отменяем все события.
        const allSchedules =
          await Notifications.getAllScheduledNotificationsAsync();
        allSchedules.forEach((element) => {
          Notifications.cancelScheduledNotificationAsync(element.identifier);
        });
        isWriteConsole && console.log("allSchedules: ", allSchedules);
        isWriteConsole &&
          console.log("allSchedulesFromStore: ", schedulesFromStore);

        // устанавливаем новые события.
        for (const _schedule of schedulesFromStore) {
          isWriteConsole && console.log("schedule: ", _schedule);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Напоминание!",
              body: "Не забудь завершить рабочую сессию!",
            },
            trigger: Object.assign({}, _schedule.trigger),
            // {
            //   hour: 13,
            //   minute: 52,
            //   repeats: true,
            // },
          });
        }

        const allSchedules2 =
          await Notifications.getAllScheduledNotificationsAsync();
        console.log("allSchedules2: ", allSchedules2.length);
      }
    };

    _go();
  }, [schedulesFromStore]);

  // console.log("schedulesFromStore: ", schedulesFromStore);

  // const [hour, setHour] = useState(
  //   (schedulesFromStore[0]?.hour || 0).toString()
  // );
  // const [minute, setMinute] = useState(
  //   (schedulesFromStore[0]?.minute || "0").toString()
  // );

  // const onSaveSchedule = () => {
  //   dispatch(
  //     setSchedules([
  //       {
  //         trigger: {
  //           hour: parseInt(hour),
  //           minute: parseInt(minute),
  //           repeats: true,
  //         },
  //         id: schedulesFromStore.length + 1,
  //       },
  //     ])
  //   );
  // };

  const onAddSchedule = () => {
    dispatch(
      setSchedules([
        ...schedulesFromStore,
        {
          trigger: {
            hour: 0,
            minute: 0,
            repeats: true,
          },
          id: schedulesFromStore.length + 1,
        },
      ])
    );
  };

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950 p-4">
      <Card className="gap-4">
        {/* <RText text="Выберите месяц" /> */}
        <ScrollView className="flex">
          <View className="flex flex-col gap-4">
            {schedulesFromStore.map((item, index) => (
              <ScheduleItem item={item} index={index} key={index.toString()} />
            ))}
            {/* <TextInput
              className="min-w-full bg-s-200 p-2 rounded-lg"
              keyboardType="numeric"
              inputMode="numeric"
              value={hour}
              title={t("hour")}
              onChangeText={setHour}
            />
            <TextInput
              className="min-w-full bg-s-200 p-2 rounded-lg"
              keyboardType="numeric"
              inputMode="numeric"
              value={minute}
              title={t("minute")}
              onChangeText={setMinute}
            /> */}
          </View>
        </ScrollView>
        <UIButton
          type="secondary"
          text={t("button.add")}
          disabled={schedulesFromStore.length > 3}
          onPress={() => {
            onAddSchedule();
          }}
        />
        {/* <UIButton
          type="primary"
          text={t("button.save")}
          disabled={hour == 0 && minute == 0}
          onPress={() => {
            onSaveSchedule();
          }}
        /> */}
      </Card>
    </View>
  );
}
