import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IFilterSort, IMessageRoom, IResponseData } from "@/types";
import { useFocusEffect } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { UserSchema } from "@/schema/UserSchema";
import { MessageRoomSchema } from "@/schema/MessageRoomSchema";

export interface IuseMessagesRoomsProps {
  userId?: string | undefined;
  productId?: string;
  sort?: IFilterSort;
}

const useMessagesRooms = (props: IuseMessagesRoomsProps) => {
  const { t } = useTranslation();

  const { userId, sort, productId } = props;

  let query = "";
  if (userId) {
    query += `userId == '${userId}' `;
  }
  if (productId) {
    // const idsQuery = productId.map((x) => `'${x}'`).join(", ");
    // query += `productId IN {${idsQuery}}`;

    query += (query !== "" ? "  && " : "") + ` productId == '${productId}' `;
  }
  const messagesRooms = useQuery(MessageRoomSchema, (items) =>
    items.filtered(query)
  );

  const realm = useRealm();
  const usersFromRealm = useQuery(UserSchema);

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindMessagesRooms = async () => {
        try {
          // console.log({
          //   userId: userId || undefined,
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

          await onFetchWithAuth(
            `${hostAPI}/message_room/find?` +
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
                userId: userId || undefined,
                productId:
                  productId && productId?.length ? productId : undefined,
                sort: sort
                  ? [
                      {
                        key: sort.key,
                        value: sort.value,
                      },
                    ]
                  : [],
              }),
            }
          )
            .then((r) => r.json())
            .then((response: IResponseData<IMessageRoom>) => {
              if (!ignore) {
                // console.log("useMessagesRooms response: ", response);

                const responseData = response.data;
                if (!responseData) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                const listDataForRealm = responseData.map((x) => {
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
                          "MessageRoomSchema",
                          {
                            ...listDataForRealm[i],
                          },
                          UpdateMode.Modified
                        );
                      }

                      for (
                        let i = 0, total = listDataForRealm.length;
                        i < total;
                        i++
                      ) {
                        realm.create(
                          "UserSchema",
                          {
                            ...listDataForRealm[i].user,
                            _id: new BSON.ObjectId(listDataForRealm[i].user.id),
                            images: listDataForRealm[i].user?.images || [],
                            typeWork: listDataForRealm[i].user?.typeWork || [],
                          },
                          UpdateMode.Modified
                        );
                      }
                    } catch (e) {
                      isWriteConsole &&
                        console.log("useMessagesRooms error: ", e);
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
        onFindMessagesRooms();
      }

      return () => {
        ignore = true;
      };
    }, []) //productId, userId, sort
  );

  return {
    isLoading,
    messagesRooms,
    error,
  };
};

export default useMessagesRooms;
