import React, { useEffect, useMemo } from "react";
import { NativeModules, Platform } from "react-native";
import { hostAPI, isWriteConsole } from "@/utils/global";

import {
  activeLanguage,
  setLanguages,
  langCode,
  languages,
  setFinancyFilter,
  financyFilter,
} from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useFetch from "@/hooks/useFetch";
import useLanguage from "@/hooks/useLanguage";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import dayjs from "@/utils/dayjs";

export const WidgetInitApp = () => {
  const { onFetch } = useFetch();

  // const {isInternetReachable} = useNetInfo();

  const dispatch = useAppDispatch();
  const realm = useRealm();
  const activeLanguageFromStore = useAppSelector(activeLanguage);
  const financyFilterFromStore = useAppSelector(financyFilter);

  const activeLangCode = useAppSelector(langCode);
  // console.log('activeLangCode=', activeLangCode);

  const { onChooseLanguage, onChangeLocale } = useLanguage();
  const languagesFromStore = useAppSelector(languages);
  const deviceLanguage = useMemo(() => {
    const appLang =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    const appLangCode = appLang.split("_")[0];
    return appLangCode;
  }, []);

  useEffect(() => {
    onChangeLocale(activeLangCode || deviceLanguage);
  }, []);

  const setFirstRunSettings = () => {
    if (!activeLangCode || languagesFromStore?.length === 0) {
      isWriteConsole &&
        console.log(
          "First run app: deviceLanguage=",
          deviceLanguage,
          activeLangCode
        );
      if (deviceLanguage) {
        onChooseLanguage(deviceLanguage);
        // dispatch(setAppState({alreadyUse: true}));
      }
    } else {
      onChangeLocale("ru");
    }

    // set default finance filter.
    if (!financyFilterFromStore?.year) {
      const [month, monthText, year] = dayjs(new Date())
        .locale("ru")
        .format("M,MMMM,YYYY")
        .split(",");
      dispatch(
        setFinancyFilter({
          month: +month,
          monthIndex: +month - 1,
          monthText: monthText,
          year: +year,
        })
      );
    }
  };

  useEffect(() => {
    const onFetching = async () => {
      try {
        const onFindLanguages = async () => {
          await onFetch(
            hostAPI +
              "/lang?" +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
              }),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              if (r.data?.length) {
                // console.log('r.data=', r.data);
                dispatch(setLanguages(r.data));
              }
            })
            .catch((e) => {
              throw new Error("onFindLanguages: " + e.message);
            })
            .finally(() => {
              setFirstRunSettings();
            });
        };
        await onFindLanguages();

        const onFindPost = async () => {
          await onFetch(
            hostAPI +
              "/post?" +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
                $limit: "100",
              }),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              if (r.data?.length) {
                realm.write(() => {
                  for (const _post of r.data) {
                    realm.create(
                      "PostSchema",
                      {
                        ..._post,
                        _id: new BSON.ObjectId(_post.id),
                      },
                      UpdateMode.Modified
                    );
                  }
                });
              }
            })
            .catch((e) => {
              throw new Error("onFindPost: " + e.message);
            });
        };
        await onFindPost();

        const onFindOperation = async () => {
          await onFetch(
            hostAPI +
              "/operation?" +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
                $limit: "100",
              }),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              if (r?.data?.length) {
                realm.write(() => {
                  for (const _operation of r.data) {
                    realm.create(
                      "OperationSchema",
                      {
                        ..._operation,
                        _id: new BSON.ObjectId(_operation.id),
                      },
                      UpdateMode.Modified
                    );
                  }
                });
              }
            })
            .catch((e) => {
              throw new Error("onFinOperation: " + e.message);
            });
        };
        await onFindOperation();

        const onFindTaskStatus = async () => {
          await onFetch(
            hostAPI +
              "/task_status?" +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
                $limit: "100",
              }),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              if (r?.data?.length) {
                realm.write(() => {
                  for (const _taskStatus of r.data) {
                    realm.create(
                      "TaskStatusSchema",
                      {
                        ..._taskStatus,
                        _id: new BSON.ObjectId(_taskStatus.id),
                        enabled: _taskStatus.enabled || 0,
                        // start: _taskStatus.enabled || 0,
                        // finish: _taskStatus.enabled || 0,
                        // process: _taskStatus.enabled || 0,
                      },
                      UpdateMode.Modified
                    );
                  }
                });
              }
            })
            .catch((e) => {
              throw new Error("onFinTaskStatus: " + e.message);
            });
        };
        await onFindTaskStatus();
      } catch (e: any) {
        isWriteConsole && console.log("WidgetInitApp error: ", e.message);
      } finally {
      }
    };

    onFetching();
  }, []);

  return null;
  // !isInternetReachable ? (
  //     <View tw="absolute top-12 px-6 w-full">
  //         <Text tw="text-s-200 text-lg text-center">For first start app need internet!</Text>
  //     </View>
  // ) :
};
