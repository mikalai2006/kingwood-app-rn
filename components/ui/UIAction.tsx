import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import UIButton from "./UIButton";

export interface ICountryProps {
  value: number[];
  onSetValue: (value: number[]) => void;
  title?: string;
  type?: "single" | "multiply";
}

export default function UIAction({
  value,
  type,
  title,
  onSetValue,
}: ICountryProps) {
  const actions = [
    { id: 1, title: "По первому запросу" },
    { id: 2, title: "Аукцион" },
  ];

  const onChangeValue = (a: (typeof actions)[0]) => {
    if (type === "single") {
      onSetValue([a.id]);
    } else if (type === "multiply") {
      if (value.includes(a.id)) {
        const indexItem = value.findIndex((x) => x === a.id);
        const newValue = value.slice();
        newValue.splice(indexItem, 1);
        onSetValue([...newValue]);
      } else {
        const newValue = value.slice();
        newValue.push(a.id);
        onSetValue([...newValue]);
      }
    }
  };

  return (
    <ScrollView>
      <View>
        <Text className="text-md text-s-500 dark:text-s-400 mb-1.5">
          {title}
        </Text>
        <View className="flex flex-row flex-wrap items-center gap-2">
          {actions.map((item, index) => (
            <UIButton
              key={index.toString()}
              type={value.includes(item.id) ? "primary" : "secondary"}
              text={item.title}
              onPress={() => {
                onChangeValue(item);
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
