import "react-native-get-random-values";

import React, { useMemo, useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IFilterSort, IQuestion } from "@/types";
import { useQuery, useRealm } from "@realm/react";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { BSON, UpdateMode } from "realm";

export interface IuseQuestionsProps {
  productId?: string | undefined;
  userProductId?: (string | undefined)[];
  userId?: (string | undefined)[];
  sort?: IFilterSort;
}

const useQuestions = (props: IuseQuestionsProps) => {
  const { productId, userId, userProductId } = props;

  const realm = useRealm();
  const questionsFromRealm = useQuery(QuestionSchema);
  const questionsByProductId = useQuery(QuestionSchema, (items) =>
    items.filtered("productId == $0", productId)
  );

  const { t } = useTranslation();

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [questions, setQuestions] = useState<IQuestion[]>([]);

  React.useEffect(() => {
    let ignore = false;
    const onFindQuestions = async () => {
      try {
        // console.log("useQuestions: ", {
        //   productId: productId || undefined,
        //   userId: userId || undefined,
        //   userProductId,
        //   limit: 100,
        //   skip: 0,
        // });

        // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
        await onFetchWithAuth(
          `${hostAPI}/question/find?` +
            new URLSearchParams({
              lang: activeLanguageFromStore?.code || "en",
            }),
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            // node(id: "${featureFromStore?.id}") {
            body: JSON.stringify({
              productId: productId || undefined,
              userId: userId || undefined,
              userProductId,
              limit: 100,
              skip: 0,
            }),
          }
        )
          .then((r) => r.json())
          .then((response) => {
            if (!ignore) {
              // console.log("useQuestion: ", response, "========>", productId);

              const resp: IQuestion[] = response.data; //.questions.data;
              if (!resp) {
                // setQuestions([]);
                setTimeout(() => {
                  setLoading(false);
                }, 300);
                return;
              }

              const listDataForRealm = resp.map((x: IQuestion) => {
                return {
                  ...x,
                  _id: new BSON.ObjectId(x.id),
                };
              });

              if (listDataForRealm?.length) {
                realm.write(() => {
                  try {
                    for (
                      let i = 0, total = listDataForRealm.length;
                      i < total;
                      i++
                    ) {
                      realm.create(
                        "QuestionSchema",
                        listDataForRealm[i],
                        UpdateMode.Modified
                      );
                    }
                  } catch (e) {
                    isWriteConsole && console.log("useQuestions error: ", e);
                  }
                });
              }
              // console.log(
              //   "questionsFromRealm: ",
              //   questionsFromRealm.length,
              //   questionsFromRealm
              // );

              // setQuestions(resp);
              setTimeout(() => {
                setLoading(false);
              }, 100);
              // console.log('activeMarker=', response);
              // dispatch(setActiveNode(responseNode));
            }
          })
          .catch((e) => {
            setTimeout(() => {
              setLoading(false);
            }, 300);
            throw e;
          });
      } catch (e: any) {
        // ToastAndroid.showWithGravity(
        //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
        //     ToastAndroid.LONG,
        //     ToastAndroid.TOP,
        // );
        setError(e.message);
        // console.log('UseNode error: ', e?.message);
      }
    };

    if ((productId || userId || userProductId) && !ignore) {
      // setTimeout(onGetNodeInfo, 100);
      onFindQuestions();
    }

    return () => {
      ignore = true;
    };
  }, [productId]);

  return {
    isLoading,
    questions: questionsByProductId,
    error,
    // setQuestions,
  };
};

export default useQuestions;
