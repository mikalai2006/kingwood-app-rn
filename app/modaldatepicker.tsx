import Card from "@/components/Card";
import RText from "@/components/r/RText";
import UIButton from "@/components/ui/UIButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { financyFilter, setFinancyFilter } from "@/store/storeSlice";
import dayjs from "@/utils/dayjs";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ModalDatePicker() {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const currentDate = useMemo(() => dayjs(new Date()), []);

  const months = useMemo(() => dayjs.months(), []);
  const monthsShort = useMemo(() => dayjs.monthsShort(), []);

  const financyFilterFromStore = useAppSelector(financyFilter);

  const [year, setYear] = useState(financyFilterFromStore?.year);
  const [monthIndex, setMonthIndex] = useState(
    financyFilterFromStore?.monthIndex
  );

  // const onChangeYear = (_year: number) => {
  //   setYear(_year);
  //   dispatch(
  //     setFinancyFilter({
  //       month: financyFilterFromStore.month,
  //       year: _year,
  //       monthText: financyFilterFromStore.monthText,
  //       monthIndex: financyFilterFromStore.monthIndex,
  //     })
  //   );
  // };
  // const onChangeMonth = (_month: number) => {
  //   setMonthIndex(_month);
  //   dispatch(
  //     setFinancyFilter({
  //       month: _month + 1,
  //       year: financyFilterFromStore.year,
  //       monthText: months[_month],
  //       monthIndex: _month,
  //     })
  //   );
  // };

  const onChangeFilter = () => {
    dispatch(
      setFinancyFilter({
        month: monthIndex + 1,
        year: year,
        monthText: months[monthIndex],
        monthIndex: monthIndex,
      })
    );
    router.canGoBack() && router.back();
  };

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950 p-4">
      <Card className="gap-4">
        <RText text="Выберите год" />
        <ScrollView horizontal>
          <View className="flex flex-row gap-4">
            {[
              currentDate.subtract(3, "year").year(),
              currentDate.subtract(2, "year").year(),
              currentDate.subtract(1, "year").year(),
              currentDate.year(),
            ].map((item, index) => (
              <UIButton
                key={index.toString()}
                type={item === year ? "primary" : "secondary"}
                text={item.toString()}
                onPress={() => {
                  setYear(item);
                }}
              />
            ))}
          </View>
        </ScrollView>
        <RText text="Выберите месяц" />
        <ScrollView className="flex">
          <View className="flex flex-row flex-wrap gap-4">
            {months.map((item, index) => (
              <UIButton
                key={index.toString()}
                type={index === monthIndex ? "primary" : "secondary"}
                text={item}
                onPress={() => {
                  setMonthIndex(index);
                }}
              />
            ))}
          </View>
        </ScrollView>
        <UIButton
          type="primary"
          text={t("button.save")}
          disabled={
            financyFilterFromStore.year == year &&
            financyFilterFromStore.monthIndex == monthIndex
          }
          onPress={() => {
            onChangeFilter();
          }}
        />
      </Card>
    </View>
  );
}
