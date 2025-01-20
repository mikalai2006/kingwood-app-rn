import React from 'react';
import {Text, View} from 'react-native';
import Accordion from './Accordion/Accordion';
import SIcon from './SIcon';
import {iWarning} from '~utils/icons';

type Props = {
    titleText?: string;
    contentText?: string;
    twClass?: string;
    // children?: React.ReactNode;
    // header?: React.ReactNode | null;
    Title?: React.ReactNode;
    Content?: React.ReactNode;
};

const UIInfo = (props: Props) => {
    const {contentText, Title, Content, twClass, titleText} = props;
    return (
        <Accordion
            twClass={twClass}
            Title={
                Title || (
                    <View tw="flex flex-row items-center">
                        <SIcon path={iWarning} size={25} tw="mr-2 text-red-500 dark:text-red-300" />
                        <Text tw="text-s-900 dark:text-s-100 leading-5 text-lg">{titleText}</Text>
                    </View>
                )
            }
            Content={
                Content || (
                    <View tw="flex flex-row p-4 pt-0">
                        <View tw="flex-auto">
                            {/* <Text tw="text-black dark:text-red-200 font-bold leading-5 text-lg">{title}</Text> */}
                            <Text tw="text-s-900 dark:text-s-200 text-base leading-5">{contentText}</Text>
                            <View tw="flex items-start">
                                {/* <TouchableOpacity
                                onPress={() => {}}
                                tw="p-2 bg-red-900/10 flex items-center justify-center rounded-lg">
                                <Text tw="text-black dark:text-red-200 text-base">{t('general:delete')}</Text>
                            </TouchableOpacity> */}
                            </View>
                        </View>
                    </View>
                )
            }
        />
    );
};

export default UIInfo;
