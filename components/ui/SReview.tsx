import {View, Text} from 'react-native';
import React from 'react';
import {IReview} from '~store/appSlice';
import SRateStar from './SRateStar';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import WidgetUserInfo from '~components/widgets/user/WidgetUserInfo';

export interface IReviewProps {
    review: IReview;
}

export default function SReview({review}: IReviewProps) {
    const {t} = useTranslation();

    return (
        <View tw="px-3 pb-6 flex flex-row">
            {/* <View tw="pr-1">
                <RImage image={review?.user?.images[0]} classString="h-12 w-12 rounded-full mr-2" />
            </View> */}
            <View tw="flex-auto">
                <View tw="flex-auto bg-white dark:bg-s-800 p-3 rounded-xl relative">
                    <View tw="mb-3">
                        <WidgetUserInfo userData={review?.user} />
                    </View>
                    {/* <View tw="rotate-[45deg] transform absolute top-2 -left-1 w-4 h-4 bg-white dark:bg-s-800" /> */}
                    <View tw="self-start">
                        {/* <Text tw="text-lg text-s-400">{review?.user?.name || t('general:iam')}</Text> */}
                        <View tw="flex flex-row items-center space-x-4">
                            <SRateStar value={review.rate} />
                        </View>
                    </View>
                    <Text tw="text-base text-s-900 dark:text-s-200 leading-5">{review.review}</Text>
                </View>
                {review.updatedAt && (
                    <Text tw="text-right text-sm text-s-400">{dayjs(review.updatedAt).fromNow()}</Text>
                )}
            </View>
        </View>
    );
}
