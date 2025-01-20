import { Text } from "react-native";
import React from "react";

const RText = ({
  text,
  children,
  className,
}: {
  text?: string;
  children?: any;
  className?: string;
}) => {
  return (
    <Text
      className={className || " leading-5 text-lg text-s-700 dark:text-s-200"}
    >
      {text || children}
    </Text>
  );
};

export default RText;
