import React from "react";
import { View } from "react-native";

import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

import { Colors } from "@/utils/Colors";
import { router, Stack, withLayoutContext } from "expo-router";
import { useColorScheme } from "nativewind";

import UIButton from "@/components/ui/UIButton";
import { SafeAreaView } from "react-native-safe-area-context";
import LotsTabBar from "@/components/navigate/LotsTabBar";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

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
        name="[id]"
        options={{
          headerShown: false,
          // presentation: "transparentModal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="completed"
        options={{ headerShown: true, title: t("title.archiveOrder") }}
      />
    </Stack>
  );
  // (
  //   <Stack
  //     screenOptions={{
  //       headerTitleAlign: "center",
  //       headerStyle: {
  //         backgroundColor:
  //           colorScheme === "dark" ? Colors.s[950] : Colors.white,
  //       },
  //     }}
  //   >
  //     <Stack.Screen
  //       name="index"
  //       // listeners={{
  //       //   focus: () => {
  //       //     console.log("focus");
  //       //   },
  //       // }}
  //       options={{
  //         title: "Мои лоты",
  //         headerTitleAlign: "left",
  //         headerTitleStyle: {
  //           color: colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
  //         },
  //         headerRight: () => (
  //           <View className="mb-3">
  //             <UIButton
  //               text="Добавить"
  //               type="secondary"
  //               icon="iPlus"
  //               onPress={() => router.push("/create")}
  //             />
  //           </View>
  //         ),
  //       }}
  //     />
  //     <Stack.Screen
  //       name="create"
  //       options={{
  //         title: "Редактор лота",
  //         headerTitleAlign: "center",
  //         headerTitleStyle: {
  //           color: colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
  //         },
  //         headerLeft: () => (
  //           <UIButton
  //             text="Мои лоты"
  //             type="secondary"
  //             icon="iArrowLeftAndroid"
  //             className="pl-0 pr-6"
  //             onPress={() => router.back()}
  //           />
  //         ),
  //       }}
  //     />
  //   </Stack>
  // );
}
