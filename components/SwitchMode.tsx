import React from "react";

import { TouchableOpacity, Text, Platform } from "react-native";
import { useColorScheme } from "nativewind";

import { setModeTheme } from "@/store/storeSlice";
import { useAppDispatch } from "@/store/hooks";
import SIcon from "@/components/ui/SIcon";
import { setMode } from "@/utils/mode";
import UIButton from "./ui/UIButton";

export default function SwitchMode() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const dispatch = useAppDispatch();

  const onToggleDark = () => {
    toggleColorScheme();
    colorScheme &&
      dispatch(setModeTheme(colorScheme === "dark" ? "light" : "dark"));
    colorScheme && setMode(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <UIButton onPress={onToggleDark} type="link">
      <Text selectable={false} className="text-2xl">
        {colorScheme === "dark" ? (
          <SIcon path="iMoon" size={32} type="secondary" />
        ) : (
          <SIcon path="iSun" size={32} type="secondary" />
        )}
      </Text>
    </UIButton>
  );
}
