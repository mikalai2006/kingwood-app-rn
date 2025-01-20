import { Text, type TextProps, StyleSheet } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  className,
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={className + " text-s-900 dark:text-s-100"}
      // style={[
      //   // { color },
      //   // type === 'default' ? styles.default : undefined,
      //   // type === 'title' ? styles.title : undefined,
      //   // type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
      //   // type === 'subtitle' ? styles.subtitle : undefined,
      //   // type === 'link' ? styles.link : undefined,
      //   style,
      // ]}
      {...rest}
    />
  );
}
