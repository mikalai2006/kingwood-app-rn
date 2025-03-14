import { useEffect, useState } from "react";
import { View, Image, Alert } from "react-native";

import Card from "@/components/Card";
import RText from "@/components/r/RText";
import RTitle from "@/components/r/RTitle";
import UIButton from "@/components/ui/UIButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { useNavigation } from "expo-router";
import { setTokens, tokens } from "@/store/storeSlice";
import { ITokenResponse } from "@/types";
import UIInput from "@/components/ui/UIInput";
import useFetch from "@/hooks/useFetch";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import SIcon from "@/components/ui/SIcon";

export default function Modal() {
  const { colorScheme } = useColorScheme();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const tokensFromStore = useAppSelector(tokens);

  const [result, setResult] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // const onLogin = async () => {
  //   const schemas = Linking.collectManifestSchemes();
  //   console.log("schemas: ", schemas);

  //   let result = await WebBrowser.openBrowserAsync(`${hostAPI}${path}`);
  //   setResult(result.type);
  // };

  const { onFetch } = useFetch();

  const onLogin = async () => {
    isWriteConsole && console.log(hostAPI + "/auth/sign-in");

    return await onFetch(hostAPI + "/auth/sign-in", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        password,
      }),
    })
      .then((r) => r.json())
      .then((response) => {
        isWriteConsole && console.log("onLogin: response<=====", response);
        if (response?.code) {
          throw new Error(response?.message);
        }

        if (!response?.access_token) {
          dispatch(setTokens(null));
          // navigation.navigate(ScreenKeys.AuthScreen);
          return null;
        } else {
          dispatch(
            setTokens({
              ...response,
              // access_token: response.access_token,
              // refresh_token: response.refresh_token,
              // expires_in: response.expires_in,
              // expires_in_r: response.expires_in_r,
            })
          );

          return response;
        }
      })
      .catch((e) => {
        Alert.alert(t("error.title"), t(e?.message));
        throw e;
      });
  };

  // const goAuth = async (path: string) => {
  //   const schemas = Linking.collectManifestSchemes();
  //   console.log("schemas: ", schemas);

  //   let result = await WebBrowser.openBrowserAsync(`${hostAPI}${path}`);
  //   setResult(result.type);
  // };

  // useEffect(() => {
  //   const subscription = Linking.addEventListener("url", ({ url }) => {
  //     const urlSearchParams = url.split("?");
  //     const urlParamsArray =
  //       urlSearchParams.length > 0 ? urlSearchParams[1]?.split("&") : [];
  //     const tokensData: ITokenResponse = urlParamsArray.length
  //       ? Object.fromEntries(urlParamsArray.map((x) => x.split("=")))
  //       : [];
  //     // console.log("URL: ", url);
  //     console.log("tokensData: ", tokensData);
  //     if (tokensData) {
  //       dispatch(
  //         setTokens({
  //           access_token: tokensData.token,
  //           refresh_token: tokensData.rt,
  //           expires_in: parseInt(tokensData.exp.toString(), 10),
  //           expires_in_r: parseInt(tokensData.expr.toString(), 10),
  //         })
  //       );
  //     }
  //     WebBrowser.dismissBrowser();
  //   });
  //   return () => subscription.remove();
  // }, []);

  // const callbackBeforeRemoveRoute = useCallback(
  //   (e) => {
  //     if (tokensFromStore) {
  //       console.log(
  //         "callbackBeforeRemoveRoute ",
  //         tokensFromStore,
  //         !tokensFromStore
  //       );

  //       e.preventDefault();
  //       console.log("onback");
  //       // Do your stuff here
  //       //navigation.dispatch(e.data.action);
  //     }
  //   },
  //   [tokensFromStore]
  // );

  // useEffect(() => {
  //   navigation.addListener("beforeRemove", callbackBeforeRemoveRoute);

  //   return () => {
  //     navigation.removeListener("beforeRemove", callbackBeforeRemoveRoute);
  //   };
  // }, [tokensFromStore]);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="flex-1">
      <View className="absolute top-0 bottom-0 right-0 left-0 bg-s-100 dark:bg-s-900" />
      <View className="p-4 absolute bottom-12 left-0 right-0 flex items-center">
        {/* <Card>
          <RTitle text="Рефреш" />
          <Text className="text-s-500">{JSON.stringify(tokensFromStore)}</Text>
        </Card> */}
        <Image
          source={
            colorScheme === "dark"
              ? require("@/assets/images/logo-white.png")
              : require("@/assets/images/logo-black.png")
          }
          className="mb-6"
        />
        <Card>
          {/* <RTitle text={t("signin")} /> */}
          {/* <RText>
            Авторизируйтесь, чтобы открыть доступ ко всем функциям приложения
          </RText> */}
          <View className="mt-4 flex flex-col flex-wrap gap-4">
            <UIInput
              className="min-w-full bg-s-200 p-2 rounded-lg"
              keyboardType="name-phone-pad"
              value={login}
              title={t("login")}
              onChangeText={setLogin}
            />
            <View>
              <UIInput
                className="min-w-full bg-s-200 p-2 rounded-lg"
                secureTextEntry={!showPassword}
                value={password}
                title={t("password")}
                onChangeText={setPassword}
              />
              <View className="absolute right-2 top-6">
                <UIButton type="link" onPress={toggleShowPassword}>
                  <SIcon
                    path={showPassword ? "iEye" : "iEyeSplash"}
                    size={25}
                  />
                </UIButton>
              </View>
            </View>
            <UIButton
              type="primary"
              disabled={!login || !password}
              text={t("button.signin")}
              onPress={onLogin}
            />
            {/* <UIButton type="secondary" onPress={() => goAuth("/oauth/google")}>
              <View className="flex flex-row items-center gap-4 p-4">
                <SIcon path="iGoogle" type="secondary" size={30} />
                <RText className="text-s-900 dark:text-s-200 text-center font-bold text-xl">
                  Google
                </RText>
              </View>
            </UIButton>
            <UIButton type="secondary" onPress={() => goAuth("/oauth/google")}>
              <View className="flex flex-row items-center gap-4 p-4">
                <SIcon path="iYandex" type="secondary" size={30} />
                <RText className="text-s-900 dark:text-s-200 text-center font-bold text-xl">
                  Яндекс
                </RText>
              </View>
            </UIButton>
            <UIButton type="secondary" onPress={() => goAuth("/oauth/google")}>
              <View className="flex flex-row items-center gap-4 p-4">
                <SIcon path="iVk" type="secondary" size={30} />
                <RText className="text-s-900 dark:text-s-200 text-center font-bold text-xl">
                  Вконтакте
                </RText>
              </View>
            </UIButton> */}
          </View>
        </Card>
      </View>
    </View>
  );
}
