import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "@realm/react";
import { MessageSchema } from "@/schema/MessageSchema";
import { QuestionSchema } from "@/schema/QuestionSchema";

const BadgeTabQuestion = () => {
  // const newMessage = useQuery(MessageSchema, (items) =>
  //   items.filtered("status == 1")
  // );
  const newQuestions = useQuery(QuestionSchema, (items) =>
    items.filtered("status == 1")
  );
  return newQuestions?.length ? (
    <View className="w-5 h-5 rounded-full bg-green-500 absolute -top-1 -right-2 border-2 border-s-100 dark:border-s-800" />
  ) : null;
};

export default BadgeTabQuestion;
