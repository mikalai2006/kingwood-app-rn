import { View, Text } from "react-native";
import React, { useMemo } from "react";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { formatNum } from "@/utils/utils";
import { IUser } from "@/types";

type Props = {
  userData: IUser;
};

const UserStat = (props: Props) => {
  const { userData } = props;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const userStat = useMemo(() => userData?.userStat, [userData?.userStat]);

  const totalCount = useMemo(() => {
    let result = 0;

    if (userStat) {
      result = Math.max(
        0,
        userStat.node * 15 +
          userStat.nodedataAuthorLike * 10 -
          userStat.nodedataAuthorDLike * 10
      );
    }

    return result;
  }, [userStat]);

  return (
    <View className="flex flex-row items-center">
      <View>
        <Text className="font-bold text-s-900 dark:text-s-300 pr-2">
          {formatNum(totalCount)}
        </Text>
      </View>
      <View>
        <View className="bg-p-500 h-2 w-2 rounded-full" />
      </View>
      <View>
        <Text className="text-s-900 dark:text-s-300 pl-0.5 pr-2">
          {formatNum(userStat?.node)}
        </Text>
      </View>
      <View>
        <View className="bg-s-300 h-2 w-2 rounded-full" />
      </View>
      <View>
        <Text className="text-s-900 dark:text-s-300 pl-0.5 pr-2">
          {formatNum(userStat?.nodedata)}
        </Text>
      </View>
      <View>
        <View className="bg-yellow-600 h-2 w-2 rounded-full" />
      </View>
      <View>
        <Text className="text-s-900 dark:text-s-300 pl-0.5 pr-2">
          {formatNum(userStat?.review)}
        </Text>
      </View>
      {/* <Text className="text-black">{JSON.stringify(userFromStore?.userStat)}</Text> */}
    </View>
  );
};

export default UserStat;
