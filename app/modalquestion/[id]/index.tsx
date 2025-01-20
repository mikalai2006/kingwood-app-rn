import { useState } from "react";
import { View } from "react-native";

import Card from "@/components/Card";
import UIButton from "@/components/ui/UIButton";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { useObject, useQuery, useRealm } from "@realm/react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import UIInput from "@/components/ui/UIInput";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { ScrollView } from "react-native-gesture-handler";
import { BSON, UpdateMode } from "realm";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { IQuestion } from "@/types";
import { OrderSchema } from "@/schema";
import OrderShortInfo from "@/components/order/OrderShortInfo";

export default function ModalQuestionIndex() {
  const params = useLocalSearchParams<{ id: string }>();

  const userFromStore = useAppSelector(user);

  const realm = useRealm();

  const product = useObject(OrderSchema, new BSON.ObjectId(params.id));

  const questions = useQuery(QuestionSchema, (items) =>
    items.filtered("productId == $0", params.id)
  );

  const [newQuestion, setNewQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const { onFetchWithAuth } = useFetchWithAuth();

  const onCreateQuestion = async () => {
    setLoading(true);

    return await onFetchWithAuth(`${hostAPI}/question`, {
      method: "POST",
      body: JSON.stringify({
        productId: params.id,
        question: newQuestion,
      }),
    })
      .then((res) => res.json())
      .then((res: IQuestion) => {
        realm.write(() => {
          try {
            realm.create(
              "QuestionSchema",
              {
                ...res,
                _id: new BSON.ObjectId(res.id),
              },
              UpdateMode.Modified
            );
          } catch (e) {
            isWriteConsole && console.log("onCreateQuestion error: ", e);
          }
        });
        setNewQuestion("");
      })
      .catch((e) => {
        isWriteConsole && console.log("ModalQuestion Error", e);
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
            {product && <OrderShortInfo id={product._id.toString()} />}
          </View>
        </View>
        <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
          {product && (
            <View className="px-4 pt-2">
              {/* <ProductQuestionList id={product._id} /> */}
              {product.userId !== userFromStore?.id && (
                <Card className="mt-4">
                  <View className="flex gap-4">
                    {/* <Text>{JSON.stringify(path)}</Text> */}
                    <UIInput
                      title="Текст вопроса"
                      placeholder="Введите текст вопроса"
                      value={newQuestion}
                      numberOfLines={5}
                      multiline
                      maxLength={500}
                      textAlignVertical="top"
                      onChangeText={setNewQuestion}
                    />
                    <UIButton
                      type="primary"
                      loading={loading}
                      disabled={loading || !newQuestion}
                      text="Отправить вопрос"
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
