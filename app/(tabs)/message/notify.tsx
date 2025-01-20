import { Text, View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { NotifySchema } from "@/schema";
import NotifyItem from "@/components/notify/NotifyItem";
import useNotify from "@/hooks/useNotify";
import { SafeAreaView } from "react-native-safe-area-context";
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
        .filtered("(userTo == $0 || userId == $0)", userFromStore?.id)
        .sorted("createdAt", true),
    [userFromStore]
  );

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-s-200 dark:bg-s-950">
      <View className="flex-1">
        {!notifys.length ? (
          <View>
            <Text>{t("notFoundNotify")}</Text>
          </View>
        ) : (
          <FlatList
            className="p-4"
            data={notifys}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <NotifyItem key={item._id.toString()} notify={item} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
