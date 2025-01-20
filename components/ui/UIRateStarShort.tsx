import { View, Text } from "react-native";
import React, { useMemo } from "react";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";

export type UIRateStarShortProps = {
  value: number;
};

const UIRateStarShort = (props: UIRateStarShortProps) => {
  const { value } = props;

  const height = useMemo(() => Math.round((value * 100) / 5), [value]);

  const { colorScheme } = useColorScheme();

  return (
    <View className="flex flex-row items-center gap-1">
      <View className="relative">
        <View className="flex flex-row items-center">
          <View>
            <SIcon
              size={20}
              path="iStar"
              color={colorScheme === "dark" ? Colors.s[600] : Colors.g[200]}
            />
          </View>
        </View>
        <View
          className="absolute bottom-0 left-0 right-0 flex items-center justify-end overflow-hidden"
          style={{ height: `${height}%` }}
        >
          <SIcon color={Colors.p[500]} size={20} path="iStarFill" />
        </View>
      </View>
      <View>
        <Text className="text-lg text-g-500 dark:text-s-200 font-bold leading-6">
          {value}
        </Text>
      </View>
    </View>
  );
};

export default UIRateStarShort;
