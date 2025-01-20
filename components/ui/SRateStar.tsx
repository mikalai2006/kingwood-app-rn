import {View, Text} from 'react-native';
import React from 'react';
import {iStar, iStarFill} from '~utils/icons';
import SIcon from './SIcon';

const SRateStar = props => {
    // console.log('------------SRateStar');
    const {value} = props;
    const width = (value * 100) / 5;

    return (
        <View tw="relative">
            <View tw="flex flex-row items-center">
                {[0, 1, 2, 3, 4].map(i => (
                    <View key={`empty_${i.toString()}`} tw="">
                        <SIcon tw="text-s-300 dark:text-s-700" size={20} path={iStar} />
                    </View>
                ))}
            </View>
            <View tw="absolute top-0 left-0 right-0 flex flex-row overflow-hidden items-center" style={{width}}>
                {[0, 1, 2, 3, 4].map(i => (
                    <View key={`fill_${i.toString()}`} tw="">
                        <SIcon tw="text-yellow-500" size={20} path={iStarFill} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default SRateStar;
