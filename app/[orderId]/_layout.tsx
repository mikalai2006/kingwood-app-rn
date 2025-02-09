import React, { useMemo } from "react";
import { Text, View } from "react-native";

import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

import { Colors } from "@/utils/Colors";
import { useLocalSearchParams, withLayoutContext } from "expo-router";
import { useColorScheme } from "nativewind";

import LotsTabBar from "@/components/navigate/LotsTabBar";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { useQuery } from "@realm/react";
import { OrderSchema } from "@/schema";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import ImageSlider from "@/components/image/ImageSlider";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const userFromStore = useAppSelector(user);
  let { orderId } = useLocalSearchParams<{ orderId: string }>();

  const allOrders = useQuery(OrderSchema);
  const allObjects = useQuery(ObjectsSchema);

  const currentOrder = useMemo(
    () => allOrders.find((x) => x._id.toString() === orderId),
    [orderId]
  );

  const object = useMemo(
    () => allObjects.find((x) => x._id.toString() === currentOrder?.objectId),
    [orderId, currentOrder?.objectId]
  );

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        {/* <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor:
              colorScheme === "dark" ? Colors.s[950] : Colors.s[100],
          },
          headerTintColor:
            colorScheme === "dark" ? Colors.s[200] : Colors.s[800],
        }}
        initialRouteName="notify"
      >
        <Stack.Screen
          name="notify"
          options={{
            headerShown: false,
            // presentation: "transparentModal",
            animation: "slide_from_right",
          }}
        />
      </Stack> */}
        <View className="flex flex-row items-center">
          <View className="flex-none">
            <UIButtonBack />
          </View>
          <View className="flex-auto">
            <Text className="px-4 text-lg leading-5 text-s-800 dark:text-s-200">
              {object?.name}, №{currentOrder?.number} - {currentOrder?.name}
            </Text>
          </View>
        </View>
        <View className="flex-1 -mt-2">
          <MaterialTopTabs tabBar={(props) => <LotsTabBar {...props} />}>
            <MaterialTopTabs.Screen
              name="index"
              options={{
                title: t("title.info"),
                // tabBarIcon: ({ color, focused }) => (
                //   <View className="absolute top-4 right-3">
                //     <BadgeTabMessage />
                //   </View>
                // ),
              }}
            />
            {/* <MaterialTopTabs.Screen
            name="question"
            options={{
              title: "Вопросы",
              tabBarIcon: ({ color, focused }) => (
                <View className="absolute top-4 right-3">
                  <BadgeTabQuestion />
                </View>
              ),
            }}
          /> */}
            <MaterialTopTabs.Screen
              name="message"
              options={{
                title: t("title.message"),
                // tabBarIcon: ({ color, focused }) => (
                //   <View className="absolute top-4 right-3">
                //     <BadgeTabNotify />
                //   </View>
                // ),
              }}
            />
          </MaterialTopTabs>
        </View>
      </SafeAreaView>
    </View>
  );
}
