// import { useEffect } from "react";
// import { hostAPI } from "@/utils/global";

// import { activeLanguage, user } from "@/store/storeSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import useAuth from "@/hooks/useAuth";
// import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
// import useTaskStatus from "@/hooks/useTaskStatus";
// import useNotify from "@/hooks/useNotify";

// export const WidgetInitAppWithAuth = () => {
//   const userFromStore = useAppSelector(user);
//   // const {onSyncToken} = useAuth();

//   // const dispatch = useAppDispatch();
//   // const activeLanguageFromStore = useAppSelector(activeLanguage);

//   // const {onFetchWithAuth} = useFetchWithAuth();
//   if (userFromStore) {
//     // useTaskStatus({});
//     useNotify({
//       userTo: userFromStore?.id ? [userFromStore?.id] : undefined,
//       status: 0,
//     });
//   }
//   // useMessagesRooms({
//   //   userId: userFromStore?.id,
//   // });

//   // useEffect(() => {
//   //     const onFetching = async () => {
//   //         try {

//   //             const tokenFromStore = await onSyncToken();
//   //             if (tokenFromStore && !isTokenExpired()) {
//   //                 await onFindAmenities(tokenFromStore);
//   //             }
//   //         } catch (e: any) {
//   //             console.log('WidgetInitAppWithAuth error: ', e.message);
//   //         } finally {
//   //         }
//   //     };

//   //     onFetching();
//   // }, [activeLanguageFromStore?.code]);

//   return null;
// };
