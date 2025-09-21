import { Text, View } from "react-native";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export type TaskWorkerNotifyActiveTaskNoModalProps = {};

export function TaskWorkerNotifyActiveTaskNoModal({}: TaskWorkerNotifyActiveTaskNoModalProps) {
  const { t } = useTranslation();

  return (
    <View className="rounded-lg p-1 px-1 flex flex-row items-center gap-3">
      {/* <View className="">
        <SIcon path="iWarningCircle" size={25} color={Colors.white} />
      </View> */}
      <UIButton
        type="link"
        className="flex-auto flex flex-row items-center gap-0 p-1"
        onPress={() => {
          router.push({ pathname: "/(tabs)/order" });
        }}
      >
        <Text
          textBreakStrategy="balanced"
          className="flex-auto text-sm text-white dark:text-white"
        >
          {t("button.checkTask")}
        </Text>
        <SIcon path="iChevronRight" size={15} color={Colors.white} />
      </UIButton>
    </View>
  );
}
