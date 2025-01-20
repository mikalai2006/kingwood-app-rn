import { View, Text } from "react-native";
import React, { useMemo } from "react";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import RImage from "@/components/r/RImage";
import RRateStar from "../r/RRateStar";
import { UserSchema } from "@/schema/UserSchema";
import { useObject, useQuery } from "@realm/react";
import UIRateStarShort from "../ui/UIRateStarShort";
import { BSON } from "realm";

type Props = {
  userId: string | undefined;
  borderColor?: string;
};

const UserInfoAvatar = (props: Props) => {
  const { userId, borderColor } = props;
  const { t } = useTranslation();
  const navigation = useNavigation();

  // const users = useQuery(UserSchema, (items) =>
  //   items.filtered("sid == $0", userId)
  // );

  // const user = useMemo(() => userData || users[0] || null, [userData, users]);
  const user = useObject(UserSchema, new BSON.ObjectId(userId));

  return user ? (
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
            style={{ borderWidth: 3 }}
          />
        )}
      </View>
    </View>
  ) : null;
};

export default UserInfoAvatar;
