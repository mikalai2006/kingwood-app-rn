import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Animated, {
    useAnimatedRef,
    useSharedValue,
    useAnimatedStyle,
    runOnUI,
    measure,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated';
import Chevron from './Chevron';
// import AccordionNested from './AccordionNested';

export type Category = {
    title: string;
    content: string[];
    contentNested: NestedItem[];
    type: string;
};

export type NestedItem = {
    title: string;
    content: string[];
};

export type Data = Category[];

type Props = {
    Title: React.ReactNode;
    Content: React.ReactNode;
    value?: Category;
    twClass?: string;
    // type: string;
    // children?: React.ReactNode;
    // header?: React.ReactNode | null;
};

const Accordion = (props: Props) => {
    const {Title, Content, twClass} = props;
    const listRef = useAnimatedRef();
    const heightValue = useSharedValue(0);
    const open = useSharedValue(false);
    const progress = useDerivedValue(() => (open.value ? withTiming(1) : withTiming(0)));

    const heightAnimationStyle = useAnimatedStyle(() => ({
        height: heightValue.value,
    }));

    return (
        <View tw={`bg-white dark:bg-s-800 rounded-xl ${twClass}`}>
            <TouchableOpacity
                tw="flex flex-row items-center px-3 py-2"
                onPress={() => {
                    if (heightValue.value === 0) {
                        runOnUI(() => {
                            'worklet';
                            heightValue.value = withTiming(measure(listRef)!.height);
                        })();
                    } else {
                        heightValue.value = withTiming(0);
                    }
                    open.value = !open.value;
                }}>
                {/* <Text style={styles.textTitle}>{value.title}</Text> */}
                <View tw="flex-auto">{Title}</View>
                <Chevron progress={progress} />
            </TouchableOpacity>
            <Animated.View style={heightAnimationStyle}>
                <Animated.View tw="absolute top-0 w-full rounded-b-xl" ref={listRef}>
                    {Content}
                    {/* {type === 'regular' &&
                        value.content.map((v, i) => {
                            return (
                                <View key={i} style={styles.content}>
                                    <Text style={styles.textContent}>{v}</Text>
                                </View>
                            );
                        })}
                    {type === 'nested' && (
                        <>
                            <View style={styles.content}>
                                <Text style={styles.textContent}>{value.content}</Text>
                            </View>
                            {value.contentNested.map((val, ind) => {
                                return <AccordionNested value={val} key={ind} parentHeighValue={heightValue} />;
                            })}
                        </>
                    )} */}
                </Animated.View>
            </Animated.View>
        </View>
    );
};

export default Accordion;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E3EDFB',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#0F56B3',
        overflow: 'hidden',
    },
    textTitle: {
        fontSize: 16,
        color: 'black',
    },
    titleContainer: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        position: 'absolute',
        width: '100%',
        top: 0,
    },
    content: {
        padding: 20,
        backgroundColor: '#D6E1F0',
    },
    textContent: {
        fontSize: 14,
        color: 'black',
    },
});
