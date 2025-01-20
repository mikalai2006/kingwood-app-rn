import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";
import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

type Props = PropsWithChildren<{
  header: ReactElement | null;
  headerImage: ReactElement | null;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  header,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const { width } = useWindowDimensions();
  const HEADER_HEIGHT = width;
  const { colorScheme } = useColorScheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    // console.log(scrollY.value);
  });

  const headerImageAnimatedStyle = useAnimatedStyle(() => {
    const translateY = {
      translateY: interpolate(
        scrollY.value,
        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
        [0, 0, HEADER_HEIGHT * 0.75],
        Extrapolation.CLAMP
      ),
    };

    return {
      transform: [
        translateY,
        {
          scale: interpolate(scrollY.value, [0, HEADER_HEIGHT], [1, 2], {
            extrapolateRight: Extrapolation.CLAMP,
          }),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      // opacity: interpolate(
      //   scrollOffset.value,
      //   [-100, 0, HEADER_HEIGHT],
      //   [0, 1, 0]
      // ),
      // transform: [
      //   {
      //     translateY: interpolate(
      //       scrollY.value,
      //       [0, 100],
      //       [40, 60],
      //       Extrapolation.CLAMP
      //     ),
      //   },

      // ],
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, HEADER_HEIGHT - 100],
        ["transparent", colorScheme === "dark" ? Colors.s[950] : Colors.s[100]]
      ),
    };
  });

  return (
    <View style={styles.container} className="bg-s-200 dark:bg-s-950">
      <Animated.View
        style={[headerAnimatedStyle]}
        className="absolute top-0 w-full z-10 p-4 pt-10"
      >
        {header}
      </Animated.View>
      <View className="flex-1">
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {headerImage && (
            <Animated.View
              style={[
                headerImageAnimatedStyle,
                styles.header,
                { height: HEADER_HEIGHT },
                // { backgroundColor: headerBackgroundColor[colorScheme] },
              ]}
              className="bg-p-200 dark:bg-p-950 flex-1"
            >
              {headerImage}
            </Animated.View>
          )}
          <View
            style={{
              ...styles.content,
              marginTop: headerImage == null ? 70 : 0,
            }}
          >
            {children}
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 0,
    gap: 16,
    overflow: "hidden",
  },
});
