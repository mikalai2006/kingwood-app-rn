import React from 'react';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import SIcon from '../SIcon';
import {iChevronDown} from '~utils/icons';

type Props = {
    progress: Readonly<SharedValue<0 | 1>>;
};

const Chevron = ({progress}: Props) => {
    const iconStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${progress.value * -180}deg`}],
    }));
    return (
        <Animated.View style={iconStyle}>
            <SIcon path={iChevronDown} size={30} tw="text-s-600 dark:text-s-300" />
            {/* <Image source={require('../assets/Chevron.png')} style={styles.chevron} /> */}
        </Animated.View>
    );
};

export default Chevron;

// const styles = StyleSheet.create({
//     chevron: {
//         width: 24,
//         height: 24,
//     },
// });
