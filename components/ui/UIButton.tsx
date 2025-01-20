import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/utils/Colors";
import SIcon from "./SIcon";
import * as icons from "@/utils/icons";
import { TouchableOpacityProps } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";

export type UIButtonProps = TouchableOpacityProps & {
  text?: string;
  disabled?: boolean;
  onPress?: () => void;
  loading?: boolean;
  icon?: keyof typeof icons;
  twClass?: string;
  textClass?: string;
  children?: any;
  className?: string;
  type: "secondary" | "primary" | "link" | "danger" | "success";
  startText?: boolean;
};

export default function UIButton(props: UIButtonProps) {
  const { colorScheme } = useColorScheme();

  const classBtn = React.useMemo(() => {
    let result = "p-3 rounded-lg";

    const disableClass = " bg-transparent ";

    switch (props.type) {
      case "primary":
        result += props.disabled ? disableClass : " bg-p-500 border-p-500 ";
        break;
      case "danger":
        result += props.disabled ? disableClass : " bg-r-500 border-r-500 ";
        break;
      case "success":
        result += props.disabled ? disableClass : " bg-gr-500 border-gr-500 ";
        break;
      case "secondary":
        result += props.disabled ? disableClass : " bg-s-200 dark:bg-black/20 ";
        break;
      case "link":
        result += props.disabled
          ? disableClass
          : " bg-transparent border-transparent";
        break;
      default:
        result += "bg-s-200";
        break;
    }

    return result + ` ${props.twClass}`;
  }, [props.disabled, props.twClass, props.type]);

  const classText = React.useMemo(() => {
    let result = "text-lg px-2 leading-6 ";

    const disableClass = " text-s-300 dark:text-s-700 ";

    switch (props.type) {
      case "primary":
        result += props.disabled ? disableClass : " text-p-50";
        break;
      case "danger":
        result += props.disabled ? disableClass : " text-r-50";
        break;
      case "success":
        result += props.disabled ? disableClass : " text-gr-50";
        break;
      case "secondary":
        result += props.disabled ? disableClass : " text-s-800 dark:text-s-50";
        break;
      default:
        result += "text-s-700 dark:text-s-500";
        break;
    }

    return props.textClass ? props.textClass : result;
  }, [props.disabled, props.twClass, props.type, props.textClass]);

  // const classIcon = React.useMemo(() => {
  //   let result = "";

  //   const disableClass = " text-s-300 dark:text-s-500 ";

  //   switch (props.type) {
  //     case "primary":
  //       result += props.disabled ? disableClass : " text-p-50";
  //       break;
  //     case "secondary":
  //       result += props.disabled ? disableClass : " text-s-800 dark:text-s-50";
  //       break;
  //     default:
  //       result += "";
  //       break;
  //   }

  //   return result + ` ${props.twClass}`;
  // }, [props.disabled, props.twClass, props.type]);

  const colorLoader = React.useMemo(() => {
    let result = "";

    const disableColor = colorScheme === "dark" ? Colors.s[700] : Colors.s[200];

    switch (props.type) {
      case "primary":
        result = props.disabled ? disableColor : Colors.white;
        break;
      case "success":
        result = props.disabled ? disableColor : Colors.gr[100];
        break;
      case "danger":
        result = props.disabled ? disableColor : Colors.r[100];
        break;
      case "secondary":
        result = props.disabled ? disableColor : Colors.s[400];
        break;
      default:
        result = disableColor;
        break;
    }

    return result;
  }, [props.disabled, props.type, colorScheme]);

  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      activeOpacity={0.5}
      className={props?.className || classBtn}
    >
      {props.children || (
        <View className="flex flex-row items-center justify-center">
          {props.startText && props.text && (
            <Text className={classText}>{props.text}</Text>
          )}
          {props.loading ? (
            <ActivityIndicator size={20} color={colorLoader} />
          ) : props.icon ? (
            <View>
              <SIcon
                path={props.icon}
                size={20}
                type={props.type}
                color={colorLoader}
              />
            </View>
          ) : null}
          {!props.startText && props.text && (
            <Text className={classText}>{props.text}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
