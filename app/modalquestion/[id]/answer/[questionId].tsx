import { useState } from "react";
import { Text, View } from "react-native";

import Card from "@/components/Card";
import UIButton from "@/components/ui/UIButton";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { useObject, useQuery } from "@realm/react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import UIInput from "@/components/ui/UIInput";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { ScrollView } from "react-native-gesture-handler";
import { BSON } from "realm";
import UserInfo from "@/components/user/UserInfo";
import SIcon from "@/components/ui/SIcon";
import { Colors } from "@/utils/Colors";
import UILabel from "@/components/ui/UILabel";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import dayjs from "@/utils/dayjs";
import { OrderSchema } from "@/schema";
import OrderShortInfo from "@/components/order/OrderShortInfo";

export default function ModalQuestionAnswer() {
  const params = useLocalSearchParams<{ id: string; questionId: string }>();

  const userFromStore = useAppSelector(user);

  const product = useObject(OrderSchema, new BSON.ObjectId(params.id));

  const question = useObject(
    QuestionSchema,
    new BSON.ObjectId(params.questionId)
  );

  const [newAnswer, setNewAnswer] = useState(question?.answer);

  const [loading, setLoading] = useState(false);

  const { onFetchWithAuth } = useFetchWithAuth();

  const onCreateQuestion = async () => {
    setLoading(true);

    return await onFetchWithAuth(`${hostAPI}/question/${params.questionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        //productId: params.id,
        answer: newAnswer,
      }),
    })
      .then((res) => res.json())
      .then((res: any) => {
        setNewAnswer("");
      })
      .catch((e) => {
        isWriteConsole && console.log("ModalQuestion/Answer Error", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            {product && (
              <UIButton
                type="link"
                className="m-0"
                onPress={() => {
                  router.navigate({
                    pathname: "/product/[id]",
                    params: {
                      id: product._id.toString(),
                    },
                  });
                }}
              >
                <OrderShortInfo id={product._id.toString()} />
              </UIButton>
            )}
          </View>
        </View>
        <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
          {product && (
            <View className="p-4">
              <Card className="">
                <UILabel
                  text={`Вопрос - ${dayjs(question?.createdAt).fromNow()}`}
                />
                <UserInfo userId={question?.userId} />
                <Text className="pt-4 text-lg text-s-800 dark:text-s-100">
                  {question?.question}
                </Text>
                {question?.answer && (
                  <View className="mt-4 p-4 bg-s-50 dark:bg-s-900 rounded-lg">
                    <UILabel
                      text={`Ответ владельца лота - ${dayjs(
                        question?.updatedAt
                      ).fromNow()}`}
                    />
                    <Text className="text-lg text-s-800 dark:text-s-100">
                      {question?.answer}
                    </Text>
                    {/* <UserInfo userId={question?.userProductId} /> */}
                  </View>
                )}
              </Card>
              {userFromStore?.id === product.userId && !question?.answer && (
                <Card className="mt-4">
                  <View className="flex gap-4">
                    {/* <Text>{JSON.stringify(path)}</Text> */}
                    <UIInput
                      title="Текст ответа"
                      placeholder="Введите текст ответа"
                      value={newAnswer}
                      numberOfLines={5}
                      multiline
                      maxLength={500}
                      textAlignVertical="top"
                      onChangeText={setNewAnswer}
                    />
                    <UIButton
                      type="primary"
                      loading={loading}
                      disabled={loading || !newAnswer}
                      text="Отправить ответ"
                      onPress={() => {
                        onCreateQuestion();
                      }}
                    />
                  </View>
                </Card>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
