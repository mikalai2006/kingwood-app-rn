import {View, Dimensions, StyleSheet, Text} from 'react-native';
import React, {useCallback, useEffect, useImperativeHandle} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
// import {useColorScheme} from 'nativewind';
import {snapPoint} from '~utils/redash';

const {height: SCREEN_HEIGHT} = Dimensions.get('screen');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;
let snapPointsY = [0, -300, MAX_TRANSLATE_Y];

type BottomSheetProps = {
    children?: React.ReactNode;
    topheader?: React.ReactNode | null;
    isDisableBackClose?: boolean;
    onClose?: () => void;
    snapPoints: number[];
    headerPoints: number[];
};
export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
    getActiveIndex: () => number;
};

const SBottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
    ({snapPoints, headerPoints, children, topheader, onClose, isDisableBackClose}, ref) => {
        // const colorSheme = useColorScheme();
        const translateY = useSharedValue(0);
        const active = useSharedValue(false);
        const activeIndex = useSharedValue(0);

        // const onCloseCallback = useCallback(() => {
        //     'worklet';
        //     onClose && onClose();
        // }, []);

        let headerPointsY = headerPoints || [200, 170, 160];
        useEffect(() => {
            if (snapPoints && snapPoints.length > 0) {
                snapPointsY = snapPoints;
                snapPointsY.push(MAX_TRANSLATE_Y);
            } else {
                snapPointsY = snapPoints;
                snapPointsY.push(MAX_TRANSLATE_Y);
            }
        }, []);

        const scrollTo = useCallback((destination: number) => {
            'worklet';

            active.value = destination !== 0;
            // console.log('destination: ', destination);

            translateY.value = withTiming(destination, {
                easing: Easing.linear,
                duration: 300,
            }); // withSpring(destination, {damping: 150, duration: 500});

            if (destination === 0 && onClose) {
                onClose && runOnJS(onClose)();
            }
        }, []);

        const isActive = useCallback(() => {
            return active.value;
        }, []);

        const getActiveIndex = useCallback(() => {
            return activeIndex.value;
        }, []);

        useImperativeHandle(ref, () => ({scrollTo, isActive, getActiveIndex}), [scrollTo, isActive, getActiveIndex]);

        const ctx = useSharedValue({y: 0});
        const gesture = Gesture.Pan()
            .onStart(() => {
                ctx.value = {y: translateY.value};
            })
            .onUpdate(event => {
                // console.log(event.translationY);

                translateY.value = event.translationY + ctx.value.y;
                translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
            })
            .onEnd(({translationY, translationX, velocityX, velocityY}) => {
                const snapPointY = snapPoint(translateY.value, velocityY, snapPointsY);
                activeIndex.value = snapPointsY.findIndex(x => x === snapPointY);
                // console.log('; snapPointY=', snapPointY, activeIndex.value);
                // if (translateY.value > -SCREEN_HEIGHT / 3) {
                //     scrollTo(0);
                // } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
                //     scrollTo(MAX_TRANSLATE_Y);
                // }
                scrollTo(snapPointY);
            });

        const rBottomSheetStyle = useAnimatedStyle(() => {
            const borderRadius = interpolate(
                translateY.value,
                [MAX_TRANSLATE_Y, MAX_TRANSLATE_Y + 100],
                [0, 15],
                Extrapolate.CLAMP,
            );
            return {
                transform: [{translateY: translateY.value + (translateY.value >= 0 ? 0 : 0)}],
                borderRadius,
            };
        });

        const rTopHeader = useAnimatedStyle(() => {
            const height = interpolate(
                translateY.value,
                [MAX_TRANSLATE_Y, -600, -300],
                headerPointsY,
                Extrapolate.CLAMP,
            );

            return {
                height,
            };
        });

        const rTopMargin = useAnimatedStyle(() => {
            const marginTop = interpolate(
                translateY.value,
                [MAX_TRANSLATE_Y, -300, 0],
                [0, -60, -100],
                Extrapolate.CLAMP,
            );
            return {
                marginTop,
            };
        });
        const rTouchElement = useAnimatedStyle(() => {
            const top = interpolate(translateY.value, [MAX_TRANSLATE_Y, -300, 0], [20, 10, 0], Extrapolate.CLAMP);
            return {
                top,
            };
        });

        const rBackdropStyle = useAnimatedStyle(() => {
            return {
                opacity: withTiming(active.value ? 1 : 0),
            };
        }, []);

        const rBackdropProps = useAnimatedProps(() => {
            return {
                pointerEvents: active.value ? 'auto' : 'none',
            };
        }, []);

        return (
            <>
                <Animated.View
                    animatedProps={rBackdropProps}
                    onTouchStart={() => {
                        if (!isDisableBackClose) {
                            scrollTo(0);
                        }
                    }}
                    style={[
                        {
                            ...StyleSheet.absoluteFillObject,
                            // backgroundColor: colorSheme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,.8)',
                        },
                        rBackdropStyle,
                    ]}
                    tw="bg-black/30 dark:bg-black/40"
                />
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        tw="absolute top-0 bg-s-100 dark:bg-s-950 w-full"
                        style={[styles.widgetBottomSheetContainer, rBottomSheetStyle]}>
                        <View tw="relative flex-1">
                            <Animated.View tw="absolute left-0 right-0 z-20 w-full" style={[rTouchElement]}>
                                <View tw="w-16 h-1.5 bg-black/50 rounded-md my-2 mx-auto" />
                            </Animated.View>
                            {topheader && <Animated.View style={[rTopHeader]}>{topheader}</Animated.View>}
                            <Animated.View
                                tw="flex-1"
                                style={[topheader ? rTopMargin : {}, topheader ? {height: SCREEN_HEIGHT - 200} : {}]}>
                                {children}
                            </Animated.View>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </>
        );
    },
);

const styles = StyleSheet.create({
    widgetBottomSheetContainer: {
        height: SCREEN_HEIGHT,
        top: SCREEN_HEIGHT,
        borderRadius: 15,
    },
    line: {},
});

export default SBottomSheet;
