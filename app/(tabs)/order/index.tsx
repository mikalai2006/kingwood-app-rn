import { Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/store/hooks";
import { activeTaskWorker, user } from "@/store/storeSlice";
import UIButton from "@/components/ui/UIButton";
import TaskWorkerTabs from "@/components/task/TaskWorkerTabs";
import { useEffect, useState } from "react";
import TaskWorkerList from "@/components/task/TaskWorkerList";

export default function FollowScreen() {
  const userFromStore = useAppSelector(user);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);

  const { t } = useTranslation();

  const [objectId, setObjectId] = useState("");

  useEffect(() => {
    if (!objectId && activeTaskWorkerFromStore?.objectId) {
      setObjectId(activeTaskWorkerFromStore.objectId);
    }
  }, []);

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <SafeAreaView className="flex-1">
        {/* <Text>{JSON.stringify(userFromStore?.postObject?.name)}</Text> */}
        {/* {userFromStore?.postObject?.name === "Монтажник" ? (
          <TaskMontajWorkerList />
        ) : ( */}
        {/* <Text>{JSON.stringify(objectId)}</Text> */}
        <View>
          <TaskWorkerTabs setObjectId={setObjectId} objectId={objectId} />
        </View>
        <View className="flex-1">
          <TaskWorkerList key={objectId} objectId={objectId} />
          {/* )} */}
        </View>
        <UIButton
          type="secondary"
          text={t("button.completedTask")}
          icon="iChevronRight"
          startText
          onPress={() => {
            router.push("/(tabs)/order/completed");
          }}
        />
      </SafeAreaView>
    </View>
  );
}
