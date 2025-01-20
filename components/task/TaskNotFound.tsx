import { View, Text } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

const TaskNotFound = () => {
  const { t } = useTranslation();

  return (
    <View className="p-4">
      <Text className="text-lg text-s-800 dark:text-s-200 leading-4">
        {t("info.taskNotFound")}
      </Text>
    </View>
  );
};

export default TaskNotFound;
