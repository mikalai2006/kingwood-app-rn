import { Text, type TextInputProps, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import UILabel from "./UILabel";

export type UIInputProps = TextInputProps & {
  title?: string;
  icon?: string;
  twClass?: string;
  children?: any;
};

export default function UIInput({
  title,
  icon,
  children,
  hitSlop: number = 10,
  ...rest
}: UIInputProps) {
  return (
    <View className="flex flex-col items-stretch justify-center">
      {/* {props.loading ? (
            <ActivityIndicator size={25} color={colorLoader} />
          ) : props.icon ? (
            <View>
              <SIcon path={props.icon} size={25} tw={classIcon} />
            </View>
          ) : null} */}
      <UILabel text={title} />
      <TextInput
        className="text-xl bg-white dark:bg-s-900 rounded-lg border border-s-200 dark:border-s-700 px-4 py-2 text-s-900 dark:text-s-300 placeholder:text-s-500 focus:border-p-500"
        {...rest}
      />
    </View>
  );
}
