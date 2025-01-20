import { View, Text } from "react-native";
import React from "react";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import RImage from "@/components/r/RImage";
import { IUser } from "@/types";

type Props = {
  userData: IUser;
};

const UserTabInfo = (props: Props) => {
  const { userData } = props;
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View className="flex flex-col items-center">
      <View>
        <RImage
          image={userData?.images ? userData?.images[0] : null}
          className="h-8 w-8 rounded-full"
        />
      </View>
      {/* <View className="">
        <Text
          numberOfLines={1}
          className="text-xs leading-3 text-s-900 dark:text-s-300"
        >
          {userData?.login}
        </Text>
      </View> */}
    </View>
  );
};

export default UserTabInfo;
