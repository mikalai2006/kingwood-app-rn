import {View, Text} from 'react-native';
import React from 'react';
import {IUser} from '~store/appSlice';
import RImage from '~components/r/RImage';

export interface ISUserProps {
    user: IUser;
}
const SUser = (props: ISUserProps) => {
    const {user} = props;
    return (
        <View tw="flex flex-row items-center gap-2">
            <View tw="relative">
                <RImage image={user.images[0]} classString="w-8 h-8 rounded-full" />
                <View tw="absolute -right-1 bottom-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-s-800" />
            </View>
            <View>
                <Text tw="text-black dark:text-white leading-4">{user.name}</Text>
                <Text tw="text-s-500 leading-4">{user.login}</Text>
            </View>
        </View>
    );
};

export default SUser;
