import { View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";

import { useTranslation } from "react-i18next";

import { WidgetInitApp } from "@/widget/WidgetInitApp";

import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { isWriteConsole } from "@/utils/global";

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

const Base = () => {
  isWriteConsole && console.log("Render Base");

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  useNotificationObserver();

  return (
    <View style={styles.view} className="bg-s-200 dark:bg-s-950">
      <WidgetInitApp />
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
              colorScheme === "dark" ? Colors.s[950] : Colors.s[100],
          },
          headerTintColor:
            colorScheme === "dark" ? Colors.s[200] : Colors.s[800],
        }}
      >
        {<Stack.Screen name="(tabs)" options={{ headerShown: false }} />}
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
        <Stack.Screen
          name="usertimework"
          options={{
            title: t("title.timeWork"),
            presentation: "transparentModal",
            animation: "slide_from_right",
            headerShown: false,
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
  );
};

const styles = {
  root: { flex: 1, paddingTop: 0 },
  view: { flex: 1 },
};

export default Base;
