import { View, Text, TextInputProps } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import UIButton from "./UIButton";
import SIcon from "./SIcon";
import { getNoun } from "@/utils/utils";

export type IUICounterProps = TextInputProps & {
  max: number;
  initValue: number;
  disable?: boolean;
  onChangeValue: (value: number) => void;
};

export default function UICounter({
  max,
  value,
  initValue,
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
        disabled={parseInt(value) <= initValue || disable}
        onPress={() => onChangeValueCounter(-1)}
      >
        <View className="">
          {/* <Text className="text-s-900 dark:text-s-200 tet-xl">-</Text> */}
          <SIcon path="iMinusLg" size={25} />
        </View>
      </UIButton>
      <TextInput
        className="flex-auto text-center text-4xl font-bold bg-white dark:bg-s-900 rounded-lg px-4 py-2 text-s-900 dark:text-s-100 placeholder:text-s-500 focus:border-p-500"
        {...rest}
        value={value}
        readOnly
      />
      <Text className="absolute -bottom-1.5 left-0 right-0 text-center text-lg text-s-500 dark:text-s-200">
        {getNoun(parseInt(value), "бал", "бала", "балов")}
      </Text>
      <UIButton
        type="secondary"
        disabled={parseInt(value) >= max || disable}
        onPress={() => onChangeValueCounter(1)}
      >
        <View className="">
          {/* <Text className="text-s-900 dark:text-s-200 tet-xl">-</Text> */}
          <SIcon path="iPlusLg" size={25} />
        </View>
      </UIButton>
    </View>
  );
}
