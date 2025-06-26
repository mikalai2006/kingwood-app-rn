import "react-native-get-random-values";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  NativeEventSubscription,
  StatusBar,
  Text,
  View,
} from "react-native";

import "../localization/i18n";
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

// import { store, persistor } from "../store/store";

// import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Colors } from "@/utils/Colors";
// import { PersistGate } from "redux-persist/integration/react";
// import { Provider } from "react-redux";
// import WidgetInitAuth from "@/widget/WidgetInitAuth";
// import { WidgetInitApp } from "@/widget/WidgetInitApp";
// import WidgetEvents from "@/widget/WidgetEvents";

// import { router } from "expo-router";
// import * as Notifications from "expo-notifications";

import "../tailwind.css";

// import { RealmProvider } from "@realm/react";
// import {
//   ImageSchema,
//   MessageRoomSchema,
//   MessageSchema,
//   OperationSchema,
//   OrderSchema,
//   PostSchema,
//   QuestionSchema,
//   TaskMontajSchema,
//   TaskMontajWorkerSchema,
//   TaskSchema,
//   TaskStatusSchema,
//   TaskWorkerSchema,
//   UserSchema,
//   WorkHistorySchema,
//   WorkTimeSchema,
//   NotifySchema,
//   PaySchema,
//   PayTemplateSchema,
//   ArchiveNotifySchema,
// } from "@/schema";
import { SafeAreaView } from "react-native-safe-area-context";
// import { TaskWorkerNotify } from "@/components/task/TaskWorkerNotify";
import { useTranslation } from "react-i18next";
import { TNetInfoState } from "@/types";
// import { ErrContext } from "@/components/ErrContext";
import UIButton from "@/components/ui/UIButton";
import { isWriteConsole } from "@/utils/global";
import Base from "@/components/base/Base";
// import useAppStateCheck from "@/hooks/useAppStateCheck";
import { AppStateStatusContext } from "@/components/AppStateStatusContext";
// import SpeedTestView from "@/components/SpeedTestView";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// function useNotificationObserver() {
//   useEffect(() => {
//     let isMounted = true;

//     function redirect(notification: Notifications.Notification) {
//       const url = notification.request.content.data?.url;
//       if (url) {
//         router.push(url);
//       }
//     }

//     Notifications.getLastNotificationResponseAsync().then((response) => {
//       if (!isMounted || !response?.notification) {
//         return;
//       }
//       redirect(response?.notification);
//     });

//     const subscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         redirect(response.notification);
//       }
//     );

//     return () => {
//       isMounted = false;
//       subscription.remove();
//     };
//   }, []);
// }

export default function RootLayout() {
  // useNotificationObserver();

  const { t } = useTranslation();

  // const { colorScheme } = useColorScheme();
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

  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       isWriteConsole && console.log("App has come to the foreground!");
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     isWriteConsole && console.log("AppState", appState.current);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
  const [appStateStatus, setAppStateStatus] = useState<
    AppStateStatus | undefined
  >(AppState.currentState);

  const handleAppStateChange = React.useCallback(
    async (nextAppState: AppStateStatus) => {
      setAppStateStatus(nextAppState);
      // isWriteConsole && console.log("nextAppState=", nextAppState);
    },
    [setAppStateStatus]
  );

  useEffect(() => {
    let eventListener: NativeEventSubscription;
    eventListener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      eventListener && eventListener.remove();
    };
  }, [handleAppStateChange]);
  // useAppStateCheck({ setAppStateStatus });

  // const onAppStateChange = React.useCallback(() => {
  //   switch (appStateStatus) {
  //     case "active":
  //       // Выполнять действия, когда приложение находится в активном состоянии
  //       break;
  //     case "background":
  //       // Выполнять действия, когда приложение находится в фоновом режиме
  //       break;
  //     case "inactive":
  //       // Выполнять действия, когда приложение находится в неактивном состоянии
  //       break;
  //     default:
  //       // Обработка других сценариев состояния приложения
  //       break;
  //   }
  //   // setAppStateStatus(appStateStatus);
  // }, [appStateStatus]);

  // useEffect(() => {
  //   onAppStateChange();
  // }, [onAppStateChange]);

  if (!loaded) {
    return null;
  }

  return (
    <AppStateStatusContext.Provider
      value={{ appStateStatus, setAppStateStatus }}
    >
      {appStateStatus &&
      !["background", "inactive"].includes(appStateStatus) ? (
        // <Provider store={store}>
        //   <PersistGate
        //     loading={
        //       <View>
        //         <StatusBar translucent backgroundColor="transparent" />
        //         <ActivityIndicator />
        //       </View>
        //     }
        //     persistor={persistor}
        //   >
        net?.isConnected ? (
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
            // <Text>App load {appState.current}</Text>
            // base component.
            <Base err={err} setErr={setErr} />
          )
        ) : (
          <GestureHandlerRootView
            style={styles.root}
            className="flex-1 bg-s-200 dark:bg-s-900"
          >
            <StatusBar translucent backgroundColor="transparent" />
            <SafeAreaView className="flex-1 bg-s-200 dark:bg-s-900 ">
              <View className="flex-1 p-4 items-center justify-center">
                <ActivityIndicator size={30} className="text-r-500" />
                <Text className="text-xl font-bold mb-2 text-r-600 dark:text-r-300">
                  {t("disconnectTitle")}
                </Text>
                <Text className="text-lg leading-5 text-r-800 dark:text-r-300">
                  {t("disconnect")}
                </Text>
              </View>
            </SafeAreaView>
          </GestureHandlerRootView>
        )
      ) : //   </PersistGate>
      // </Provider>
      null}
    </AppStateStatusContext.Provider>
  );
}

const styles = {
  root: { flex: 1, paddingTop: 0 },
  view: { flex: 1 },
};
