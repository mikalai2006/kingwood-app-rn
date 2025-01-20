import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI, isWriteConsole } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { IOrder } from "@/types";
import { useError } from "./useError";

export interface IUseOrderProps {
  id?: string[];
  name?: string;
  group?: string[];
  status?: number;
  stolyarComplete?: number;
  malyarComplete?: number;
  goComplete?: number;
  MontajComplete?: number;
}

const useOrders = (props: IUseOrderProps) => {
  const { t } = useTranslation();

  const realm = useRealm();

  const { id } = props;

  const { onFetchWithAuth } = useFetchWithAuth();

  const { onSendError } = useError();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [products, setProducts] = useState<IProduct[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;

      const onFindOrders = async () => {
        try {
          isWriteConsole && console.log("useOrders: ", props);
          const searchParams = new URLSearchParams({
            lang: activeLanguageFromStore?.code || "en",
          });

          await onFetchWithAuth(`${hostAPI}/order/find?` + searchParams, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...props,
            }),
          })
            .then((r) => r.json())
            .then((response) => {
              if (!ignore) {
                isWriteConsole &&
                  console.log("useProducts response: ", response);

                const responseOrdersData: IOrder[] = response.data;
                if (!responseOrdersData) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                const listDataForRealm = responseOrdersData.map((x: IOrder) => {
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
                          "OrderSchema",
                          listDataForRealm[i],
                          UpdateMode.Modified
                        );
                      }
                    } catch (e) {
                      isWriteConsole && console.log("useOrders error: ", e);
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
          onSendError(e);
          // console.log('UseNode error: ', e?.message);
        }
      };

      if (!ignore) {
        // setTimeout(onGetNodeInfo, 100);
        onFindOrders();
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

export default useOrders;
