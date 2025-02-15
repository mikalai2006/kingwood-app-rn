import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import SIcon from "../ui/SIcon";
import UserInfoAvatar from "../user/UserInfoAvatar";
import { Colors } from "@/utils/Colors";
import { NotifySchema } from "@/schema";
import dayjs, { formatDateTime } from "@/utils/dayjs";
import Card from "../Card";
import UserInfoInline from "../user/UserInfoInline";
import UIButton from "../ui/UIButton";
import { useTranslation } from "react-i18next";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI } from "@/utils/global";
import { INotify } from "@/types";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { setLinkParams } from "@/store/storeSlice";
import { TouchableOpacity } from "react-native-gesture-handler";

export type NotifyItemProps = {
  notify: NotifySchema;
};

const NotifyItem = ({ notify }: NotifyItemProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const realm = useRealm();

  const { onFetchWithAuth } = useFetchWithAuth();

  const [loading, setLoading] = useState(false);

  const onPatchNotify = async () => {
    if (notify.status) {
      return;
    }

    setLoading(true);

    return await onFetchWithAuth(`${hostAPI}/notify/${notify._id.toString()}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: 1,
      }),
    })
      .then((res) => res.json())
      .then((res: INotify) => {
        if (res?.id) {
          realm.write(() => {
            realm.create(
              "NotifySchema",
              {
                ...res,
                _id: new BSON.ObjectId(res.id),
                images: res?.images || [],
              },
              UpdateMode.Modified
            );
          });

          // go to link.
          if (res.link) {
            router.push({ pathname: res.link as any, params: res.linkOption });
            dispatch(setLinkParams(res.linkOption));
          }
        }
      })
      .catch((e: any) => {
        Alert.alert(t("error"), e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return notify ? (
    <TouchableOpacity onPress={onPatchNotify}>
      <View
        className={
          "flex flex-wrap items-start gap-1 p-4 mt-4 mx-4 " +
          (notify.status
            ? " bg-s-100 dark:bg-s-900 rounded-lg opacity-80"
            : "bg-white dark:bg-s-800 rounded-lg")
        }
      >
        {!notify.status ? (
          <Text className="bg-gr-600 dark:bg-gr-500 text-white dark:text-black p-0.5 rounded-md px-2">
            {t("newNotify")}
          </Text>
        ) : null}
        <Text
          className={
            "text-lg leading-5 " +
            (notify.status
              ? " text-s-600 dark:text-s-400 "
              : "text-s-800 dark:text-s-50 ")
          }
        >
          {notify.message}
        </Text>
        <View className="flex flex-row items-center gap-4">
          {/* <View className="flex-auto">
            <UserInfoInline key={notify.userId} userId={notify.userId} />
          </View> */}
          <View className="flex-auto">
            <Text className="text-sm text-s-500 leading-5">
              {t("added")}{" "}
              {dayjs(notify.createdAt).utc().format(formatDateTime)}
            </Text>
            <Text className="text-sm text-s-500 leading-5">
              {notify.status === 0 ? null : (
                <Text className="text-sm leading-5 text-s-500 dark:text-s-100">
                  {t("readed")} {dayjs(notify.readAt).fromNow()}
                </Text>
              )}
            </Text>
          </View>

          <View className="">
            <SIcon path="iChevronRight" size={25} color={Colors.s[500]} />
          </View>
          {/* <UIButton
            type={notify.status ? "secondary" : "primary"}
            loading={loading}
          >
            <Text className="text-base text-white dark:text-s-100">
              {notify?.link ? t("button.go") : t("read")}
            </Text>
          </UIButton> */}
        </View>
        {/* <View>
          {notify.status === 0 ? (
            <UIButton
              type="link"
              className="py-2 px-4 leading-5 rounded-md bg-p-500 dark:bg-p-600"
              onPress={onPatchNotify}
            >
              <Text className="text-md text-white dark:text-s-100">
                {t("read")}
              </Text>
            </UIButton>
          ) : (
            <Text className="text-md leading-5 text-s-500 dark:text-s-100">
              {t("readed")} {dayjs(notify.readAt).fromNow()}
            </Text>
          )}
        </View> */}
        {/* <View className="flex-auto flex flex-row items-center gap-4">
          <View>
            <UserInfoAvatar
              key={notify.userId}
              userId={notify.userId}
              borderColor="border-white dark:border-s-800"
            />
          </View>
          <View className="rotate-180">
            <SIcon path="iChevronLeftDouble" size={20} color={Colors.s[400]} />
          </View>
          <View className="flex-auto">
          </View>
          <View className="rotate-180">
            <SIcon path="iChevronLeftDouble" size={20} color={Colors.s[400]} />
          </View>
          <View>
            <UserInfoAvatar
              key={notify.userTo}
              userId={notify.userTo}
              borderColor="border-white dark:border-s-800"
            />
          </View>
        </View> */}
      </View>
    </TouchableOpacity>
  ) : null;
};

export default NotifyItem;
