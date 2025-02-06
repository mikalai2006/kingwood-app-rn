import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import UIButton from "../ui/UIButton";
import { useTranslation } from "react-i18next";

const Updater = () => {
  const { t } = useTranslation();

  const [update, setUpdate] = useState<Updates.UpdateCheckResult>();

  async function onDownLoadUpdates() {
    if (update?.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  }

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      setUpdate(update);
      //   if (update.isAvailable) {
      //     await Updates.fetchUpdateAsync();
      //     await Updates.reloadAsync();
      //   }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  return update?.isAvailable ? (
    <View className="p-2">
      <UIButton
        type="success"
        text={t("updateApp")}
        onPress={onDownLoadUpdates}
      />
    </View>
  ) : (
    <Text>{JSON.stringify(update)}</Text>
  );
};

export default Updater;
