import RText from "@/components/r/RText";
import UIButton from "@/components/ui/UIButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { filter, setFilterSort } from "@/store/storeSlice";
import { ISort } from "@/types";
import { View } from "react-native";

export default function Modal() {
  const dispatch = useAppDispatch();

  const filterFromStore = useAppSelector(filter);

  const listSort: ISort[] = [
    {
      key: "cost",
      title: "Дешевле->Дороже",
      icon: "iSortNumDown",
      value: 1,
    },
    {
      key: "cost",
      title: "Дороже->Дешевле",
      icon: "iSortNumUp",
      value: -1,
    },
    {
      key: "title",
      title: "По названию от А до Я",
      icon: "iSortAlphaDown",
      value: 1,
    },
    {
      key: "title",
      title: "По названию от Я до А",
      icon: "iSortAlphaUp",
      value: -1,
    },
    {
      key: "created_at",
      title: "Сначала недавно добавленные",
      icon: "iSortDownAlt",
      value: 1,
    },
    {
      key: "created_at",
      title: "Сначала давно добавленные",
      icon: "iSortDown",
      value: -1,
    },
  ];

  const onToggleSort = (sort: ISort) => {
    const newValue = Object.assign({}, filterFromStore.sort);
    newValue.key = sort.key;
    newValue.value = sort.value;
    newValue.icon = sort.icon;
    dispatch(setFilterSort(newValue));
  };

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950 p-4">
      <View className=" bg-white dark:bg-s-800 rounded-lg p-4">
        <View className="flex gap-4 bg-white dark:bg-s-900 rounded-lg p-4">
          <RText text="Сортировка" />
          {listSort.map((item, index) => (
            <UIButton
              key={index.toString()}
              type={
                filterFromStore.sort.key === item.key &&
                filterFromStore.sort.value === item.value
                  ? "primary"
                  : "secondary"
              }
              text={item.title}
              icon={item.icon}
              onPress={() => {
                onToggleSort(item);
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
