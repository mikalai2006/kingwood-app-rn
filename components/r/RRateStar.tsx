import { View, Text } from "react-native";
import React from "react";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";

export type RRateStarProps = {
  value: number;
};

const RRateStar = (props: RRateStarProps) => {
  // console.log('------------SRateStar');
  const { value } = props;
  const width = (value * 100) / 5;

  return (
    <View className="relative">
      <View className="flex flex-row items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={`empty_${i.toString()}`} className="">
            <SIcon
              className="text-s-300 dark:text-s-700"
              size={15}
              path="iStar"
            />
          </View>
        ))}
      </View>
      <View
        className="absolute top-0 left-0 right-0 flex flex-row overflow-hidden items-center"
        style={{ width }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={`fill_${i.toString()}`} className="">
            <SIcon color={Colors.yellow[500]} size={15} path="iStarFill" />
          </View>
        ))}
      </View>
    </View>
  );
};

export default RRateStar;
