import { View, Text } from "react-native";
import React from "react";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import RImage from "../r/RImage";
import dayjs from "@/utils/dayjs";
import SIcon from "../ui/SIcon";
import { useObject } from "@realm/react";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { BSON } from "realm";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import UserInfoAvatar from "../user/UserInfoAvatar";
import { OrderSchema } from "@/schema";

export type QuestionButtonProps = {
  question: QuestionSchema;
};

const QuestionButton = (props: QuestionButtonProps) => {
  const { question } = props;

  const userFromStore = useAppSelector(user);

  const product = useObject(OrderSchema, new BSON.ObjectId(question.productId));

  return product && question ? (
    <UIButton
      type="link"
      className="m-0 py-1 bg-white dark:bg-s-950 border-b border-s-200 dark:border-s-800"
      onPress={() => {
        router.push({
          pathname: `/modalquestion/[id]/answer/[questionId]`,
          params: {
            id: product._id.toString(),
            questionId: question._id.toString(),
          },
        });
      }}
    >
      <View className="flex flex-row items-center gap-2">
        <View className="p-2">
          {product?.images && (
            <RImage
              className="h-20 aspect-square rounded-lg"
              image={product.images[0]}
            />
          )}
          <View
            className="absolute bottom-0 right-0 border-s-50 dark:border-s-950"
            style={{ borderWidth: 5, borderRadius: 50 }}
          >
            <UserInfoAvatar
              userId={question.userId}
              borderColor="border-s-50 dark:border-s-950"
            />
          </View>
        </View>
        {/* <View>
                  {item.images.slice(1).map((img, index) => (
                    <RImage key={index} className="h-8 w-8" image={img} />
                  ))}
                </View> */}
        <View className="flex-auto flex flex-row items-center gap-4">
          <View className="flex-auto">
            <Text
              numberOfLines={1}
              className="mb-2 text-base leading-5 text-g-400 dark:text-s-400"
            >
              {product.description}
            </Text>
            <Text className="text-lg font-semibold leading-5 text-s-800 dark:text-s-200">
              {question.question}
            </Text>
            <Text className="text-sm text-g-300 dark:text-s-500">
              {dayjs(question.createdAt).fromNow()}
            </Text>
          </View>
          <View className="px-2 py-2 relative">
            <SIcon path="iChevronRight" size={20} />
          </View>
        </View>
        {!question.answer && question.userProductId === userFromStore?.id ? (
          <View
            className="rounded-lg bg-green-500 absolute top-0 right-0 border-white dark:border-s-800"
            style={{ borderWidth: 2 }}
          >
            <Text className="text-sm px-1.5 py-0.5 text-white dark:text-black leading-4">
              новый вопрос
            </Text>
          </View>
        ) : null}
        {question.answer && question.userId === userFromStore?.id ? (
          <View
            className="rounded-lg bg-green-500 absolute top-0 right-0 border-white dark:border-s-800"
            style={{ borderWidth: 2 }}
          >
            <Text className="text-sm px-1.5 py-0.5 text-white dark:text-black leading-4">
              новый ответ
            </Text>
          </View>
        ) : null}
      </View>
    </UIButton>
  ) : (
    <Text>Not found product</Text>
  );
};

export default QuestionButton;
