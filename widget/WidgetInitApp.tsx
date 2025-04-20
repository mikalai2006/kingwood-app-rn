import React, { useEffect, useMemo, useRef } from "react";
import { Alert, AppState, NativeModules, Platform } from "react-native";
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
import { useTranslation } from "react-i18next";

export const WidgetInitApp = () => {
  const { onFetch } = useFetch();

  // const {isInternetReachable} = useNetInfo();

  const { t } = useTranslation();

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

  const appState = useRef(AppState.currentState);

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
      isWriteConsole && console.log("onInitApp");

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

        // добавление постоянных задач для преодоления
        // того факта, что заказ может отсутствовать, а работник на рабочем месте
        const onInitFakeData = () => {
          realm.write(() => {
            realm.create(
              "ObjectsSchema",
              {
                _id: new BSON.ObjectId("000000000000000000000000"),
                userId: "000000000000000000000000",
                name: t("fake.nameObject"),
                createdAt: dayjs().format(),
                updatedAt: dayjs().format(),
              },
              UpdateMode.Modified
            );
            realm.create(
              "TaskWorkerSchema",
              {
                _id: new BSON.ObjectId("000000000000000000000000"),
                userId: "000000000000000000000000",
                objectId: "000000000000000000000000",
                orderId: "000000000000000000000000",
                taskId: "000000000000000000000000",
                workerId: "000000000000000000000000",
                operationId: "000000000000000000000000",
                sortOrder: 0,
                statusId: "000000000000000000000000",
                status: "wait",
                from: dayjs().subtract(1, "year").format(),
                to: dayjs().add(1, "year").format(),
                typeGo: "default",
                createdAt: dayjs().format(),
                updatedAt: dayjs().format(),
              },
              UpdateMode.Modified
            );
            realm.create(
              "TaskSchema",
              {
                _id: new BSON.ObjectId("000000000000000000000000"),
                userId: "000000000000000000000000",
                objectId: "000000000000000000000000",
                orderId: "000000000000000000000000",
                operationId: "000000000000000000000000",
                taskId: "000000000000000000000000",
                workerId: "000000000000000000000000",
                name: t("fake.nameTask"),
                sortOrder: 0,
                statusId: "000000000000000000000000",
                status: "wait",
                active: 0,
                autoCheck: 0,
                startAt: dayjs().format(),
                from: dayjs().subtract(1, "year").format(),
                to: dayjs().add(1, "year").format(),
                typeGo: "default",
                createdAt: dayjs().format(),
                updatedAt: dayjs().format(),
              },
              UpdateMode.Modified
            );
            realm.create(
              "OrderSchema",
              {
                _id: new BSON.ObjectId("000000000000000000000000"),
                userId: "000000000000000000000000",
                number: t("fake.numberOrder"),
                name: t("fake.nameOrder"),
                description: t("fake.descriptionTask"),
                constructorId: "000000000000000000000000",
                objectId: "000000000000000000000000",
                term: dayjs().add(1, "year").format(),
                dateStart: dayjs().format(),
                status: 1,
                year: dayjs().year(),
                createdAt: dayjs().format(),
                updatedAt: dayjs().format(),
              },
              UpdateMode.Modified
            );
            realm.create(
              "TaskStatusSchema",
              {
                _id: new BSON.ObjectId("000000000000000000000000"),
                userId: "000000000000000000000000",
                name: t("fake.nameTaskStatus"),
                description: "",
                color: "#c2c2c2",
                enabled: 1,
                icon: "M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z",
                animate: "",
                status: "wait",
                createdAt: dayjs().format(),
                updatedAt: dayjs().format(),
              },
              UpdateMode.Modified
            );
          });
        };
        onInitFakeData();
      } catch (e: any) {
        isWriteConsole && console.log("WidgetInitApp error: ", e.message);
        Alert.alert(t("error.title"), e?.toString());
      } finally {
      }
    };

    onFetching();
  }, [appState]);

  return null;
  // !isInternetReachable ? (
  //     <View tw="absolute top-12 px-6 w-full">
  //         <Text tw="text-s-200 text-lg text-center">For first start app need internet!</Text>
  //     </View>
  // ) :
};
