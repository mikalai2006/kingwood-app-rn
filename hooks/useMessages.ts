import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IFilterSort, IMessage, IResponseData } from "@/types";
import { useFocusEffect } from "expo-router";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";

export interface IuseMessagesProps {
  userId?: string | undefined;
  orderId?: string[] | undefined;
  $sort?: IFilterSort;
  $skip?: number;
}

const useMessages = (props: IuseMessagesProps) => {
  const { t } = useTranslation();

  // const { userId, orderId } = props;

  // let query = "";
  // if (userId) {
  //   query += `userId == '${userId}' `;
  // }
  // if (productId) {
  //   // const idsQuery = productId.map((x) => `'${x}'`).join(", ");
  //   // query += `productId IN {${idsQuery}}`;

  //   query += (query !== "" ? "  && " : "") + ` productId == '${productId}' `;
  // }
  // const messages = useQuery(MessageSchema, (items) => items.filtered(query));

  const realm = useRealm();

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const onQuery = React.useCallback(() => {
    let ignore = false;
    const onFindItems = async () => {
      try {
        isWriteConsole && console.log("useMessages props: ", props);
        // console.log({
        //   userId: userId || undefined,
        //   roomId: roomId || undefined,
        //   productId: productId?.length ? productId : undefined,
        //   sort: sort
        //     ? [
        //         {
        //           key: sort.key,
        //           value: sort.value,
        //         },
        //       ]
        //     : [],
        // });
        setLoading(true);
        await onFetchWithAuth(
          `${hostAPI}/message/find?` +
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
            body: JSON.stringify(props),
          }
        )
          .then((r) => r.json())
          .then((response: IResponseData<IMessage>) => {
            if (!ignore) {
              isWriteConsole &&
                console.log("useMessages response: ", response?.data?.length);

              if (response?.total) {
                setTotal(response.total);
              }

              const responseData = response;
              if (!responseData) {
                // dispatch(setActiveNode(null));
                // setProducts([]);
                setTimeout(() => {
                  setLoading(false);
                }, 300);
                return;
              }

              const responseItems = responseData.data;

              const listDataForRealm = responseItems.map((x) => {
                return {
                  ...x,
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
                        "MessageSchema",
                        {
                          ...listDataForRealm[i],
                        },
                        UpdateMode.Modified
                      );
                    }
                  } catch (e) {
                    isWriteConsole && console.log("useMessages error: ", e);
                  }
                });
              }
              // setProducts(responseProductsData);

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

    if (!ignore) {
      // setTimeout(onGetNodeInfo, 100);
      onFindItems();
    }

    return () => {
      ignore = true;
    };
  }, [props?.$skip]); //productId, userId, sort

  useFocusEffect(onQuery);

  return {
    isLoading,
    // messages: messages || [],
    error,
    total,
    onQuery,
  };
};

export default useMessages;
