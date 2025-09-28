import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import React from "react";

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

import { useColorScheme } from "nativewind";

import { useTranslation } from "react-i18next";

import { ErrContext } from "../ErrContext";

import { isWriteConsole } from "@/utils/global";
import WidgetInitAuth from "@/widget/WidgetInitAuth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import WidgetEvents from "@/widget/WidgetEvents";
import UIButton from "../ui/UIButton";
import { CustomError } from "@/hooks/useErrors";

interface IBaseProps {
  err: CustomError[];
  setErr: (err: CustomError[]) => void;
}

const Welcome = (props: IBaseProps) => {
  isWriteConsole && console.log("Render Welcome");

  const { err, setErr } = props;

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

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
          <GestureHandlerRootView style={styles.root}>
            <View className="flex-1 bg-s-100 dark:bg-s-900">
              <ErrContext.Provider value={{ err, setErr }}>
                {err.length > 0 ? (
                  <View className="flex-1">
                    <StatusBar translucent backgroundColor="transparent" />
                    <View>
                      {err.map((e, index) => {
                        return (
                          <View
                            key={index.toString()}
                            className="flex-auto p-6 pt-12 "
                          >
                            <Text className="text-xl mb-4 font-medium text-black dark:text-s-100">
                              {t("error.title")}
                            </Text>
                            <Text className="text-lg leading-6 text-black dark:text-s-300">
                              {e?.message}
                            </Text>
                            <Text className="mt-2 text-sm text-black dark:text-s-400">
                              {e?.service}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    <View className="p-6 pt-12">
                      <UIButton
                        type="secondary"
                        onPress={() => {
                          setErr([]);
                        }}
                        text={t("button.repeat")}
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    <StatusBar translucent backgroundColor="transparent" />
                    <WidgetInitAuth />
                    {/* <WidgetInitAuth /> */}
                    {/* <Text>App complete</Text> */}
                    <WidgetEvents />
                  </>
                )}
              </ErrContext.Provider>
            </View>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </RealmProvider>
  );
};

const styles = {
  root: { flex: 1, paddingTop: 0 },
  view: { flex: 1 },
};

export default Welcome;
