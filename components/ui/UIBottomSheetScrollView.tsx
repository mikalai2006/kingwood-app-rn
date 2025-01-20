import {View, useWindowDimensions} from 'react-native';
import React, {useCallback} from 'react';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetProps,
    BottomSheetScrollView,
    useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {useColorScheme} from 'nativewind';
import colors from '~utils/colors';

export interface UIBottomSheetProps extends BottomSheetProps {
    children: React.ReactNode;
    header?: React.ReactNode | null;
    isDisableBackClose?: boolean;
    snapPoints: (number | string)[];
    onClose?: () => void;
}
export type Ref = BottomSheet;

const UIBottomSheetScrollView = React.forwardRef<Ref, UIBottomSheetProps>(
    ({snapPoints, children, header, onClose, ...rest}, ref) => {
        const {colorScheme} = useColorScheme();
        const dimensions = useWindowDimensions();

        if (!snapPoints) {
            snapPoints = ['25%', '50%', '75%', '100%'];
        }

        const renderBackdrop = useCallback(
            props => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={2}
                    // opacity={1}
                    pressBehavior={'close'}
                />
            ),
            [],
        );
        const animationConfigs = useBottomSheetSpringConfigs({
            damping: 80,
            overshootClamping: true,
            restDisplacementThreshold: 0.1,
            restSpeedThreshold: 0.1,
            stiffness: 1000,
            duration: 250,
        });
        // const animationConfigs = useBottomSheetTimingConfigs({
        //     duration: 250,
        //     easing: Easing.linear,
        // });

        return (
            <BottomSheet
                ref={ref}
                animationConfigs={animationConfigs}
                // key={localNode._id?.toHexString()}
                onClose={() => {
                    onClose && onClose();
                }}
                snapPoints={snapPoints}
                // index={0}
                enablePanDownToClose={true}
                // enableContentPanningGesture={true}
                backgroundStyle={{
                    backgroundColor: colorScheme === 'dark' ? colors.s[950] : colors.s[100],
                    borderRadius: dimensions.width >= 768 ? 0 : 30,
                }}
                backdropComponent={renderBackdrop}
                {...rest}>
                {header && <View>{header}</View>}
                <BottomSheetScrollView contentContainerStyle={{}} keyboardShouldPersistTaps="handled" tw="flex-1">
                    {children}
                </BottomSheetScrollView>
            </BottomSheet>
        );
    },
);

export default UIBottomSheetScrollView;
