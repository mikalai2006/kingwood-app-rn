import React from "react";
import { Text, Pressable } from "react-native";

import { useColorScheme } from "nativewind";

export function ThemeChanger() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="flex-1 items-center justify-center dark:bg-slate-800 p-4 rounded-lg"
    >
      <Text selectable={false} className="text-red-500 dark:text-white">
        {`Try clicking me! ${colorScheme === "dark" ? "🌙" : "🌞"}`}
      </Text>
    </Pressable>
  );
}
