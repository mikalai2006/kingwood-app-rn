import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";

import TimePicker from "@/components/schedule/TimePicker";
import { ISchedule } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { schedules, setSchedules } from "@/store/storeSlice";
import dayjs from "@/utils/dayjs";
import UIButton from "../ui/UIButton";
import { useTranslation } from "react-i18next";
import { addStartNull } from "@/utils/utils";

export interface ISchedukeItem {
  item: ISchedule;
  index: number;
}

const ScheduleItem = (props: ISchedukeItem) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const schedulesFromStore = useAppSelector(schedules);

  const [show, setShow] = useState(false);

  const onSetTime = (date: string | undefined) => {
    if (!date) {
      return;
    }

    const _allSchedules = JSON.parse(JSON.stringify(schedulesFromStore));
    _allSchedules[props.index].trigger = Object.assign(
      {},
      schedulesFromStore[props.index].trigger,
      {
        hour: dayjs(date).hour(),
        minute: dayjs(date).minute(),
      }
    );
    // console.log("new schedules: ", _allSchedules, " index=", props.index, {
    //   hour: dayjs(date).hour(),
    //   minute: dayjs(date).minute(),
    // });

    dispatch(setSchedules(_allSchedules));
    setShow(false);
  };

  const onDelete = () => {
    Alert.alert(t("info.scheduleTitle"), t("info.scheduleDeleteText"), [
      {
        text: t("button.no"),
        onPress: () => {},
        style: "cancel",
      },
      {
        text: t("button.yes"),
        onPress: async () => {
          const _allSchedules = JSON.parse(JSON.stringify(schedulesFromStore));
          _allSchedules.splice(props.index, 1);

          dispatch(setSchedules(_allSchedules));
        },
      },
    ]);
  };

  return (
    <View>
      {show ? (
        <TimePicker
          callback={onSetTime}
          onClose={() => {
            setShow(false);
          }}
        />
      ) : null}
      <TouchableOpacity
        onPress={() => setShow(true)}
        className=" border-b border-s-100 dark:border-s-800"
      >
        <View className="flex flex-row items-center gap-2">
          <View className="flex-auto">
            <Text className="text-2xl font-medium text-black dark:text-s-200">
              {addStartNull(props.item.trigger?.hour)}:
              {addStartNull(props.item.trigger?.minute)}
            </Text>
          </View>
          <View className="">
            <UIButton
              type="link"
              icon="iDelete"
              onPress={() => {
                onDelete();
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ScheduleItem;
