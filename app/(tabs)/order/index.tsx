import { Text, View } from "react-native";
import {
  router,
  useFocusEffect,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  activeTaskWorker,
  linkParams,
  setLinkParams,
  user,
  workHistory,
} from "@/store/storeSlice";
import UIButton from "@/components/ui/UIButton";
import TaskWorkerTabs from "@/components/task/TaskWorkerTabs";
import { useCallback, useEffect, useState } from "react";
import TaskWorkerList from "@/components/task/TaskWorkerList";
import OrderAdminTabs from "@/components/order/admin/OrderAdminTabs";
import OrderAdminList from "@/components/order/admin/OrderAdminList";

export interface IAdminOrderParams {
  status?: number;
  montajComplete?: number;
  malyarComplete?: number;
  stolyarComplete?: number;
  shlifComplete?: number;
  goComplete?: number;
}

export interface IAdminOrder {
  key: string;
  params: IAdminOrderParams;
}

export default function FollowScreen() {
  const userFromStore = useAppSelector(user);
  const dispatch = useAppDispatch();
  const linkParamsFromStore = useAppSelector(linkParams);

  const activeTaskWorkerFromStore = useAppSelector(activeTaskWorker);
  const workHistoryFromStore = useAppSelector(workHistory);

  const { t } = useTranslation();

  const [objectId, setObjectId] = useState("");

  const [tab, setTab] = useState<IAdminOrder>({
    key: "inWork",
    params: {
      status: 1,
    },
  });

  useFocusEffect(
    useCallback(() => {
      // console.log(
      //   "hello: linkParamsFromStore : ",
      //   linkParamsFromStore,
      //   objectId
      // );

      if (linkParamsFromStore) {
        setObjectId(linkParamsFromStore?.objectId);
        // console.log("set objectId from params");
      } else {
        if (workHistoryFromStore?.objectId) {
          setObjectId(workHistoryFromStore.objectId);
          console.log("set objectId from store");
        }
        // }, []);

        // useEffect(() => {
        // console.log("linkParamsFromStore: ", linkParamsFromStore);
      }
      return () => {
        if (linkParamsFromStore) {
          dispatch(setLinkParams(null));
        }
        setObjectId("");
      };
    }, [linkParamsFromStore])
  );

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <SafeAreaView className="flex-1">
        {/* <Text>{JSON.stringify(userFromStore?.postObject?.name)}</Text> */}
        {/* {userFromStore?.postObject?.name === "Монтажник" ? (
          <TaskMontajWorkerList />
        ) : ( */}
        {/* <Text>
          {JSON.stringify(linkParamsFromStore)}/{objectId}
        </Text> */}
        {userFromStore &&
        ["admin", "boss", "designer", "superadmin"].includes(
          userFromStore?.roleObject.code
        ) ? (
          <View className="flex-1">
            <View>
              {/* <Text>{JSON.stringify(tab)}</Text> */}
              <OrderAdminTabs tab={tab} setTab={setTab} />
            </View>
            <View className="flex-1">
              <OrderAdminList key={tab.key} params={tab.params} />
              {/* )} */}
            </View>
          </View>
        ) : (
          <View className="flex-1">
            <View>
              <TaskWorkerTabs setObjectId={setObjectId} objectId={objectId} />
            </View>
            <View className="flex-1">
              <TaskWorkerList key={objectId} objectId={objectId} />
              {/* )} */}
            </View>
          </View>
        )}
        {/* {userFromStore &&
          !["admin", "boss","designer", "superadmin"].includes(userFromStore?.roleObject.code) && (
            <UIButton
              type="link"
              text={t("button.completedTask")}
              icon="iChevronRight"
              startText
              onPress={() => {
                router.push("/(tabs)/order/completed");
              }}
            />
          )} */}
      </SafeAreaView>
    </View>
  );
}
