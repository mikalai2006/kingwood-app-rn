import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useAppSelector } from "@/store/hooks";
import { financyFilter, user } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import SIcon from "../ui/SIcon";

export type FinancyDateProps = {};

export function FinancyDate({}: FinancyDateProps) {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const userFromStore = useAppSelector(user);

  const financyFilterFromStore = useAppSelector(financyFilter);

  return (
    <UIButton
      type="link"
      text="dataPicker"
      className="p-2 py-3 rounded-lg bg-white dark:bg-s-900 "
      onPress={() => {
        router.push({
          pathname: "/modaldatepicker",
        });
      }}
    >
      <View className="px-2 flex flex-row items-center">
        <Text className="capitalize flex-auto text-xl font-medium text-s-800 dark:text-s-300">
          {financyFilterFromStore?.monthText}, {financyFilterFromStore?.year}
        </Text>
        <View>
          <SIcon path="iChevronRight" size={20} />
        </View>
      </View>
    </UIButton>
  );
}
