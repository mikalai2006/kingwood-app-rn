import React, { useRef, useState } from "react";
import { View, FlatList, Animated } from "react-native";

import OnboardingItem from "./ImageSliderItem";

import OnboardingPagination from "./ImageSliderPagination";
import { IImage } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";

export type TImageSliderProps = {
  slides: IImage[];
};

export default function ImageSlider(props: TImageSliderProps) {
  const { slides } = props;

  const { colorScheme } = useColorScheme();

  const slidesRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 1 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
    }
  };

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-950">
      <FlatList
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        style={[{ flex: 1 }]}
      />
      {/* <LinearGradient
        colors={[
          "transparent",
          colorScheme === "dark" ? Colors.s[950] : Colors.s[200],
        ]}
        dither={false}
        className="absolute bottom-0 left-0 right-0 h-20"
      /> */}
      <View className="absolute bottom-0 left-0 right-0 z-50">
        <OnboardingPagination slides={slides} scrollX={scrollX} />
      </View>
    </View>
  );
}
