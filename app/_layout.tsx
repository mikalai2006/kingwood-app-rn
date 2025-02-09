import "react-native-get-random-values";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import "../localization/i18n";
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { store, persistor } from "../store/store";

import { useColorScheme } from "nativewind";
import { Colors } from "@/utils/Colors";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import WidgetInitAuth from "@/widget/WidgetInitAuth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WidgetInitApp } from "@/widget/WidgetInitApp";
import WidgetEvents from "@/widget/WidgetEvents";

import { router, Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { RealmProvider } from "@realm/react";

import "../tailwind.css";
import {
  ImageSchema,
  MessageRoomSchema,
  MessageSchema,
  OperationSchema,
  OrderSchema,
  PostSchema,
  QuestionSchema,
  TaskMontajSchema,
  TaskMontajWorkerSchema,
  TaskSchema,
  TaskStatusSchema,
  TaskWorkerSchema,
  UserSchema,
  WorkHistorySchema,
  WorkTimeSchema,
  NotifySchema,
  PaySchema,
  PayTemplateSchema,
} from "@/schema";
import { SafeAreaView } from "react-native-safe-area-context";
import { TaskWorkerNotify } from "@/components/task/TaskWorkerNotify";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import { useTranslation } from "react-i18next";
import { TNetInfoState } from "@/types";
import React from "react";
import { ErrContext } from "@/components/ErrContext";
import UIButton from "@/components/ui/UIButton";
import { isWriteConsole } from "@/utils/global";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();

  const { t } = useTranslation();

  const { colorScheme } = useColorScheme();
  // const tokensFromStore = useAppSelector(tokens);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const [net, setNet] = useState<TNetInfoState>({
    type: NetInfoStateType.none,
    isConnected: false,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      isWriteConsole && console.log("Connection type", state.type);
      isWriteConsole && console.log("Is connected?", state.isConnected);
      if (state) {
        setNet({ ...state });
        if (state.isConnected) {
          setErr(null);
        }
      }
    });

    // To unsubscribe to these update, just use:
    () => unsubscribe();
  }, []);

  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    isWriteConsole && console.log("ERR: ", err);
  }, [err]);

  if (!loaded) {
    return null;
  }

  return (
    <RealmProvider
      schema={[
        TaskSchema,
        ImageSchema,
        UserSchema,
        TaskStatusSchema,
        TaskWorkerSchema,
        OperationSchema,
        OrderSchema,
        ObjectsSchema,
        MessageSchema,
        MessageRoomSchema,
        PostSchema,
        QuestionSchema,
        WorkTimeSchema,
        TaskMontajSchema,
        TaskMontajWorkerSchema,
        WorkHistorySchema,
        NotifySchema,
        PaySchema,
        PayTemplateSchema,
      ]}
      inMemory
    >
      <Provider store={store}>
        <PersistGate
          loading={
            <View>
              <StatusBar translucent backgroundColor="transparent" />
              <ActivityIndicator />
            </View>
          }
          persistor={persistor}
        >
          {net?.isConnected ? (
            err != null ? (
              <View className="bg-s-100 dark:bg-s-900 z-50 flex-1 items-center justify-center p-6">
                <StatusBar translucent backgroundColor="transparent" />
                <Text className="text-lg text-s-800 dark:text-s-200 leading-5 mb-6">
                  {t(`${err?.message}`)}
                </Text>
                <UIButton
                  type="primary"
                  text={t("button.refreshSocket")}
                  onPress={() => {
                    setErr(null);
                  }}
                />
              </View>
            ) : (
              <ErrContext.Provider value={{ err, setErr }}>
                <View className="flex-1">
                  <WidgetInitApp />
                  <GestureHandlerRootView style={styles.root}>
                    <StatusBar translucent backgroundColor="transparent" />
                    <View
                      style={styles.view}
                      className="bg-s-200 dark:bg-s-950"
                    >
                      {/* <SafeAreaView style={{ flex: 1 }}> */}
                      {/* <View className="flex-none">
                  <TaskWorkerNotify />
                </View> */}
                      <Stack
                        // initialRouteName="auth"
                        screenOptions={{
                          headerTitleAlign: "center",
                          presentation: "fullScreenModal",
                          headerStyle: {
                            backgroundColor:
                              colorScheme === "dark"
                                ? Colors.s[950]
                                : Colors.s[100],
                          },
                          headerTintColor:
                            colorScheme === "dark"
                              ? Colors.s[200]
                              : Colors.s[800],
                        }}
                      >
                        {
                          <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                          />
                        }
                        {/* <Stack.Screen
                  name="modalcategory"
                  options={{
                    title: "Выберите категорию",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    // headerShown: false,
                  }}
                /> */}
                        <Stack.Screen
                          name="modalpicker"
                          options={{
                            title: "Добавление изображения",
                            // presentation: "transparentModal",
                            // animation: "slide_from_right",
                            // headerShown: false,
                          }}
                        />
                        {/* <Stack.Screen
                  name="modalfilter"
                  options={{
                    title: "Настройка фильтра",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    // headerShown: false,
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="modalsort"
                  options={{
                    title: "Настройка сортировки",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    // headerShown: false,
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="product"
                  options={{
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="user"
                  options={{
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}
                        <Stack.Screen
                          name="modalauth"
                          options={{
                            // presentation: "transparentModal",
                            // animation: "slide_from_right",
                            headerShown: false,
                          }}
                        />
                        {/* <Stack.Screen
                  name="modaloffer"
                  options={{
                    // title: "Предложение",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}
                        <Stack.Screen
                          name="usersettingform"
                          options={{
                            // title: "Предложение",
                            // presentation: "transparentModal",
                            // animation: "slide_from_right",
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="userpassword"
                          options={{
                            // title: "Предложение",
                            // presentation: "transparentModal",
                            // animation: "slide_from_right",
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="modaldatepicker"
                          options={{
                            title: t("modaldatepicker"),
                            presentation: "transparentModal",
                            animation: "slide_from_right",
                            headerShown: true,
                          }}
                        />
                        {/* <Stack.Screen
                  name="modaldarom"
                  options={{
                    // title: "Предложение",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="modalquestion"
                  options={{
                    // title: "Вопросы",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="address"
                  options={{
                    // title: "Вопросы",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="mapaddaddress"
                  options={{
                    // title: "Вопросы",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="mapfilter"
                  options={{
                    // title: "Вопросы",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                /> */}

                        <Stack.Screen
                          name="auth"
                          options={{
                            headerShown: false,
                            // presentation: 'transparentModal',
                            // animation: "slide_from_bottom",
                          }}
                        />
                        <Stack.Screen
                          name="modalmessage"
                          options={{
                            headerShown: false,
                            // presentation: 'transparentModal',
                            // animation: "slide_from_bottom",
                          }}
                        />
                        <Stack.Screen
                          name="[orderId]"
                          options={{
                            headerShown: false,
                            // presentation: 'transparentModal',
                            // animation: "slide_from_bottom",
                          }}
                        />
                        {/* <Stack.Screen
                  name="modaldeal"
                  options={{
                    headerShown: false,
                    // presentation: 'transparentModal',
                    // animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="modalcreate"
                  options={{
                    title: "Редактор лота",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      color:
                        colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
                    },
                    // headerLeft: () => (
                    //   <UIButton
                    //     text="Мои лоты"
                    //     type="secondary"
                    //     icon="iArrowLeftAndroid"
                    //     className="pl-0 pr-6"
                    //     onPress={() => router.back()}
                    //   />
                    // ),
                  }}
                /> */}
                        {/* <Stack.Screen
                  name="giveactions"
                  options={{
                    // headerShown: false,
                    title: "Активность лота",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      color:
                        colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
                    },
                    // headerLeft: () => (
                    //   <UIButton
                    //     text="Мои лоты"
                    //     type="secondary"
                    //     icon="iArrowLeftAndroid"
                    //     className="pl-0 pr-6"
                    //     onPress={() => router.back()}
                    //   />
                    // ),
                  }}
                /> */}
                        <Stack.Screen name="+not-found" />
                      </Stack>
                      {/* </SafeAreaView> */}
                    </View>
                  </GestureHandlerRootView>
                  <WidgetInitAuth />
                  <WidgetEvents />
                </View>
              </ErrContext.Provider>
            )
          ) : (
            <GestureHandlerRootView style={styles.root}>
              <StatusBar translucent backgroundColor="transparent" />
              <SafeAreaView className="flex-1 bg-s-200 dark:bg-s-900">
                <View className="flex-1 p-4">
                  <Text className="text-xl font-bold mb-2 text-r-600 dark:text-r-300">
                    {t("disconnectTitle")}
                  </Text>
                  <Text className="text-lg leading-5 text-r-800 dark:text-r-300">
                    {t("disconnect")}
                  </Text>
                  <ActivityIndicator size={30} color={Colors.s[500]} />
                </View>
              </SafeAreaView>
            </GestureHandlerRootView>
          )}
        </PersistGate>
      </Provider>
    </RealmProvider>
  );
}

const styles = {
  root: { flex: 1, paddingTop: 0 },
  view: { flex: 1 },
};
