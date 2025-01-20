import { View, Text } from "react-native";
import React from "react";
import UserSettingForm from "@/components/user/UserSettingForm";
import { SafeAreaView } from "react-native-safe-area-context";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

export default function UserSettingFormScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row items-center gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            {/* <OrderShortInfo id={product?._id.toString()} /> */}
            <Text className="text-xl text-s-800 dark:text-s-300">
              {t("settings")}
            </Text>
          </View>
        </View>
        <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
          <View className="p-4">
            <UserSettingForm />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
