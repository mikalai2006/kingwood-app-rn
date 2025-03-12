import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "@realm/react";
import { NotifySchema } from "@/schema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";

const BadgeTabNotify = () => {
  const userFromStore = useAppSelector(user);

  // if (userFromStore?.id) {
  //   const { isLoading } = useNotify({
  //     userTo: userFromStore?.id ? [userFromStore.id] : undefined,
  //   });
  // }

  const newNotify = useQuery(NotifySchema, (items) =>
    items.filtered("userTo == $0 AND status == 0", userFromStore?.id)
  );

  return newNotify?.length ? (
    <View className="rounded-full bg-green-500 absolute -top-1 -right-4 border-2  border-s-100 dark:border-s-800">
      <Text
        numberOfLines={1}
        className={`text-sm text-white leading-4 p-1 ${
          newNotify.length > 9 ? "" : "px-2"
        }`}
      >
        {newNotify.length}
      </Text>
    </View>
  ) : null;
};

export default BadgeTabNotify;
