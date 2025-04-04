import { View, Platform, Alert } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "@/utils/dayjs";
import {
  ANDROID_MODE,
  DAY_OF_WEEK,
  IOS_MODE,
  ANDROID_DISPLAY,
  IOS_DISPLAY,
} from "@react-native-community/datetimepicker/src/constants";
import { Dayjs } from "dayjs";

const MODE_VALUES = Platform.select({
  ios: Object.values(IOS_MODE),
  android: Object.values(ANDROID_MODE),
  windows: [],
});

const DISPLAY_VALUES = Platform.select({
  ios: Object.values(IOS_DISPLAY),
  android: Object.values(ANDROID_DISPLAY),
  windows: [],
});

const MINUTE_INTERVALS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30];
const DESIGNS = ["default", "material"];
const INPUT_MODES = ["default", "keyboard"];

export interface ITimePicker {
  callback: (date: string | undefined) => void;
  onClose: () => void;
}

const TimePicker = (props: ITimePicker) => {
  const [date, setDate] = useState(dayjs().toDate());
  const [mode, setMode] = useState(MODE_VALUES[0]);
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(dayjs().toDate());
  const [design, setDesign] = useState(DESIGNS[0]);

  // const onChange = (event, selectedDate) => {
  //   if (Platform.OS === "android") {
  //     setShow(false);
  //   }
  //   if (event.type === "dismissed") {
  //     Alert.alert(
  //       "picker was dismissed",
  //       undefined,
  //       [
  //         {
  //           text: "great",
  //         },
  //       ],
  //       { cancelable: true }
  //     );
  //     return;
  //   }

  //   if (event.type === "neutralButtonPressed") {
  //     setDate(new Date(0));
  //   } else {
  //     setDate(selectedDate);
  //   }
  // };

  const onTimeChange = (event: any, newTime?: Date) => {
    if (event.type === "dismissed") {
      props.onClose();
      // Alert.alert(
      //   "picker was dismissed",
      //   undefined,
      //   [
      //     {
      //       text: "great",
      //     },
      //   ],
      //   { cancelable: true }
      // );
      return;
    }

    if (Platform.OS === "android") {
      props.onClose();
      newTime && setTime(newTime);

      console.log(newTime?.toString());
      props.callback(newTime?.toString());
    }
  };
  return (
    <View>
      <DateTimePicker
        mode="time"
        value={time}
        style={{
          width: 400,
          opacity: 1,
          height: 30,
          marginTop: 50,
          backgroundColor: "red",
        }}
        onChange={onTimeChange}
        onPointerCancel={() => {
          console.log("Cancel");
        }}
        is24Hour={true}
        fullscreen={false}
        minuteInterval={1}
      />
    </View>
  );
};

export default TimePicker;
