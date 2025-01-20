import { View, Text } from "react-native";
import React, { useMemo } from "react";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import RImage from "@/components/r/RImage";
import { UserSchema } from "@/schema/UserSchema";
import { useObject, useQuery } from "@realm/react";
import UIRateStarShort from "../ui/UIRateStarShort";
import { BSON } from "realm";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";

type Props = {
  userId: string | undefined;
  borderColor?: string;
};

const UserInfo = (props: Props) => {
  const { userId, borderColor } = props;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const user = useObject(UserSchema, new BSON.ObjectId(userId));

  return user ? (
    <UIButton
      type="link"
      className="p-0"
      onPress={() =>
        router.push({
          pathname: "/user/[id]",
          params: {
            id: user._id.toString(),
          },
        })
      }
    >
      <View className="flex flex-row items-center gap-2">
        <View>
          <RImage
            image={user?.images ? user?.images[0] : null}
            className="h-10 w-10 rounded-full"
          />
          {user.online && (
            <View
              className={
                "w-4 h-4 rounded-full bg-green-500 absolute -bottom-1 -right-1 " +
                (borderColor || "border-s-200 dark:border-s-800")
              }
              style={{ borderWidth: 4 }}
            />
          )}
        </View>
        {/* <View></View> */}
        <View className="flex-auto">
          <Text
            className="text-base leading-5 text-s-900 dark:text-s-200"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user?.name}
          </Text>
          {/* <Text
            className="text-base leading-5 text-g-500 dark:text-s-400"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user?.location?.address?.city}
          </Text> */}
          {/* <View className="flex flex-row gap-2 items-center">
          <View className="flex-auto flex flex-row flex-wrap items-start gap-2">
            <Text className="text-md text-s-400 dark:text-s-400 leading-5">
              {user.location?.address.country}, {user.location?.address.city}
            </Text>
          </View>
        </View> */}
          <UIRateStarShort value={2.6} />
        </View>
      </View>
    </UIButton>
  ) : null;
};

export default UserInfo;
