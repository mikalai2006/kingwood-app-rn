import { View, Share, Alert, Button } from "react-native";
import React from "react";
import UIButton from "./UIButton";
import SIcon from "./SIcon";
import { useColorScheme } from "nativewind";
import { Colors } from "@/utils/Colors";

export interface IUIShareButtonProps {
  link: string;
}

export default function UIShareButton(props: IUIShareButtonProps) {
  const { link } = props;

  const { colorScheme } = useColorScheme();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <View>
      <UIButton
        type="secondary"
        className="bg-s-200/20 dark:bg-s-950/20 p-2 rounded-lg"
        onPress={onShare}
      >
        <View className="">
          <SIcon
            path="iReply"
            size={25}
            color={colorScheme === "dark" ? Colors.s[100] : Colors.s[950]}
          />
        </View>
      </UIButton>
    </View>
  );
}
