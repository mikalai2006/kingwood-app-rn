import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/utils/Colors";

export interface RButtonProps {
  text?: string;
  disabled?: boolean;
  onPress?: () => void;
  loading?: boolean;
  className?: string;
  children?: any;
  customClass?: string;
}

export default function RButton(props: RButtonProps) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      activeOpacity={0.8}
      className={
        props?.customClass
          ? props.customClass
          : `${props.className} p-4 rounded-lg flex items-center ${
              props.disabled ? "bg-s-200 dark:bg-s-700" : "bg-p-500"
            }`
      }
    >
      {props.children || (
        <View className="flex flex-row gap-x-2">
          {props.loading ? (
            <ActivityIndicator size="small" color={Colors.p[50]} />
          ) : (
            ""
          )}
          <Text
            className={`text-p-50 text-xl ${
              props.disabled ? "text-s-300 dark:text-s-500" : "text-p-50"
            }`}
          >
            {props.text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
