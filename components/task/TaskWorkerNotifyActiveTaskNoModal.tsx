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
    <View className="bg-r-500 rounded-lg mt-1.5 p-2 px-2 flex flex-row items-center gap-3">
      {/* <View className="">
        <SIcon path="iWarningCircle" size={25} color={Colors.white} />
      </View> */}
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
