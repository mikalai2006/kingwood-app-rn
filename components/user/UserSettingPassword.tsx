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

const UserSettingPassword = () => {
  const { t } = useTranslation();

  const { onGetIam, onSyncToken: onCheckAuth } = useAuth();

  const dispatch = useAppDispatch();
  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);

  // const [login, setLogin] = useState(userFromStore?.login);
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const disabledSave = useMemo(
    () =>
      password == "" ||
      passwordTwo == "" ||
      password != passwordTwo ||
      password.length < 6,
    [password, passwordTwo]
  );
  const [loading, setLoading] = useState(false);
  const createFormData = (body: any = {}) => {
    const data = new FormData();

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };
  const onPatchAuth = async () => {
    setLoading(true);

    await onCheckAuth();

    if (!tokensFromStore) {
      return;
    }

    return await fetch(
      hostAPI + `/auth/reset-password/${userFromStore?.userId}`,
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin-Type": "*",
          Authorization: `Bearer ${tokensFromStore.access_token}`,
        },
        body: JSON.stringify({
          password,
        }),
      }
    )
      .then((r) => r.json())
      .then(async (response) => {
        if (response.message && response?.code === 401) {
          dispatch(setTokens({ access_token: "" }));
        }

        if (response) {
          const result = await onGetIam();
          setPassword("");
          setPasswordTwo("");
          // console.log("result: ", result, userFromStore);
          Alert.alert(t("noty"), t("okNewPassword"));
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
        <UIInput
          value={password}
          onChangeText={setPassword}
          keyboardType="default"
          title={t("newPassword")}
          editable={true}
        />

        <View className="my-2">
          <Text className="text-lg leading-5 text-s-800 dark:text-s-100">
            {t("minLenghtPassword")}
          </Text>
        </View>

        <View className="pt-8">
          <UIInput
            value={passwordTwo}
            onChangeText={setPasswordTwo}
            keyboardType="default"
            placeholder=""
            title={t("newPasswordSecond")}
          />
        </View>

        <View className="mt-4">
          <UIButton
            type="primary"
            text="Сохранить изменения"
            loading={loading}
            disabled={disabledSave}
            onPress={onPatchAuth}
          />
        </View>
      </Card>
    </>
  );
};

export default UserSettingPassword;
