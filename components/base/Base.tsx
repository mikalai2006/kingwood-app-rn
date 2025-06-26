import {
  ActivityIndicator,
  AppState,
  StatusBar,
  Text,
  View,
} from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";

import { PersistGate } from "redux-persist/integration/react";

import { RealmProvider } from "@realm/react";
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
  ArchiveNotifySchema,
  ObjectsSchema,
} from "@/schema";

import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";

import { useTranslation } from "react-i18next";

import WidgetInitAuth from "@/widget/WidgetInitAuth";
import { WidgetInitApp } from "@/widget/WidgetInitApp";
import WidgetEvents from "@/widget/WidgetEvents";

import { ErrContext } from "../ErrContext";

import * as Notifications from "expo-notifications";
import { router } from "expo-router";

interface IBaseProps {
  err: Error | null;
  setErr: (err: Error | null) => void;
}

function useNotificationObserver() {
  React.useEffect(() => {
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

const Base = (props: IBaseProps) => {
  const { err, setErr } = props;

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  useNotificationObserver();

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
        ArchiveNotifySchema,
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
          <ErrContext.Provider value={{ err, setErr }}>
            {/* <SpeedTestView err={err || ""} /> */}
            <View className="flex-1 bg-s-100 dark:bg-s-900">
              <WidgetInitApp />
              <GestureHandlerRootView style={styles.root}>
                <StatusBar translucent backgroundColor="transparent" />
                <View style={styles.view} className="bg-s-200 dark:bg-s-950">
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
                        colorScheme === "dark" ? Colors.s[200] : Colors.s[800],
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
                    <Stack.Screen
                      name="finance"
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
                      name="modalendprevday"
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
                    <Stack.Screen
                      name="modalschedule"
                      options={{
                        title: t("title.schedule"),
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
        </PersistGate>
      </Provider>
    </RealmProvider>
  );
};

const styles = {
  root: { flex: 1, paddingTop: 0 },
  view: { flex: 1 },
};

export default Base;
