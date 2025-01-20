import { Text, TextProps } from "react-native";
import React from "react";

export type RTitleProps = TextProps & {
  text: string;
  className?: string;
};

const RTitle = ({ text, className, ...rest }: RTitleProps) => {
  return (
    <Text
      className={
        "pb-1 text-2xl font-bold text-s-600 dark:text-s-200 " + className
      }
    >
      {text}
    </Text>
  );
};

export default RTitle;
