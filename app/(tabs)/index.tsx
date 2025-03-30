import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";

export default function Page() {
  const userFromStore = useAppSelector(user);

  if (!userFromStore) {
    return <Redirect href="/auth" />;
  }

  // if (
  //   ["admin", "boss", "designer", "superadmin"].includes(
  //     userFromStore?.roleObject.code
  //   )
  // ) {
  //   return <Redirect href="/(tabs)/order" />;
  // }

  if (
    !["admin", "boss", "designer", "superadmin"].includes(
      userFromStore?.roleObject.code
    )
  ) {
    return <Redirect href="/(tabs)/order" />;
  }
  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      {/* <Text>Welcome Back!</Text> */}
    </View>
  );
}
