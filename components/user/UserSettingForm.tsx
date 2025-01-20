import { Text, View } from "react-native";
import React, { useMemo, useState } from "react";

import { setTokens, tokens, user } from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import { hostAPI, isWriteConsole } from "@/utils/global";
import useAuth from "@/hooks/useAuth";
import Card from "../Card";
import UIInput from "../ui/UIInput";

const UserSettingForm = () => {
  const { t } = useTranslation();

  const { onGetIam, onSyncToken: onCheckAuth } = useAuth();

  const dispatch = useAppDispatch();
  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);

  // const [login, setLogin] = useState(userFromStore?.login);
  const [myName, setMyName] = useState(userFromStore?.name);
  const [myBirthday, setMyBirthday] = useState(userFromStore?.birthday);
  const [myPhone, setMyPhone] = useState(userFromStore?.phone);
  const disabledSave = useMemo(
    () =>
      (userFromStore?.name === myName || myName === "") &&
      userFromStore?.birthday === myBirthday &&
      userFromStore?.phone === myPhone,
    [
      myName,
      userFromStore?.name,
      myBirthday,
      userFromStore?.birthday,
      myPhone,
      userFromStore?.phone,
    ]
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
        name: myName,
        birthday: myBirthday,
        phone: myPhone,
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

          setMyName(result?.name);
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

  // const customMask = (text: string) => {
  //   let newText = "";
  //   let mask = "(999) 999 9999";

  //   for (let i = 0, j = 0; i < text.length; i++) {
  //     if (mask[j] === "9") {
  //       if (/\d/.test(text[i])) {
  //         newText += text[i];
  //         j++;
  //       }
  //     } else {
  //       newText += mask[j];
  //       j++;
  //     }
  //   }

  //   setMyBirthday(newText);
  // };
  function maskBirthday(text: string) {
    const value = text.replace(/\D+/g, "");
    const numberLength = 8;

    let result = "";
    for (let i = 0; i < value.length && i < numberLength; i++) {
      console.log(i, value[i]);

      switch (i) {
        case 2:
          result += ".";
          break;
        case 4:
          result += ".";
          break;
        default:
          break;
      }
      result += value[i];
    }
    return result;
  }
  const setMyMaskBirthday = (text: string) => {
    const value = maskBirthday(text);
    setMyBirthday(value);
  };

  const prefixNumber = (str: string) => {
    if (str === "7") {
      return "7 (";
    }
    if (str === "8") {
      return "8 (";
    }
    if (str === "9") {
      return "7 (9";
    }
    return "7 (";
  };

  function maskPhone(text: string) {
    const value = text.replace(/\D+/g, "");
    const numberLength = 11;

    let result;
    if (text.includes("+8") || text[0] === "8") {
      result = "";
    } else {
      result = "+";
    }

    for (let i = 0; i < value.length && i < numberLength; i++) {
      switch (i) {
        case 0:
          result += prefixNumber(value[i]);
          continue;
        case 4:
          result += ") ";
          break;
        case 7:
          result += "-";
          break;
        case 9:
          result += "-";
          break;
        default:
          break;
      }
      result += value[i];
    }
    return result;
  }

  const setMyMaskPhone = (text: string) => {
    const value = maskPhone(text);
    setMyPhone(value);
  };
  return (
    <>
      <Card>
        {/* <Text>
          {JSON.stringify({ b1: userFromStore?.birthday, myBirthday })}
        </Text> */}
        <UIInput
          value={myName}
          onChangeText={setMyName}
          keyboardType="default"
          title={t("fio")}
          editable={false}
        />

        <View className="pt-8">
          <UIInput
            value={myBirthday}
            onChangeText={setMyMaskBirthday}
            keyboardType="numeric"
            placeholder="15.12.1980"
            title={t("birthday")}
          />
        </View>

        <View className="pt-8">
          <UIInput
            value={myPhone}
            onChangeText={setMyMaskPhone}
            keyboardType="numeric"
            placeholder="+7(916)586-86-10"
            title={t("phone")}
          />
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

export default UserSettingForm;
