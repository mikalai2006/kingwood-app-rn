import { Text, View, ScrollView, Alert } from "react-native";

// import { hostAPI } from "@/utils/global";
// import * as WebBrowser from "expo-web-browser";
// import * as Linking from "expo-linking";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  schedules,
  setActiveTaskWorker,
  setWorkHistory,
  tokens,
  user,
} from "@/store/storeSlice";
import UIButton from "@/components/ui/UIButton";
import useAuth from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/Card";
import SIcon from "@/components/ui/SIcon";
import UserSettingAvatar from "@/components/user/UserSettingAvatar";
import SwitchMode from "@/components/SwitchMode";
import { addStartNull, getNoun } from "@/utils/utils";
import { router } from "expo-router";
// import UILabel from "@/components/ui/UILabel";
import { useTranslation } from "react-i18next";
import { useObject } from "@realm/react";
import { PostSchema } from "@/schema";
import { BSON } from "realm";
import dayjs from "@/utils/dayjs";
// import { useTaskWorkerUtils } from "@/hooks/useTaskWorkerUtils";

export default function TabProfileScreen() {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);
  const schedulesFromStore = useAppSelector(schedules);

  const { onLogout } = useAuth();

  // const { onEndWorkTime } = useTaskWorkerUtils();

  const logout = async () => {
    // await onEndWorkTime();

    // dispatch(setActiveTaskWorker(null));
    // dispatch(setWorkHistory(null));

    onLogout();

    router.replace("./modalauth");
  };

  const alertLogout = () => {
    Alert.alert(t("info.exitApp"), t("info.exitAppDescription"), [
      {
        text: t("button.no"),
        onPress: () => {},
        style: "cancel",
      },
      {
        text: t("button.yes"),
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const onShowOklad = () => {
    Alert.alert(
      t("oklad"),
      `${userFromStore?.oklad} ${getNoun(userFromStore?.oklad, "₽", "₽", "₽")}`,
      [
        // {
        //   text: t("button.no"),
        //   onPress: () => {},
        //   style: "cancel",
        // },
        {
          text: t("button.ok"),
          onPress: () => {},
        },
      ]
    );
  };

  const post = useObject(PostSchema, new BSON.ObjectId(userFromStore?.postId));

  return (
    <ScrollView className="bg-s-200 dark:bg-s-950">
      <SafeAreaView>
        <View className="flex-1 p-4">
          <View className="flex flex-row items-center">
            <View>
              <SwitchMode />
            </View>
            <View className="flex-auto"></View>
            <View className="">
              <UIButton
                type="link"
                onPress={() => {
                  router.navigate({
                    pathname: "/usersettingform",
                  });
                }}
              >
                <View className="flex-row items-center gap-4">
                  <SIcon path="iCog" size={30} />
                </View>
              </UIButton>
            </View>
          </View>
          {userFromStore && tokensFromStore?.access_token ? (
            <View>
              <UserSettingAvatar />

              <Card className="my-4">
                <View className="py-2 border-b border-s-100 dark:border-s-800">
                  <Text
                    lineBreakMode="middle"
                    numberOfLines={1}
                    textBreakStrategy="balanced"
                    className="flex-auto text-xl font-bold text-p-800 dark:text-p-200"
                  >
                    {userFromStore.name}
                  </Text>
                </View>

                <View className="py-2 flex-row gap-4 items-center border-b border-s-100 dark:border-s-800">
                  <Text className="px-2 flex-auto text-lg text-s-800 dark:text-s-500">
                    {t(`post`)}
                  </Text>
                  <Text className="text-lg font-bold text-p-800 dark:text-p-200">
                    {post?.name}
                  </Text>
                </View>

                {!["admin", "boss", "designer", "superadmin"].includes(
                  userFromStore.roleObject?.code
                ) && (
                  <View className="py-2 flex-row gap-4 items-center border-b border-s-100 dark:border-s-800">
                    <Text className="px-2 flex-auto text-lg text-s-800 dark:text-s-500">
                      {t(`typePay.${userFromStore.typePay}`)}
                    </Text>
                    <UIButton type="link" onPress={() => onShowOklad()}>
                      <View className="-mx-1 flex-row gap-4">
                        <Text className="text-lg font-bold text-p-800 dark:text-p-200">
                          ***
                        </Text>
                        <SIcon path="iChevronRight" size={20} />
                      </View>
                    </UIButton>
                    {/* <Text className="text-lg font-bold text-p-800 dark:text-p-200">
                      {userFromStore?.oklad}{" "}
                      {getNoun(userFromStore?.oklad, "₽", "₽", "₽")}
                    </Text> */}
                  </View>
                )}

                <View className="py-2 flex-row gap-4 items-center border-b border-s-100 dark:border-s-800">
                  <Text className="px-2 flex-auto text-lg text-s-800 dark:text-s-500">
                    {t(`birthday`)}
                  </Text>
                  <Text className="text-lg font-bold text-p-800 dark:text-p-200">
                    {userFromStore.birthday &&
                      dayjs(userFromStore.birthday, "DD.MM.YYYY").format(
                        "DD MMMM YYYY"
                      )}
                  </Text>
                </View>

                <View className="py-2 flex-row gap-4 items-center border-b border-s-100 dark:border-s-800">
                  <Text className="px-2 flex-auto text-lg text-s-800 dark:text-s-500">
                    {t(`timeWork`)}
                  </Text>
                  <View className="-mx-1 flex-row gap-4">
                    <Text className="text-lg font-bold text-p-800 dark:text-p-200"></Text>

                    <UIButton
                      type="secondary"
                      className="p-2 rounded-lg bg-s-200 dark:bg-s-600"
                      textClass="text-s-600 dark:text-s-200"
                      text={t("button.edit")}
                      onPress={() => {
                        router.push({
                          pathname: "/usertimework",
                        });
                      }}
                    />
                  </View>
                </View>

                <View className="py-2 flex-row gap-4 items-center">
                  <Text className="px-2 flex-auto text-lg text-s-800 dark:text-s-500">
                    {t(`phone`)}
                  </Text>
                  <Text className="text-lg font-bold text-p-800 dark:text-p-200">
                    {userFromStore.phone}
                  </Text>
                </View>

                {/* {userFromStore?.auth ? (
                  <View className="py-2 flex-row gap-4 items-center border-b border-s-100 dark:border-s-800">
                    <Text className="px-2 flex-auto text-lg text-s-800 dark:text-s-500">
                      {t(`pushToken`)}
                    </Text>
                    <Text className="text-xs text-p-800 dark:text-p-200">
                      {userFromStore?.auth.pushToken}
                    </Text>
                  </View>
                ) : null} */}
              </Card>

              <Card className="my-4">
                <View className="py-0">
                  <UIButton
                    type="link"
                    className={""}
                    onPress={() => {
                      router.push({
                        pathname: "/modalschedule",
                      });
                    }}
                  >
                    <View className="-mx-1 flex flex-row items-center gap-4">
                      <Text className="flex-auto text-lg text-s-800 dark:text-s-500">
                        {t("title.schedule")}
                      </Text>
                      <View className="rounded-full bg-green-500">
                        <Text
                          numberOfLines={1}
                          className={`text-sm text-white leading-4 p-1 ${
                            schedulesFromStore?.length > 9 ? "" : "px-2"
                          }`}
                        >
                          {schedulesFromStore?.length}
                        </Text>
                      </View>
                      {/* <View className="bg-gr-500 rounded-full py-2 px-3">
                        <Text className="text-black leading-4 font-medium m-0 p-0">
                          {schedulesFromStore?.length}
                        </Text>
                      </View> */}
                      <SIcon path="iChevronRight" size={20} />
                    </View>
                  </UIButton>
                </View>
              </Card>

              <Card className="my-4">
                {!["admin", "boss", "designer", "superadmin"].includes(
                  userFromStore.roleObject?.code
                ) && (
                  <View className="py-0 border-b border-s-100 dark:border-s-800">
                    <UIButton
                      type="link"
                      className={""}
                      onPress={() => {
                        router.push({
                          pathname: "/finance/[day]",
                          params: {
                            day: dayjs().format(),
                          },
                        });
                      }}
                    >
                      <View className="-mx-1 flex-row gap-4">
                        <Text className="flex-auto text-lg text-s-800 dark:text-s-500">
                          {t("title.financeToday")}
                        </Text>
                        <SIcon path="iChevronRight" size={20} />
                      </View>
                    </UIButton>
                  </View>
                )}

                {!["admin", "boss", "designer", "superadmin"].includes(
                  userFromStore.roleObject?.code
                ) && (
                  <View className="py-0 border-b border-s-100 dark:border-s-800">
                    <UIButton
                      type="link"
                      onPress={() => {
                        router.push("/finance");
                      }}
                    >
                      <View className="-mx-1 flex-row gap-4">
                        <Text className="flex-auto text-lg text-s-800 dark:text-s-500">
                          {t("title.financeMonth")}
                        </Text>
                        <SIcon path="iChevronRight" size={20} />
                      </View>
                    </UIButton>
                    {/* <UIButton
                    type="link"
                    onPress={() => {
                      router.navigate({
                        pathname: "/address/[userId]",
                        params: {
                          userId: userFromStore.id,
                        },
                      });
                    }}
                  >
                    <View className="flex-row gap-4">
                      <Text className="flex-auto text-lg text-s-800 dark:text-s-500">
                        Мои подписки
                      </Text>
                      <SIcon path="iChevronRight" size={20} />
                    </View>
                  </UIButton> */}
                  </View>
                )}
                {!["admin", "boss", "designer", "superadmin"].includes(
                  userFromStore.roleObject?.code
                ) && (
                  <View className="py-0 ">
                    <UIButton
                      type="link"
                      onPress={() => {
                        router.push("/(tabs)/order/completed");
                      }}
                    >
                      <View className="-mx-1 flex-row gap-4">
                        <Text className="flex-auto text-lg text-s-800 dark:text-s-500">
                          {t("button.completedTask")}
                        </Text>
                        <SIcon path="iChevronRight" size={20} />
                      </View>
                    </UIButton>
                    {/* <UIButton
                    type="link"
                    onPress={() => {
                      router.navigate({
                        pathname: "/address/[userId]",
                        params: {
                          userId: userFromStore.id,
                        },
                      });
                    }}
                  >
                    <View className="flex-row gap-4">
                      <Text className="flex-auto text-lg text-s-800 dark:text-s-500">
                        Мои подписки
                      </Text>
                      <SIcon path="iChevronRight" size={20} />
                    </View>
                  </UIButton> */}
                  </View>
                )}
              </Card>

              {/* <UserSettingForm />
              <Card className="mt-4">
                <UserSettingGeo />
              </Card> */}
              <View className="mt-4">
                <Card>
                  <View className="py-0 border-b border-s-100 dark:border-s-800">
                    <UIButton
                      type="link"
                      onPress={() => {
                        router.push("/userpassword");
                      }}
                    >
                      <View className="-mx-1 flex-row gap-4">
                        <Text className="flex-auto text-lg text-s-800 dark:text-s-500">
                          {t("button.resetPassword")}
                        </Text>
                        <SIcon path="iChevronRight" size={20} />
                      </View>
                    </UIButton>
                  </View>
                  <UIButton type="link" onPress={alertLogout}>
                    <View className="flex flex-row items-center gap-4">
                      <Text className="text-red-800 dark:text-red-200 text-center text-xl">
                        Выйти из аккаунта
                      </Text>
                    </View>
                  </UIButton>
                </Card>
              </View>
            </View>
          ) : (
            <Card>
              {/* <RText>
                Авторизируйтесь, используя один из сервисов и вперед совершать
                обмены
              </RText>
              <UIButton
                type="secondary"
                onPress={() => goAuth("/oauth/google")}
              >
                <View className="flex flex-row items-center gap-4 p-4">
                  <SIcon path="iGoogle" type="secondary" size={25} />
                  <Text className="text-s-900 dark:text-s-200 text-center text-xl">
                    Google
                  </Text>
                </View>
              </UIButton> */}
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
