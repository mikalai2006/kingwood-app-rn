import { Alert, Text, View } from "react-native";
import React, { useMemo, useState } from "react";

import { setTokens, tokens, user } from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import { hostAPI, isWriteConsole } from "@/utils/global";
import useAuth from "@/hooks/useAuth";
import Card from "../Card";
import UIInput from "../ui/UIInput";
import UICounter from "../ui/UICounter";

const UserWorkTime = () => {
  const { t } = useTranslation();

  const { onGetIam, onSyncToken: onCheckAuth } = useAuth();

  const dispatch = useAppDispatch();
  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);

  // const [login, setLogin] = useState(userFromStore?.login);
  const [workTime, setWorkTime] = useState(userFromStore?.maxTime.toString());
  console.log("userFromStore?.maxTime=", userFromStore?.maxTime);

  const [passwordTwo, setPasswordTwo] = useState("");
  const disabledSave = useMemo(
    () => workTime == userFromStore?.maxTime.toString(),
    [workTime, userFromStore?.maxTime]
  );
  const [loading, setLoading] = useState(false);
  const createFormData = (body: any = {}) => {
    const data = new FormData();

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };
  const onPatchUser = async () => {
    setLoading(true);

    await onCheckAuth();

    if (!tokensFromStore) {
      return;
    }

    return await fetch(hostAPI + `/user/${userFromStore?.id}`, {
      method: "PATCH",
      headers: {
        "Access-Control-Allow-Origin-Type": "*",
        Authorization: `Bearer ${tokensFromStore.access_token}`,
      },
      body: createFormData({
        maxTime: workTime,
      }),
    })
      .then((r) => r.json())
      .then(async (response) => {
        if (response.message && response?.code === 401) {
          dispatch(setTokens({ access_token: "" }));
        }

        if (response.id) {
          const result = await onGetIam();
          // console.log("result: ", result, userFromStore);

          return response;
        }
      })
      .catch((e) => {
        isWriteConsole && console.log("e=", e);

        throw e;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Card>
        <UICounter
          value={workTime}
          max={24}
          min={0}
          onChangeText={setWorkTime}
          keyboardType="numeric"
          onChangeValue={(value) => {
            setWorkTime(value.toString());
          }}
          editable={true}
        />

        <View className="my-2">
          <Text className="text-md leading-6 text-s-800 dark:text-s-100">
            {t("maxTimeDescription")}
          </Text>
        </View>

        <View className="mt-4">
          <UIButton
            type="primary"
            text="Сохранить изменения"
            loading={loading}
            disabled={disabledSave}
            onPress={onPatchUser}
          />
        </View>
      </Card>
    </>
  );
};

export default UserWorkTime;
