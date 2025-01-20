import React from "react";
import { View, Animated, useWindowDimensions } from "react-native";

export default function ImageSliderPagination({ slides, scrollX }) {
  const { width } = useWindowDimensions();

  return (
    <View className="py-2 pb-4 w-full items-stretch justify-center flex flex-row flex-nowrap gap-2">
      {slides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 24, 12],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            className="h-3 rounded-full bg-p-500"
            key={i.toString()}
            style={[{ width: dotWidth, opacity }]}
          />
        );
      })}
    </View>
  );
}
