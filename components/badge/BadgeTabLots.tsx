import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "@realm/react";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { OrderSchema } from "@/schema";

const BadgeTabLots = () => {
  const userFromStore = useAppSelector(user);

  const newOrders = useQuery(OrderSchema, (items) =>
    items.filtered("name != ''")
  );

  const questionsWithoutAnswer = useQuery(QuestionSchema, (items) =>
    items.filtered("answer == '' AND userId == $0", userFromStore?.id)
  );

  return (newOrders && newOrders?.length) ||
    (questionsWithoutAnswer && questionsWithoutAnswer?.length) ? (
    <View className="w-5 h-5 rounded-full bg-green-500 absolute -top-1 -right-2 border-2 border-s-100 dark:border-s-800" />
  ) : null;
};

export default BadgeTabLots;
