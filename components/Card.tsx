import { View, Text } from "react-native";
import React from "react";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type Props = {
  children?: any;
  className?: string;
};

const Card = ({ className, children }: Props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      className={"bg-white dark:bg-s-900 p-4 rounded-lg shadow-md " + className}
    >
      {children}
    </View>
  );
};

export default Card;
