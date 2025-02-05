import { View } from "react-native";
import React, { useMemo } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import UIButton from "@/components/ui/UIButton";
import { useTranslation } from "react-i18next";
import { IAdminOrder } from "@/app/(tabs)/order";

export interface OrderAdminTabsProps {
  setTab: (key: IAdminOrder) => void;
  tab: IAdminOrder;
}

const OrderAdminTabs = (props: OrderAdminTabsProps) => {
  const userFromStore = useAppSelector(user);

  const { t } = useTranslation();

  const tabs = useMemo(() => {
    return [
      {
        key: "inWork",
        params: {
          status: 1,
        },
      },
      {
        key: "notWork",
        params: {
          status: 0,
        },
      },
      // {
      //   key: "montajComplete",
      //   params: {
      //     montajComplete: 1,
      //   },
      // },
      {
        key: "stolyarComplete",
        params: {
          status: 1,
          stolyarComplete: 1,
          // shlifComplete: 0,
          // malyarComplete: 0,
          // goComplete: 0,
          // montajComplete: 0,
        },
      },
      {
        key: "shlifComplete",
        params: {
          status: 1,
          // stolyarComplete: 1,
          shlifComplete: 1,
          // malyarComplete: 0,
          // goComplete: 0,
          // montajComplete: 0,
        },
      },
      {
        key: "malyarComplete",
        params: {
          status: 1,
          // stolyarComplete: 1,
          // shlifComplete: 1,
          malyarComplete: 1,
          // goComplete: 0,
          // montajComplete: 0,
        },
      },
      {
        key: "goComplete",
        params: {
          status: 1,
          // stolyarComplete: 1,
          // shlifComplete: 1,
          // malyarComplete: 1,
          goComplete: 1,
          // montajComplete: 0,
        },
      },
      {
        key: "completed",
        params: {
          status: 100,
        },
      },
      {
        key: "all",
        params: {},
      },
    ];
  }, []);

  return (
    <ScrollView horizontal className="flex p-4">
      <View className="flex-row gap-2 h-12">
        {tabs.map((item) => (
          <View key={item.key} className="flex-auto flex items-center">
            <UIButton
              type="link"
              disabled={item.key == props.tab.key}
              // {
              //   item?._id.toString() == props.objectId
              //     ? "primary"
              //     : "secondary"
              // }
              //className="bg-white dark:bg-s-900 p-4 m-0 rounded-lg"
              text={t(`orderTabs.${item.key}`)}
              className={
                item.key == props.tab.key
                  ? "bg-white dark:bg-s-600 p-3 m-0 rounded-lg"
                  : "bg-s-100 dark:bg-s-900 p-3 m-0 rounded-lg"
              }
              textClass={
                item.key == props.tab.key
                  ? "px-2 text-xl leading-6 text-s-950 dark:text-white leading-5"
                  : "px-2 text-xl leading-6 text-s-500 dark:text-s-400 leading-5"
              }
              onPress={() => {
                props.setTab(item);
              }}
            />
            {/* <View
                  className={
                    item?._id.toString() == props.objectId
                      ? "bg-white dark:bg-s-500 p-4 m-0 rounded-lg"
                      : "bg-white dark:bg-s-900 p-4 m-0 rounded-lg"
                  }
                >
                  <Text>{item?.name}</Text>
                </View>
              </UIButton> */}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default OrderAdminTabs;
