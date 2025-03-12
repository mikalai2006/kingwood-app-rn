import { Text, View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { NotifySchema } from "@/schema";
import NotifyItem from "@/components/notify/NotifyItem";
import useNotify from "@/hooks/useNotify";
import { useTranslation } from "react-i18next";

export default function NotifyScreen() {
  const userFromStore = useAppSelector(user);

  const { t } = useTranslation();

  const { isLoading } = useNotify({
    userTo: userFromStore?.id ? [userFromStore?.id] : undefined,
  });

  const notifys = useQuery(
    NotifySchema,
    (items) =>
      items
        .filtered(
          "(userTo == $0 || userId == $0) AND status == 0",
          userFromStore?.id
        )
        .sorted("createdAt", true),
    [userFromStore]
  );

  return (
    // <SafeAreaView style={{ flex: 1 }} className="bg-s-200 dark:bg-s-950">
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      {!notifys.length ? (
        <View className="p-4">
          <Text className="text-lg text-s-500 dark:text-s-300">
            {t("notFoundNotify")}
          </Text>
        </View>
      ) : (
        <FlatList
          className=""
          data={notifys}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <NotifyItem key={item._id.toString()} notify={item} />
          )}
        />
      )}
    </View>
    // </SafeAreaView>
  );
}
