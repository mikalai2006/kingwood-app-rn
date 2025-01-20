import { View, Text } from "react-native";
import React from "react";
import Card from "../Card";
import { useTranslation } from "react-i18next";

const TaskObjectIdNotFound = () => {
  const { t } = useTranslation();

  return (
    <View className="p-4">
      <Text className="text-lg text-s-800 dark:text-s-200 leading-6">
        {t("info.taskObjectIdNotFound")}
      </Text>
    </View>
  );
};

export default TaskObjectIdNotFound;
