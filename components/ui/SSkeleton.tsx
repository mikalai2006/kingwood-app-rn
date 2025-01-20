import { Animated, Text, ViewProps } from "react-native";
import React, { useEffect, useRef } from "react";

type SkeletonProps = ViewProps & {
  width?: string | number | null | undefined;
  className?: string;
  text?: string;
  textClassString?: string;
  children?: React.ReactNode;
};

export const SSkeleton: React.FC<SkeletonProps> = ({
  width,
  className,
  text,
  textClassString,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start();
  }, [opacity]);

  const cssClassName = `flex items-center justify-center rounded-lg ${className}`; //bg-s-200 dark:bg-s-800
  const cssText = `text-s-400 dark:text-s-500 ${textClassString}`;

  return (
    <Animated.View
      style={{ opacity: opacity.current }}
      className={cssClassName}
    >
      {text && <Text className={cssText}>{text} ...</Text>}
      {children && children}
    </Animated.View>
  );
};
