import { View, Text, TextInputProps } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import UIButton from "./UIButton";
import SIcon from "./SIcon";
import { getNoun } from "@/utils/utils";
import { Colors } from "@/utils/Colors";

export type IUICounterProps = TextInputProps & {
  max: number;
  min: number;
  disable?: boolean;
  onChangeValue: (value: number) => void;
};

export default function UICounter({
  max,
  value,
  min,
  disable,
  onChangeValue,
  hitSlop: number = 10,
  ...rest
}: IUICounterProps) {
  function onChangeValueCounter(increment: number): void {
    const newValue = value ? parseInt(value) + increment : increment;
    onChangeValue(newValue);
  }

  return (
    <View className="flex flex-row items-center">
      {/* <Text>
        {JSON.stringify({
          max,
          value,
          initValue,
          onChangeValue,
          hitSlop: (number = 10),
        })}
      </Text> */}
      <UIButton
        type="secondary"
        disabled={parseInt(value || "0") <= min || disable}
        onPress={() => onChangeValueCounter(-1)}
        icon="iMinusLg"
      />
      <TextInput
        className="flex-auto text-center text-4xl font-bold bg-white dark:bg-s-900 rounded-lg px-4 py-2 text-p-600 dark:text-p-300 placeholder:text-s-500 focus:border-p-500"
        {...rest}
        value={value}
        readOnly
      />
      <Text className="absolute -bottom-1.5 left-0 right-0 text-center text-lg text-p-600 dark:text-p-200">
        {getNoun(parseInt(value || "0"), "час", "часа", "часов")}
      </Text>
      <UIButton
        type="secondary"
        disabled={parseInt(value || "0") >= max || disable}
        onPress={() => onChangeValueCounter(1)}
        icon="iPlusLg"
      />
    </View>
  );
}
