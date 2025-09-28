import { hostAPI, timeoutMaxRequest } from "@/utils/global";

import {
  tokens,
  setTokens,
  setUser,
  setActiveTaskWorker,
  setWorkHistory,
  setAccessToken,
} from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useFetch from "@/hooks/useFetch";
import { ITokens, IUser } from "@/types";
import { useCallback, useEffect, useRef } from "react";
import { useError } from "./useError";
import { isExpiredTime } from "@/utils/utils";
import { CustomError } from "./useErrors";

export interface ISign {
  email: string;
  password: string;
  login?: string;
}

export default function useAuth() {
  const dispatch = useAppDispatch();
  // const navigation = useNavigation();
  const tokenFromStore = useAppSelector(tokens);

  const { onFetch } = useFetch();

  const { onSendError } = useError();

  // const isAccessTokenExpiredRef = useRef<() => boolean>(() => false);
  /**
   * Определяем истек ли токена доступа
   * @returns boolean
   */
  // const isAccessTokenExpired = useCallback(() => {
  //   return isAccessTokenExpiredRef.current();
  // }, []);
  // useEffect(() => {
  //   isAccessTokenExpiredRef.current = () => {
  //     // console.log("isAccessTokenExpired: tokenFromStore:", tokenFromStore);
  //     if (!tokenFromStore?.expires_in) {
  //       return true;
  //     }

  //     const time = new Date().getTime();
  //     const timeExp = new Date(tokenFromStore.expires_in).getTime();
  //     const isExp = timeExp - time - timeoutMaxRequest <= 0;

  //     // console.log(
  //     //   "isAccessTokenExpired: ",
  //     //   isExp,
  //     //   timeExp - time,
  //     //   timeExp,
  //     //   time
  //     // );
  //     return isExp;
  //   };
  // });

  // const isRefreshTokenExpiredRef = useRef<() => boolean>(() => false);
  // /**
  //  * Определяем истек ли токен для обновления токена доступа
  //  * @returns boolean
  //  */
  // const isRefreshTokenExpired = useCallback(() => {
  //   return isRefreshTokenExpiredRef.current();
  // }, []);
  // useEffect(() => {
  //   isRefreshTokenExpiredRef.current = () => {
  //     // console.log("isRefreshTokenExpired: tokenFromStore:", tokenFromStore);
  //     if (!tokenFromStore?.expires_in_r) {
  //       return true;
  //     }

  //     const time = new Date().getTime();
  //     const timeExp = new Date(tokenFromStore.expires_in_r).getTime();
  //     const isExp = timeExp - time - timeoutMaxRequest <= 0;

  //     // console.log(
  //     //   "isRefreshTokenExpired: ",
  //     //   isExp,
  //     //   timeExp - time
  //     //   // timeExp,
  //     //   // time
  //     // );
  //     return isExp;
  //   };
  // });

  const onRefreshTokenRef = useRef<() => Promise<ITokens | null>>(null!);
  const onRefreshToken = useCallback(() => {
    return onRefreshTokenRef.current();
  }, []);
  useEffect(() => {
    onRefreshTokenRef.current = async (): Promise<ITokens | null> => {
      if (!tokenFromStore?.refresh_token) {
        // navigation.navigate(ScreenKeys.AuthScreen);
        return null;
      }
      // console.log("onRefreshToken: tokens====>", tokenFromStore);

      return await onFetch(hostAPI + "/auth/refresh", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token.access_token}`,
        },
        body: JSON.stringify({
          token: tokenFromStore?.refresh_token,
        }),
      })
        .then((r) => r.json())
        .then((response) => {
          // console.log("onRefreshToken: response<=====", response);
          if (!response?.access_token) {
            dispatch(setTokens(null));
            // navigation.navigate(ScreenKeys.AuthScreen);
            return null;
          } else {
            dispatch(
              setTokens({
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                expires_in: response.expires_in,
                expires_in_r: response.expires_in_r,
              })
            );

            return response;
          }
        })
        .catch((e) => {
          onSendError(new CustomError("refreshToken", e?.message));
          throw e;
        });
    };
  });

  const onSyncTokenRef = useRef<() => Promise<ITokens | null>>(null!);
  const onSyncToken = useCallback(() => {
    return onSyncTokenRef.current();
  }, []);
  useEffect(() => {
    onSyncTokenRef.current = async (): Promise<ITokens | null> => {
      try {
        const { access_token, refresh_token } = tokenFromStore || {};

        const isAuthActually =
          access_token &&
          access_token !== "" &&
          !isExpiredTime(tokenFromStore?.expires_in);
        // const mayByRefresh = refresh_token !== "" && !isExpiredTime(tokenFromStore?.expires_in_r);

        // console.log(
        //   "isAuthActually=",
        //   isAuthActually,
        //   "mayByRefresh=",
        //   mayByRefresh
        //   // "isAccessTokenExpired()=",
        //   // isAccessTokenExpired(),
        //   // "isRefreshTokenExpired()=",
        //   // isRefreshTokenExpired()
        // );
        if (!isAuthActually) {
          // if (mayByRefresh) {
          //   const refreshTokens = await onRefreshToken();
          //   // if (!refreshTokens) {
          //   //     navigation.navigate(ScreenKeys.AuthScreen);
          //   // }
          //   return refreshTokens;
          // } else {
          //   // throw new Error('Not auth');
          //   // navigation.navigate(ScreenKeys.AuthScreen);
          //   router.navigate("/modalauth");
          //   return null;
          // }

          dispatch(setAccessToken(""));
          return null;
        } else {
          return tokenFromStore;
        }
      } catch (e: any) {
        onSendError(new CustomError("OnSyncToken", e?.message));
        throw e;
      }
    };
  });

  const onGetIamRef = useRef<() => Promise<IUser | undefined>>(null!);
  /**
   * Функция подгрузки данных авторизированного пользователя
   */
  const onGetIam = useCallback(() => {
    return onGetIamRef.current();
  }, []);
  useEffect(() => {
    onGetIamRef.current = async () => {
      // console.log('onGetIam::: token.access_token=[', token.access_token, ']', token.access_token === '');
      if (
        !tokenFromStore?.access_token ||
        isExpiredTime(tokenFromStore?.expires_in)
      ) {
        return;
      }
      return await onFetch(hostAPI + "/auth/iam", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenFromStore.access_token}`,
        },
        // body: JSON.stringify({}),
      })
        .then((r) => r.json())
        .then((response: IUser) => {
          // console.log("response=", response);
          // console.log('message=', response.message);
          if (!response.id) {
            dispatch(setTokens({ access_token: "" }));
            // throw response;
          } else {
            dispatch(setUser({ ...response }));
            // console.log("user data: ", response);

            return response;
          }
        })
        .catch((e) => {
          onSendError(new CustomError("onGetIam", e?.message));
          throw e;
        });
    };
  });

  const onLogout = async () => {
    // dispatch(setActiveTaskWorker(null));
    // dispatch(setWorkHistory(null));

    dispatch(setTokens(null));
    dispatch(setUser(null));
  };

  const onBlock = async (id: string) => {
    if (
      !tokenFromStore?.access_token ||
      isExpiredTime(tokenFromStore?.expires_in) ||
      !id
    ) {
      return;
    }

    await onFetch(`${hostAPI}/user/block/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenFromStore.access_token}`,
      },
      // body: JSON.stringify({
      //   id
      // }),
    })
      .then((r) => r.json())
      .then((response: IUser) => {
        dispatch(setActiveTaskWorker(null));
        dispatch(setWorkHistory(null));

        dispatch(setTokens(null));
        dispatch(setUser(null));
      })
      .catch((e) => {
        onSendError(new CustomError("onBlock", e?.message));
        throw e;
      });
  };
  // const onLogin = async ({email, password}: ISign) => {
  //     const d = await fetch(HOST_API + '/auth/sign-in', {
  //         method: 'POST',
  //         headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //             email,
  //             password,
  //         }),
  //     })
  //         .then(r => r.json())
  //         .then((data: ITokens) => {
  //             if (data.access_token && data.refresh_token) {
  //                 dispatch(setTokens(data));
  //             }
  //             return data;
  //         })
  //         .catch(e => {
  //             // Alert.alert('Error', JSON.stringify(e));
  //             dispatch(setTokens({access_token: '', refresh_token: ''}));
  //             throw new Error(e);
  //         });

  //     return d;
  // };

  // const onSignUp = async ({email, password, login}: ISign): Promise<ITokens> => {
  //     const d = await fetch(HOST_API + '/auth/sign-up', {
  //         method: 'POST',
  //         headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //             email,
  //             password,
  //             login,
  //         }),
  //     })
  //         .then(r => r.json())
  //         .then(data => {
  //             return data;
  //             // fetch(`http://localhost:8000/api/v1/auth/sign-in`, {
  //             //     method: 'POST',
  //             //     headers: {
  //             //         Accept: 'application/json',
  //             //         'Content-Type': 'application/json',
  //             //     },
  //             //     body: JSON.stringify({
  //             //         email,
  //             //         password,
  //             //     }),
  //             // })
  //             //     .then(r => r.json())
  //             //     .then((res: ITokens) => {
  //             //         if (res.access_token && res.refresh_token) {
  //             //             alert(JSON.stringify(res));
  //             //             dispatch(setTokenAccess(res));
  //             //             setEmail('');
  //             //             setPassword('');
  //             //             setConfirmPassword('');
  //             //             navigation.goBack();
  //             //         }
  //             //     })
  //             //     .catch(e => {
  //             //         alert(JSON.stringify(e));
  //             //     });
  //         })
  //         .catch(e => {
  //             // console.log('useAuth: onSignUp Error:::', JSON.stringify(e));
  //             throw new Error(e);
  //         });

  //     return d;
  // };

  return {
    onGetIam,
    onRefreshToken,
    // isAccessTokenExpired,
    onSyncToken,
    onLogout,
    onBlock,
  };
}
