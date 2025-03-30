import React from "react";
import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const { colorScheme } = useColorScheme();
  const userFromStore = useAppSelector(user);

  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor:
            colorScheme === "dark" ? Colors.s[950] : Colors.s[100],
        },
        headerTintColor: colorScheme === "dark" ? Colors.s[200] : Colors.s[800],
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          // presentation: "transparentModal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="[day]"
        options={{
          headerShown: false,
          // presentation: "transparentModal",
          animation: "slide_from_right",
        }}
      />
      {/* <Stack.Screen name="archive" options={{ headerShown: true, title: "" }} /> */}
    </Stack>
  );
}
