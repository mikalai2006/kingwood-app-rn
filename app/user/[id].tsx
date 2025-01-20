import { View, Text } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import ImageSlider from "@/components/image/ImageSlider";
import Card from "@/components/Card";
import UserInfo from "@/components/user/UserInfo";
import UIButton from "@/components/ui/UIButton";
import SIcon from "@/components/ui/SIcon";
import UIShareButton from "@/components/ui/UIShareButton";
import ProductCategory from "@/components/product/ProductCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Offers from "@/components/offer/Offers";
import ProductQuestionButton from "@/components/product/ProductQuestionButton";
import Darom from "@/components/darom/Darom";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";
import UIButtonBack from "@/components/ui/UIButtonBack";
import UILabel from "@/components/ui/UILabel";
import UseUser from "@/hooks/useUser";
import RImage from "@/components/r/RImage";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RRateStar from "@/components/r/RRateStar";
import UIRateStarShort from "@/components/ui/UIRateStarShort";
import { getNoun } from "@/utils/utils";

export default function UserScreen() {
  const { colorScheme } = useColorScheme();

  const pathname = usePathname();

  let { id } = useLocalSearchParams<{ id: string }>();
  const { id: id2 } = useGlobalSearchParams<{ id: string }>();
  if (!id) id = id2;

  const userFromStore = useAppSelector(user);

  const {
    user: userFromDB,
    isLoading,
    error,
  } = UseUser({
    id,
  });

  const image = useMemo(
    () => (userFromDB?.images ? userFromDB?.images[0] : null),
    [userFromDB]
  );

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-950">
      <SafeAreaView className="flex-1">
        <View className="flex flex-row px-4">
          <View className="flex-none">
            <UIButtonBack />
          </View>
          <View className="flex-auto"></View>
          <View>
            <View className="flex-row gap-4 items-end">
              {/* <UIShareButton link={`${pathname}`} /> */}
              <UIButton
                type="link"
                className="bg-s-200/20 dark:bg-s-950/20 p-2 rounded-lg"
              >
                <View className="">
                  <SIcon
                    path="iHeart"
                    size={25}
                    color={
                      colorScheme === "dark" ? Colors.s[100] : Colors.s[950]
                    }
                  />
                </View>
              </UIButton>
              {userFromStore?.id === id && (
                <UIButton
                  type="link"
                  className="bg-s-200/20 dark:bg-s-950/20 p-2 rounded-lg"
                  onPress={() => {
                    router.push("/(tabs)/profile");
                  }}
                >
                  <View className="">
                    <SIcon
                      path="iCog"
                      size={25}
                      color={
                        colorScheme === "dark" ? Colors.s[100] : Colors.s[950]
                      }
                    />
                  </View>
                </UIButton>
              )}
            </View>
          </View>
        </View>

        <ScrollView>
          <View className="bg-s-100 dark:bg-s-950 p-4">
            <View className="self-center">
              <RImage image={image} style={{ height: 200, width: 200 }} />
            </View>
            <Text className="text-center text-2xl font-bold text-g-900 dark:text-s-200 leading-6 my-4">
              {userFromDB?.name}
            </Text>
            <View className="self-center pb-4">
              <UIButton type="link" className="p-0">
                <View className="flex flex-row items-center gap-2 bg-s-500/5 p-4 rounded-lg">
                  <UIRateStarShort value={4.6} />
                  <Text className="text-lg text-s-600 dark:text-s-300">
                    - {userFromDB?.userStat?.takeReview}{" "}
                    {getNoun(
                      userFromDB?.userStat?.takeReview,
                      "отзыв",
                      "отзыва",
                      "отзывов"
                    )}
                  </Text>
                  <SIcon path="iChevronRight" size={20} />
                </View>
              </UIButton>
            </View>
            <View>
              <Text className="text-center text-lg text-g-900 dark:text-s-200 leading-6 my-1">
                Отдано лотов - {userFromDB?.userStat?.giveProduct}
              </Text>
              <Text className="text-center text-lg text-g-900 dark:text-s-200 leading-6 my-1">
                Получено лотов - {userFromDB?.userStat?.takeProduct}
              </Text>
            </View>
            <View className="flex flex-row gap-4 items-center justify-center">
              <View>
                <Text>Подписчики</Text>
                <Text className="text-center text-xl font-bold">
                  {userFromDB?.userStat.subscriber}
                </Text>
              </View>
              <View>
                <Text>Подписки</Text>
                <Text className="text-center text-xl font-bold">
                  {userFromDB?.userStat.subscribe}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
