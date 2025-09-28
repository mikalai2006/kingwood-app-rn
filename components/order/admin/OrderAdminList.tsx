import { ActivityIndicator, Text, View } from "react-native";
import React, { useMemo } from "react";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { OrderSchema } from "@/schema";
import { useTranslation } from "react-i18next";
import Card from "@/components/Card";
import { IAdminOrderParams } from "@/app/(tabs)/order";
import useOrders from "@/hooks/useOrders";
import { OrderAdminItem } from "./OrderAdminItem";

export interface OrderAdminListProps {
  params: IAdminOrderParams;
}

const OrderAdminList = (props: OrderAdminListProps) => {
  const userFromStore = useAppSelector(user);

  const { params } = props;

  const { t } = useTranslation();

  const orders = useQuery(OrderSchema);

  const ordersByParams = useMemo(() => {
    // console.log("all: ", orders.length, params);

    const _result = orders.filter((x) =>
      Object.keys(params).every((a) => x[a] == params[a])
    );
    // console.log("_result: ", _result.length);

    // if (params?.status) {
    //   _result = _result.filter((x) => x.status === params.status);
    // }

    // if (params?.goComplete) {
    //   _result = _result.filter((x) => x.goComplete === params.goComplete);
    // }

    // if (params?.malyarComplete) {
    //   _result = _result.filter(
    //     (x) => x.malyarComplete === params.malyarComplete
    //   );
    // }

    // if (params?.montajComplete) {
    //   _result = _result.filter(
    //     (x) => x.montajComplete === params.montajComplete
    //   );
    // }

    // if (params?.stolyarComplete) {
    //   _result = _result.filter(
    //     (x) => x.stolyarComplete === params.stolyarComplete
    //   );
    // }
    return _result;
  }, [params, orders]);

  // const taskWorkers = useQuery(TaskWorkerSchema, (items) =>
  //   items.filtered(
  //     "workerId == $0 AND objectId == $1 AND status != 'finish' AND status != 'autofinish'",
  //     userFromStore?.id,
  //     props.objectId
  //   )
  // ).filter((y) => {
  //   const _task = tasks.find((x) => x._id.toString() == y.taskId);

  //   return (
  //     // _task?.status != "finish" &&
  //     dayjs(new Date()).isBetween(dayjs(y.from), dayjs(y.to), "day", "[]") ||
  //     dayjs(new Date())
  //       .add(1, "day")
  //       .isBetween(dayjs(y.from), dayjs(y.to), "day", "[]")
  //   );
  // });

  const { isLoading } = useOrders({
    status: params.status,
    stolyarComplete: params.stolyarComplete,
    shlifComplete: params.shlifComplete,
    malyarComplete: params.malyarComplete,
    goComplete: params.goComplete,
    montajComplete: params.montajComplete,
  });

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex p-2">
          {/* {[1, 2, 3, 4, 5].map((item) => (
            <View key={item.toString()} className="flex-auto h-64 pb-4 px-2">
              <SSkeleton className="flex-1 bg-white dark:bg-s-900" />
            </View>
          ))} */}
          <ActivityIndicator size={30} />
        </View>
      ) : ordersByParams.length ? (
        <View>
          {/* <Text>{ordersByParams.length}</Text> */}
          <FlatList
            data={ordersByParams}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <OrderAdminItem orderId={item._id.toString()} />
            )}
          />
        </View>
      ) : (
        <View className="px-4">
          <Card>
            <Text className="text-lg text-s-800 dark:text-s-200 leading-6">
              {t("info.taskForOrderNotFound")}
            </Text>
          </Card>
        </View>
      )}
    </View>
  );
};

export default OrderAdminList;
