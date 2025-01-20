import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useAppSelector } from "@/store/hooks";
import { categories } from "@/store/storeSlice";
import UIButton from "./UIButton";
import { Link, router } from "expo-router";
import RText from "../r/RText";
import SIcon from "./SIcon";

export interface ICountryProps {
  value: string;
  // onSetCategoryId: (value: any) => void;
  title?: string;
}

const UICategory = ({ value, title }: ICountryProps) => {
  const categoriesFromStore = useAppSelector(categories);

  const activeCategory = useMemo(
    () => categoriesFromStore.find((x) => x.id === value),
    [categoriesFromStore, value]
  );

  return (
    <ScrollView>
      <View>
        <Text className="text-md text-s-500 dark:text-s-400 mb-1.5">
          {title}
        </Text>
        <UIButton
          type="link"
          onPress={() => {
            router.navigate("/modalcategory");
            router.setParams({ categoryId: value });
          }}
          className=" border border-s-200 dark:border-s-700 p-4 rounded-lg"
        >
          <View className="flex flex-row items-center gap-4">
            {/* <View className="flex-auto"><RText>Категория:</RText></View> */}
            <View className="flex-auto">
              {activeCategory ? (
                <RText className="text-p-500 font-bold text-lg leading-5">
                  {activeCategory.title}
                </RText>
              ) : (
                <RText>Выберите категорию</RText>
              )}
            </View>
            <View>
              <SIcon path="iChevronRight" size={20} />
            </View>
          </View>
        </UIButton>
      </View>
    </ScrollView>
  );
};

export default UICategory;
