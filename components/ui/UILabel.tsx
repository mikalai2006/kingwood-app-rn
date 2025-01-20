import React from "react";
import { Text, TextProps } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type Props = TextProps & {
  text?: string;
};

const UILabel = ({ text, ...rest }: Props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Text
      className="self-start text-s-500 dark:text-s-500 -mt-2 mb-3"
      {...rest}
    >
      {text}
    </Text>
  );
};

export default UILabel;
