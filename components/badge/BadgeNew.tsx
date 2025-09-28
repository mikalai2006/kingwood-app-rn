import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addNew, news, user } from "@/store/storeSlice";

export interface IBadgeNew {
  text?: string;
  keyString: string;
  customClass?: string;
}

const BadgeNew = (props: IBadgeNew) => {
  const userFromStore = useAppSelector(user);
  const dispatch = useAppDispatch();
  const newsFromStore = useAppSelector(news);

  useEffect(() => {
    if (newsFromStore.indexOf(props.keyString) == -1) {
      console.log("need remove: ", props.keyString);

      setTimeout(() => {
        dispatch(addNew(props.keyString));
      }, 3000);
    } else {
      console.log("Exist keyString: ", props.keyString, newsFromStore);
    }
  }, []);

  return (
    <View
      className={
        " bg-purple-600 dark:bg-purple-600 absolute border-1 border-s-100 dark:border-s-800 " +
          props.customClass || " rounded-xl "
      }
    >
      <Text
        numberOfLines={1}
        className="text-sm text-white leading-4 py-1 px-2"
      >
        {props.text || "new"}
      </Text>
    </View>
  );
};

export default BadgeNew;
