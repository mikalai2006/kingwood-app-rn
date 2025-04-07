import { router, Tabs } from "expo-router";

import React, { useEffect, useMemo } from "react";

import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";
import UserTabInfo from "@/components/user/UserTabInfo";

import {
  activeTaskWorker,
  modeTheme,
  user,
  workHistory,
  workTime,
} from "@/store/storeSlice";
import { useAppSelector } from "@/store/hooks";
import { setMode } from "@/utils/mode";
import SIcon from "@/components/ui/SIcon";
import { useObject } from "@realm/react";
import { TaskStatusSchema } from "@/schema";
import { BSON } from "realm";
import { TaskWorkerItemStatusIcon } from "@/components/task/TaskWorkItemStatusIcon";
import { useTranslation } from "react-i18next";
import BadgeTabNotify from "@/components/badge/BadgeTabNotify";
import useNotify from "@/hooks/useNotify";
import { isWriteConsole } from "@/utils/global";
import Updater from "@/components/update/Updater";
import useWorkHistory from "@/hooks/useWorkHistory";
import dayjs from "@/utils/dayjs";
import UIButton from "@/components/ui/UIButton";

export default function TabLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const { t } = useTranslation();

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  // const activeWorkTimeFromStore = useAppSelector(workTime);
  const workHistoryFromStore = useAppSelector(workHistory);

  const activeTaskStatus = useObject(
    TaskStatusSchema,
    new BSON.ObjectId(activeTaskWorkerFromStore?.statusId)
  );

  const userFromStore = useAppSelector(user);

  useNotify({
    userTo: userFromStore?.id ? [userFromStore.id] : undefined,
  });

  useWorkHistory(
    {
      workerId: userFromStore?.id ? [userFromStore?.id] : undefined,
      // status: 0,
      // date: dayjs().format(),
      from: dayjs().subtract(2, "day").format(),
      to: dayjs().format(),
      $limit: 100,
    },
    [userFromStore]
  );
  // if (userFromStore) {
  //   // const { messagesRooms } = useMessagesRooms({
  //   //   userId: userFromStore?.id,
  //   // });
  //   useTaskStatus({});
  //   usePost({});
  //   useObjects({});
  // }
  // const roomIds = useMemo(
  //   () => messagesRooms.map((x) => x._id.toString()) || undefined,
  //   []
  // );
  // useMessages({
  //   roomId: roomIds,
  // });

  const modeThemeFromStore = useAppSelector(modeTheme);

  useEffect(() => {
    isWriteConsole && console.log("modeThemeFromStore=", modeThemeFromStore);

    setMode(modeThemeFromStore);
    setColorScheme(modeThemeFromStore);
  }, []);

  return userFromStore ? (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      {/* <View className="">
        <TaskWorkerNotify />
      </View> */}
      <View className="flex-auto">
        <Tabs
          backBehavior="history"
          initialRouteName={
            "order"
            // ["admin", "boss", "designer", "superadmin"].includes(
            //   userFromStore.roleObject.code
            // )
            //   ? "order"
            //   : "work"
          }
          screenOptions={{
            tabBarStyle: {
              // display: userFromStore.roleObject.value.includes("list-create")
              //   ? "none"
              //   : "flex",
              // minHeight: 60,
              borderTopWidth: 0,
              borderBottomWidth: 0,
              // borderTopColor:
              //   colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
              // padding: 0,
              // margin: 0,
              shadowColor: "transparent",
              // borderColor: colorScheme === "dark" ? Colors.s[800] : Colors.s[100],
              backgroundColor:
                colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
            },
            // headerShadowVisible: true,
            tabBarActiveBackgroundColor:
              colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
            tabBarActiveTintColor:
              colorScheme === "dark" ? Colors.p[300] : Colors.p[700],
            tabBarInactiveTintColor:
              colorScheme === "dark" ? Colors.s[100] : Colors.s[950],
            headerShown: false,
          }}
        >
          {/* <Tabs.Screen
            name="order"
            options={{
              title: t("title.order"),
              tabBarIcon: ({ color, focused }) => (
                <View>
                  <SIcon
                    path={focused ? "iInboxes" : "iInboxes"}
                    size={20}
                    color={color} //focused ? Colors.white : Colors.white
                  />
                </View>
              ),
            }}
          /> */}
          {/* <Tabs.Screen
            name="finance"
            options={{
              href: ["admin", "boss", "designer", "superadmin"].includes(
                userFromStore.roleObject.code
              )
                ? null
                : "/(tabs)/finance",
              title: t("title.finance"),
              // tabBarActiveTintColor: Colors.white,
              // tabBarInactiveTintColor: Colors.white,
              // tabBarItemStyle: {
              //   borderRadius: 50,
              //   backgroundColor:
              //     colorScheme === "dark" ? Colors.s[950] : Colors.s[200],
              //   maxWidth: 80,
              //   height: 80,
              //   // paddingHorizontal: 5,
              //   // paddingVertical: 15,
              //   paddingTop: 10,
              //   marginTop: -25,
              //   borderColor: colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
              //   borderWidth: 7,
              // },
              tabBarIcon: ({ color, focused }) => (
                <SIcon path={"iRubl"} size={30} color={color} />
              ),
            }}
          /> */}
          {/* <Tabs.Screen
            name="work"
            options={{
              href: ["admin", "boss", "designer", "superadmin"].includes(
                userFromStore.roleObject.code
              )
                ? null
                : "/(tabs)/work",
              title:
                (activeTaskWorkerFromStore &&
                  activeTaskWorkerFromStore?.status == "process") ||
                workHistoryFromStore
                  ? ""
                  : t("title.work"),
              // activeTaskWorkerFromStore
              //   ? `${t(
              //       "order"
              //     )} №${activeTaskWorkerFromStore?.order.number.toString()}`
              //   : t("title.work"),
              tabBarActiveTintColor: activeTaskWorkerFromStore
                ? Colors.white
                : colorScheme === "dark"
                ? Colors.r[200]
                : Colors.white,
              tabBarActiveBackgroundColor: "transparent",
              // tabBarInactiveTintColor: activeTaskWorkerFromStore
              //   ? Colors.white
              //   : colorScheme === "dark"
              //   ? Colors.p[300]
              //   : Colors.p[700],
              tabBarItemStyle: {
                borderRadius: 50,
                backgroundColor: !activeTaskWorkerFromStore
                  ? colorScheme === "dark"
                    ? Colors.r[700]
                    : Colors.r[400]
                  : colorScheme === "dark"
                  ? activeTaskStatus?.color
                  : activeTaskStatus?.color,
                maxWidth: 85,
                height: 85,
                // paddingHorizontal: 5,
                // paddingVertical: 15,
                paddingTop: 2,
                marginTop: -20,
                borderColor:
                  colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
                borderWidth: 7,
                padding: 10,
                zIndex: 100,
              },
              tabBarIcon: ({ color, focused }) => (
                // <SIcon
                //   path={"iTimer"}
                //   // path={activeTaskStatus?.icon ? undefined : "iTimer"}
                //   // pathText={activeTaskStatus?.icon}
                //   size={30}
                //   color={color}
                //   // className={activeTaskStatus?.animate}
                // />
                <TaskWorkerItemStatusIcon />
              ),
            }}
          /> */}
          <Tabs.Screen
            name="message"
            options={{
              title: t("title.noty"),
              tabBarItemStyle: {
                maxWidth: 90,
              },
              tabBarIcon: ({ color, focused }) => (
                <View>
                  <SIcon
                    path={focused ? "iBell" : "iBell"}
                    size={25}
                    color={color}
                  />
                  {/* <BadgeTabMessage /> */}
                  <BadgeTabNotify />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="order"
            options={{
              // href: ["admin", "boss", "designer", "superadmin"].includes(
              //   userFromStore.roleObject.code
              // )
              //   ? null
              //   : "/(tabs)/order",
              title:
                (activeTaskWorkerFromStore &&
                  activeTaskWorkerFromStore?.status == "process") ||
                workHistoryFromStore
                  ? ""
                  : "", //t("title.order"),
              // activeTaskWorkerFromStore
              //   ? `${t(
              //       "order"
              //     )} №${activeTaskWorkerFromStore?.order.number.toString()}`
              //   : t("title.work"),
              tabBarActiveTintColor: activeTaskWorkerFromStore
                ? Colors.white
                : colorScheme === "dark"
                ? Colors.r[200]
                : Colors.white,
              tabBarActiveBackgroundColor: "transparent",
              // tabBarInactiveTintColor: activeTaskWorkerFromStore
              //   ? Colors.white
              //   : colorScheme === "dark"
              //   ? Colors.p[300]
              //   : Colors.p[700],
              tabBarItemStyle: {
                borderRadius: 20,
                backgroundColor: !activeTaskWorkerFromStore
                  ? colorScheme === "dark"
                    ? Colors.p[700]
                    : Colors.p[600]
                  : colorScheme === "dark"
                  ? Colors.gr[700] // activeTaskStatus?.color
                  : Colors.gr[600], //activeTaskStatus?.color,
                // maxWidth: "fit",
                height: 74,
                // paddingHorizontal: 5,
                // paddingVertical: 15,
                padding: 0,
                margin: 0,
                marginTop: -20,
                borderColor:
                  colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
                borderWidth: 5,
                zIndex: 100,
              },
              tabBarButton: () => (
                // <SIcon
                //   path={"iTimer"}
                //   // path={activeTaskStatus?.icon ? undefined : "iTimer"}
                //   // pathText={activeTaskStatus?.icon}
                //   size={30}
                //   color={color}
                //   // className={activeTaskStatus?.animate}
                // />
                <UIButton
                  type="link"
                  className="p-1 px-2 m-0"
                  onPress={() => {
                    router.push("/(tabs)/order");
                  }}
                >
                  <TaskWorkerItemStatusIcon />
                </UIButton>
              ),
              // tabBarIcon: ({ color, focused }) => (
              //   // <SIcon
              //   //   path={"iTimer"}
              //   //   // path={activeTaskStatus?.icon ? undefined : "iTimer"}
              //   //   // pathText={activeTaskStatus?.icon}
              //   //   size={30}
              //   //   color={color}
              //   //   // className={activeTaskStatus?.animate}
              //   // />
              //   <TaskWorkerItemStatusIcon />
              // ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: t("title.profile"),
              // tabBarLabel(props) {
              //   return null;
              // },
              tabBarItemStyle: {
                maxWidth: 90,
              },
              tabBarIcon: ({ color, focused }) =>
                !userFromStore?.images ? (
                  <SIcon
                    path={focused ? "iPerson" : "iPerson"}
                    size={25}
                    color={color}
                  />
                ) : (
                  <UserTabInfo userData={userFromStore} />
                ),
            }}
          />
        </Tabs>
        <Updater />
      </View>
    </View>
  ) : null;
}
