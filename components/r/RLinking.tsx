import { Linking, Text, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import SIcon from "../ui/SIcon";

export interface IRLinkingProps {
  file?: any;
  uri?: string;
  className?: string;
  style?: any;
  classString?: string;
}

const placeholder = require("@/assets/images/placeholder.png");

const RLinking = (props: IRLinkingProps) => {
  const { file } = props;
  const link = useMemo(() => {
    return `http://localhost:8000/images/${file.userId}/${file.service}/${file.serviceId}/${file.path}${file.ext}`;
  }, []);

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(link)}
      className="relative h-20 w-20 bg-s-200 dark:bg-s-600 rounded-lg flex items-center justify-center"
    >
      <SIcon path="iFile" size={35} />
      <Text className="absolute bottom-0 left-0 p-0.5 rounded-lg bg-s-200 dark:bg-s-600 text-black dark:text-s-100 text-base font-medium">
        {file.ext}
      </Text>
    </TouchableOpacity>
  );
};

export default RLinking;
