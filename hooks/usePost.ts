import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { IPost } from "@/types";
import { useError } from "./useError";
import { CustomError } from "./useErrors";

export interface IUsePostProps {
  userId?: string | undefined;
  query?: string;
  id?: string[];
}

const usePost = (props: IUsePostProps) => {
  const { t } = useTranslation();

  const realm = useRealm();

  const { query, id } = props;

  const { onFetchWithAuth } = useFetchWithAuth();

  const { onSendError } = useError();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [products, setProducts] = useState<IProduct[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindItems = async () => {
        try {
          // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
          await onFetchWithAuth(
            `${hostAPI}/post?` +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
              }),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              // node(id: "${featureFromStore?.id}") {
              // body: JSON.stringify({
              //   userId: userId || undefined,
              //   query: query || undefined,
              //   id,
              // }),
            }
          )
            .then((r) => r.json())
            .then((response) => {
              if (!ignore) {
                isWriteConsole && console.log("UsePost response: ", response);

                const responseData: IPost[] = response.data;
                if (!responseData) {
                  // dispatch(setActiveNode(null));
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                const listDataForRealm = responseData.map((x: IPost) => {
                  return {
                    ...x,
                    // _id: existLocalNode?._id || new BSON.ObjectId(),
                    _id: new BSON.ObjectId(x.id),
                  };
                });

                // console.log("listDataForRealm: ", listDataForRealm);
                if (listDataForRealm?.length) {
                  realm.write(() => {
                    try {
                      for (
                        let i = 0, total = listDataForRealm.length;
                        i < total;
                        i++
                      ) {
                        realm.create(
                          "PostSchema",
                          listDataForRealm[i],
                          UpdateMode.Modified
                        );
                      }
                    } catch (e) {
                      isWriteConsole && console.log("UsePost error: ", e);
                    }
                  });
                }
                // console.log("productsFromRealm: ", localOffersMap);
                // setProducts(responseProductsData);

                // console.log('activeMarker=', response);
                // dispatch(setActiveNode(responseNode));
              }
            })
            .catch((e) => {
              // setTimeout(() => {
              //   setLoading(false);
              // }, 300);
              throw e;
            })
            .finally(() => {
              setTimeout(() => {
                setLoading(false);
              }, 300);
            });
        } catch (e: any) {
          // ToastAndroid.showWithGravity(
          //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
          //     ToastAndroid.LONG,
          //     ToastAndroid.TOP,
          // );
          setError(e.message);
          onSendError(new CustomError("usePost", e));
          // console.log('UseNode error: ', e?.message);
        }
      };

      if (!ignore) {
        // setTimeout(onGetNodeInfo, 100);
        onFindItems();
      }

      return () => {
        ignore = true;
      };
    }, [])
  );

  return {
    isLoading,
    error,
  };
};

export default usePost;
