import "react-native-get-random-values";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Platform, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeTaskWorker,
  setActiveTaskWorker,
  setWorkHistory,
  tokens,
  user,
  workHistory,
} from "@/store/storeSlice";
import { useQuery, useRealm } from "@realm/react";
import { ITaskWorker, IWsMessage } from "@/types";
import { BSON, UpdateMode } from "realm";
import {
  MessageRoomSchema,
  MessageSchema,
  OrderSchema,
  UserSchema,
} from "@/schema";
import useAuth from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { hostAPI, isWriteConsole, wsAPI } from "@/utils/global";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";

import { useErrContext } from "@/components/ErrContext";
import { useError } from "@/hooks/useError";
import { getObjectId } from "@/utils/utils";
import { useTaskWorkerUtils } from "@/hooks/useTaskWorkerUtils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function WidgetEvents() {
  const { onSyncToken, onLogout } = useAuth();
  const { t } = useTranslation();

  const { onSendError } = useError();

  const realm = useRealm();
  const userFromStore = useAppSelector(user);

  const dispatch = useAppDispatch();
  const { onFetchWithAuth } = useFetchWithAuth();

  const usersFromRealm = useQuery(UserSchema);
  const ordersFromRealm = useQuery(OrderSchema);
  // const offersFromRealm = useQuery(OfferSchema);
  const messagesFromRealm = useQuery(MessageSchema);
  const messagesRoomsFromRealm = useQuery(MessageRoomSchema);

  const tokensFromStore = useAppSelector(tokens);
  const activeTaskFromStore = useAppSelector(activeTaskWorker);
  const activeTaskFromStoreRef = useRef(activeTaskFromStore);
  const activeWorkHistoryFromStore = useAppSelector(workHistory);
  const activeWorkHistoryFromStoreRef = useRef(activeWorkHistoryFromStore);
  const userRef = useRef(userFromStore);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const onSetExpoPushToken = async (token: string) => {
    // console.log("userFromStore: ", userFromStore?.id);
    if (userFromStore?.id) {
      await onFetchWithAuth(`${hostAPI}/auth/${userFromStore?.userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          pushToken: token.toString(),
        }),
      })
        .then((res) => res.json())
        .then((res: any) => {
          return res;
          // try {
          //   console.log("onSetExpoPushToken res: ", res);
          // } catch (e) {
          //   console.log("onSetExpoPushToken error: ", e);
          // }
        })
        .catch((e) => {
          onSendError(new Error(`onSetExpoPushToken Error: ${e?.message}`));
          isWriteConsole && console.log("onSetExpoPushToken Error", e);
          throw e;
        });
      setExpoPushToken(token);
    } else {
      return null;
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      // Alert.alert("token", token);
      token && onSetExpoPushToken(token);
    });

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
      // Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: "Time's up!",
      //     body: "Change sides!",
      //   },
      //   trigger: {
      //     hour: 13,
      //     minute: 52,
      //     repeats: true,
      //   },
      // });
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    activeTaskFromStoreRef.current = Object.assign({}, activeTaskFromStore);
  }, [activeTaskFromStore]);

  const onDetectActiveTaskWork = useCallback((data: IWsMessage) => {
    // console.log(
    //   "taskWorker ids=",
    //   activeTaskFromStoreRef.current?.id,
    //   data.content.id
    // );
    if (data.method === "DELETE") {
      if (activeTaskFromStoreRef.current?.id === data.content.id) {
        dispatch(setActiveTaskWorker(null));
      }
    } else {
      if (activeTaskFromStoreRef.current?.id === data.content.id) {
        dispatch(setActiveTaskWorker(data.content));
      }
    }
  }, []);

  useEffect(() => {
    activeWorkHistoryFromStoreRef.current = Object.assign(
      {},
      activeWorkHistoryFromStore
    );
  }, [activeWorkHistoryFromStore]);

  const onDetectActiveWorkHistory = useCallback(
    (data: IWsMessage) => {
      // console.log("onDetectActiveWorkHistory:");

      // isWriteConsole &&
      //   console.log(
      //     "onDetectActiveWorkHistory: ",
      //     // activeWorkHistoryFromStoreRef.current?.id,
      //     data.content.status,
      //     userRef.current?.id,
      //     userFromStore?.id,
      //     data.content?.workerId
      //   );
      if (data.method === "CREATE") {
        // isWriteConsole && console.log("Set workHistory CREATE ");
        if (
          data.content.status == 0 &&
          data.content?.workerId == userRef.current?.id //userFromStore?.id
        ) {
          isWriteConsole && console.log("Set workHistory: ", data.content?.id);

          dispatch(setWorkHistory(data.content));
        }
      } else {
        if (activeWorkHistoryFromStoreRef.current?.id === data.content.id) {
          dispatch(setWorkHistory(null));
          dispatch(setActiveTaskWorker(null));
        }
      }
    },
    [userFromStore?.id]
  );

  const onDetectUser = useCallback(
    async (data: IWsMessage) => {
      if (data.method === "PATCH" && data.content.blocked) {
        await onLogout();

        Alert.alert(t("title.info"), t("error.youIsBlocked"));
      } else if (
        data.method === "DELETE" &&
        userRef.current?.id === data.content.id
      ) {
        await onLogout();

        Alert.alert(t("title.info"), t("error.youIsDelete"));
      }
    },
    [userFromStore, onLogout]
  );

  const { setErr } = useErrContext();

  useEffect(() => {
    userRef.current = userFromStore;
  }, [userFromStore]);

  const [reconnect, setReconnect] = useState(false);

  useEffect(() => {
    const onInitSocket = async () => {
      console.log("onInitToken");

      if (!tokensFromStore?.access_token) {
        setReconnect(false);
        return;
      }
      const _tokens = await onSyncToken();
      if (!_tokens) {
        // console.log("tokens: ", tokens);
        throw new Error(t("general:httpError.notFoundToken"));
      }
      const stateNet = await NetInfo.fetch();
      // console.log('onFetch:::::', stateNet);

      if (!stateNet.isConnected) {
        throw new Error(t("general:httpError.notConnect"));
      }

      const _socket = new WebSocket(wsAPI);
      _socket.onopen = function () {
        _socket.send(
          JSON.stringify({
            type: "jwt",
            content: tokensFromStore?.access_token,
          })
        );
        isWriteConsole &&
          console.log("Open websocket: ", tokensFromStore?.access_token);
        setReconnect(false);
      };

      _socket.onclose = () => {
        isWriteConsole && console.log("Close socket!");
        isWriteConsole && console.log(new Error("error.closeSocket"));
        // isWriteConsole && console.log("userFromStore:", userFromStore);
        // isWriteConsole && console.log("userRef:", userRef);

        if (userRef.current) {
          // setErr(new Error("error.closeSocket"));
          setTimeout(onInitSocket, 1000);
          setReconnect(true);
        }
      };

      _socket.onmessage = function (event) {
        const data: IWsMessage = JSON.parse(event.data);
        const { method, service } = data;
        isWriteConsole && console.log("event.data: ", service, method);

        if (!userRef.current) {
          return;
        }

        let nameOperation = "";

        if (getObjectId(data.content.id) != "0") {
          realm.write(async () => {
            try {
              switch (data.service) {
                case "workHistory":
                  nameOperation = "workHistory";

                  if (method === "DELETE") {
                    await realm.delete(
                      realm.objectForPrimaryKey(
                        "WorkHistorySchema",
                        new BSON.ObjectId(data.content.id)
                      )
                    );
                  } else {
                    await realm.create(
                      "WorkHistorySchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(data.content.id),
                      },
                      UpdateMode.Modified
                    );
                  }

                  onDetectActiveWorkHistory(data);
                  break;

                case "user":
                  nameOperation = "user";
                  realm.create(
                    "UserSchema",
                    {
                      ...data.content,
                      _id: new BSON.ObjectId(
                        data.content.id || data.content._id
                      ),
                      images: data.content?.images || [],
                      typeWork: data.content?.typeWork || [],
                    },
                    UpdateMode.Modified
                  );

                  onDetectUser(data);
                  break;

                case "pay":
                  nameOperation = "pay";
                  if (data.method === "DELETE") {
                    if (data.content?.id) {
                      realm.delete(
                        realm.objectForPrimaryKey(
                          "PaySchema",
                          new BSON.ObjectId(data.content.id)
                        )
                      );
                    }
                  } else {
                    realm.create(
                      "PaySchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(
                          data.content.id || data.content._id
                        ),
                      },
                      UpdateMode.Modified
                    );
                  }
                  break;

                case "archiveNotify":
                  nameOperation = "archiveNotify";
                  if (data.method === "DELETE") {
                    if (data.content?.id) {
                      realm.delete(
                        realm.objectForPrimaryKey(
                          "ArchiveNotifySchema",
                          new BSON.ObjectId(data.content.id)
                        )
                      );
                    }
                  } else {
                    realm.create(
                      "ArchiveNotifySchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(
                          data.content.id || data.content._id
                        ),
                        images: data.content?.images || [],
                      },
                      UpdateMode.Modified
                    );
                  }
                  break;

                case "notify":
                  nameOperation = "notify";
                  if (data.method === "DELETE") {
                    if (data.content?.id) {
                      realm.delete(
                        realm.objectForPrimaryKey(
                          "NotifySchema",
                          new BSON.ObjectId(data.content.id)
                        )
                      );
                    }
                  } else {
                    realm.create(
                      "NotifySchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(
                          data.content.id || data.content._id
                        ),
                        images: data.content?.images || [],
                      },
                      UpdateMode.Modified
                    );
                  }
                  break;

                case "order":
                  nameOperation = "order";
                  realm.create(
                    "OrderSchema",
                    {
                      ...data.content,
                      _id: new BSON.ObjectId(
                        data.content.id || data.content._id
                      ),
                    },
                    UpdateMode.Modified
                  );
                  break;

                case "object":
                  nameOperation = "object";
                  if (data.method === "DELETE") {
                    realm.delete(
                      realm.objectForPrimaryKey(
                        "ObjectsSchema",
                        new BSON.ObjectId(data.content.id)
                      )
                    );
                  } else {
                    realm.create(
                      "ObjectsSchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(
                          data.content.id || data.content._id
                        ),
                      },
                      UpdateMode.Modified
                    );
                  }
                  break;

                case "task":
                  nameOperation = "task";
                  if (data.method === "DELETE") {
                    realm.delete(
                      realm.objectForPrimaryKey(
                        "TaskSchema",
                        new BSON.ObjectId(data.content.id)
                      )
                    );
                  } else {
                    realm.create(
                      "TaskSchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(
                          data.content.id || data.content._id
                        ),
                      },
                      UpdateMode.Modified
                    );
                  }
                  break;

                case "taskWorker":
                  nameOperation = "taskWorker";
                  if (data.method === "DELETE") {
                    realm.delete(
                      realm.objectForPrimaryKey(
                        "TaskWorkerSchema",
                        new BSON.ObjectId(data.content.id)
                      )
                    );

                    onDetectActiveTaskWork(data);
                  } else {
                    realm.create(
                      "TaskWorkerSchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(
                          data.content.id || data.content._id
                        ),
                        sortOrder: data.content.sortOrder || 0,
                      },
                      UpdateMode.Modified
                    );

                    if (
                      data.content?.object &&
                      getObjectId(data.content?.object?.id) != "0"
                    ) {
                      realm.create(
                        "ObjectsSchema",
                        {
                          ...data.content.object,
                          _id: new BSON.ObjectId(
                            data.content.object.id || data.content.object._id
                          ),
                        },
                        UpdateMode.Modified
                      );
                    }

                    if (
                      data.content?.order &&
                      getObjectId(data.content?.order?.id) != "0"
                    ) {
                      realm.create(
                        "OrderSchema",
                        {
                          ...data.content.order,
                          _id: new BSON.ObjectId(
                            data.content.order.id || data.content.order._id
                          ),
                        },
                        UpdateMode.Modified
                      );
                    }

                    onDetectActiveTaskWork(data);
                  }
                  break;

                // case "TaskMontajWorker":
                //   realm.create(
                //     "TaskMontajWorkerSchema",
                //     {
                //       ...data.content,
                //       _id: new BSON.ObjectId(data.content.id || data.content._id),
                //       sortOrder: data.content.sortOrder || 0,
                //     },
                //     UpdateMode.Modified
                //   );

                //   if (activeTaskFromStore?.id === data.content.id) {
                //     dispatch(setActiveTaskWorker(data.content));
                //   }
                //   break;

                case "taskStatus":
                  nameOperation = "taskStatus";
                  realm.create(
                    "TaskStatusSchema",
                    {
                      ...data.content,
                      _id: new BSON.ObjectId(
                        data.content.id || data.content._id
                      ),
                      enabled: data.content.enabled || 0,
                      // start: data.content.enabled || 0,
                      // finish: data.content.enabled || 0,
                      // process: data.content.enabled || 0,
                    },
                    UpdateMode.Modified
                  );
                  break;

                case "question":
                  nameOperation = "question";
                  if (method === "DELETE") {
                    realm.delete(
                      realm.objectForPrimaryKey(
                        "QuestionSchema",
                        new BSON.ObjectId(data.content.id)
                      )
                    );
                  } else {
                    realm.create(
                      "QuestionSchema",
                      {
                        ...data.content,
                        _id: new BSON.ObjectId(data.content.id),
                      },
                      UpdateMode.Modified
                    );
                  }
                  break;

                case "message":
                  nameOperation = "message";
                  realm.create(
                    "MessageSchema",
                    {
                      ...data.content,
                      _id: new BSON.ObjectId(
                        data.content.id || data.content._id
                      ),
                    },
                    UpdateMode.Modified
                  );
                  break;

                case "messageRoom":
                  nameOperation = "messageRoom";
                  realm.create(
                    "MessageRoomSchema",
                    {
                      ...data.content,
                      _id: new BSON.ObjectId(
                        data.content.id || data.content._id
                      ),
                    },
                    UpdateMode.Modified
                  );
                  break;

                default:
                  console.log("UNKNOWN EVENT", event);

                  break;
              }

              if (data.content.user) {
                nameOperation = "userAfter";
                realm.create(
                  "UserSchema",
                  {
                    ...data.content.user,
                    _id: new BSON.ObjectId(
                      data.content.user.id || data.content.user._id
                    ),
                    images: data.content?.images || [],
                    typeWork: data.content?.typeWork || [],
                  },
                  UpdateMode.Modified
                );
              }
            } catch (e) {
              onSendError(
                new Error(
                  `WidgetEvents error: ${data.service}[${nameOperation}]: `
                )
              );
              isWriteConsole &&
                console.log(
                  `WidgetEvents error: ${data.service}[${nameOperation}]: `,
                  e,
                  data
                );
            }
          });
        } else {
          isWriteConsole && console.log("EVENT ID NULL");
        }
        // Notifications.scheduleNotificationAsync({
        //   content: {
        //     title: "Look at that notification",
        //     body: data.content,
        //     sound: true,
        //     data: {
        //       url: "/modaloffer/6703ca0e1aa5474e6ea7e2c7",
        //     },
        //   },
        //   trigger: null,
        // });
      };
      isWriteConsole && console.log("Connect Websocket");
      return _socket;
    };

    let socket: WebSocket | undefined;

    onInitSocket().then((r) => (socket = r));

    return () => socket?.close();
  }, [tokensFromStore]);

  // isWriteConsole && console.log("token PUSHN: ", expoPushToken);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        // console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  return reconnect ? (
    <View
      className="flex-1 absolute top-0 bottom-0 right-0 left-0 items-center justify-center bg-s-100 dark:bg-s-800"
      style={{ opacity: 0.9, zIndex: 99999 }}
    >
      <ActivityIndicator size={30} className="text-s-500 dark:text-s-100" />
      <Text className="text-s-500 dark:text-s-100">{t("reconnect")}</Text>
    </View>
  ) : null;
  // (
  //   <View
  //     style={{
  //       flex: 1,
  //       alignItems: "center",
  //       justifyContent: "space-around",
  //     }}
  //   >
  //     <Text>Your expo push token: {expoPushToken}</Text>
  //     <Text>{`Channels: ${JSON.stringify(
  //       channels.map((c) => c.id),
  //       null,
  //       2
  //     )}`}</Text>
  //     <View style={{ alignItems: "center", justifyContent: "center" }}>
  //       <Text>
  //         Title: {notification && notification.request.content.title}{" "}
  //       </Text>
  //       <Text>Body: {notification && notification.request.content.body}</Text>
  //       <Text>
  //         Data:{" "}
  //         {notification && JSON.stringify(notification.request.content.data)}
  //       </Text>
  //     </View>
  //     <Button
  //       title="Press to schedule a notification"
  //       onPress={async () => {
  //         await schedulePushNotification();
  //       }}
  //     />
  //   </View>
  // );
}

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: "Here is the notification body",
//       data: { data: "goes here", test: { test1: "more data" }, url: "/" },
//     },
//     trigger: { seconds: 2 },
//   });
// }
