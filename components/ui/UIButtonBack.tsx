import { View, Text } from "react-native";
import React from "react";
import UIButton from "./UIButton";
import { router } from "expo-router";
import SIcon from "./SIcon";
import { useColorScheme } from "nativewind";
import { Colors } from "@/utils/Colors";

const UIButtonBack = () => {
  const { colorScheme } = useColorScheme();

  return (
    <UIButton
      type="link"
      onPress={() => {
        router.back();
      }}
      className="bg-s-200/20 dark:bg-s-950/20 p-2 rounded-lg"
    >
      <View className="">
        <SIcon
          path="iArrowLeftAndroid"
          size={25}
          color={colorScheme === "dark" ? Colors.s[100] : Colors.s[950]}
        />
      </View>
    </UIButton>
  );
};

export default UIButtonBack;
