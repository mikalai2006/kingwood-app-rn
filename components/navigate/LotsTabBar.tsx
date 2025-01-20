import { Animated, View, TouchableOpacity } from "react-native";
import UIButton from "../ui/UIButton";
import { Colors } from "@/utils/Colors";

export default function LotsTabBar({
  state,
  descriptors,
  navigation,
  position,
}) {
  return (
    <View
      //   style={{ flexDirection: "row", alignItems: "center", display: "flex" }}
      className="flex flex-row items-center justify-center bg-s-100 dark:bg-s-800"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const icon = options.tabBarIcon
          ? options?.tabBarIcon({ focused: isFocused, color: Colors.g[500] })
          : undefined;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0.5)),
        });

        return (
          <UIButton
            key={index}
            type="link"
            className="flex flex-row p-4"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icon && icon}
            <Animated.Text
              style={{ opacity }}
              className="text-lg text-s-800 dark:text-s-200"
            >
              {label}
            </Animated.Text>
          </UIButton>
        );
      })}
    </View>
  );
}
