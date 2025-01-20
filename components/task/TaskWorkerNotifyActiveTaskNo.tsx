import { Text, View } from "react-native";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export type TaskWorkerNotifyActiveTaskNoProps = {};

export function TaskWorkerNotifyActiveTaskNo({}: TaskWorkerNotifyActiveTaskNoProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-r-500 rounded-lg mt-1.5 p-1 px-4 flex flex-row items-center gap-1">
      <View className="">
        <SIcon path="iWarning" size={30} color={Colors.white} />
      </View>
      <UIButton
        type="link"
        className="flex-auto flex flex-row items-center gap-1 p-1"
        onPress={() => {
          router.push({ pathname: "/(tabs)/order" });
        }}
      >
        <Text
          textBreakStrategy="balanced"
          className="flex-auto text-base leading-5 text-white dark:text-white"
        >
          {t("button.checkTask")}
        </Text>
        <SIcon path="iChevronRight" size={20} color={Colors.white} />
      </UIButton>
    </View>
  );
}
