import React, { useMemo } from "react";
import { Svg, Path } from "react-native-svg";

import * as icons from "@/utils/icons";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";

export interface SIconProps {
  pathText?: string;
  path?: keyof typeof icons;
  size: number;
  className?: string;
  style?: any;
  color?: string;
  type?: "primary" | "secondary" | "link" | "success" | "danger";
}

const SIcon = (props: SIconProps) => {
  const { size, path, className, pathText, color, type, ...rest } = props;

  const { colorScheme } = useColorScheme();

  const colorIcon = useMemo(() => {
    let _color: string =
      color || colorScheme === "dark" ? Colors.s[400] : Colors.s[700];

    switch (type) {
      case "secondary":
      case "link":
        _color = colorScheme === "dark" ? Colors.s[300] : Colors.s[800];
        break;
      case "primary":
        _color = colorScheme === "dark" ? Colors.p[300] : Colors.p[500];
        break;
      case "danger":
        _color = colorScheme === "dark" ? Colors.r[300] : Colors.r[500];
        break;
      case "success":
        _color = colorScheme === "dark" ? Colors.gr[300] : Colors.gr[500];
        break;

      default:
        // _color = "#eee";
        break;
    }
    return color || _color;
  }, [type, color, colorScheme]);

  return (
    <Svg height={size} width={size} viewBox="0 0 16 16" {...rest}>
      {path || pathText ? (
        <Path d={path ? icons[path] : pathText} fill={colorIcon} />
      ) : (
        ""
      )}
    </Svg>
  );
};

export default SIcon;
