import React from "react";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="answer/[questionId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
