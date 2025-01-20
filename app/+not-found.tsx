import { Link, Stack, usePathname } from "expo-router";
import { Text } from "react-native";

export default function NotFoundScreen() {
  const pathname = usePathname();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Text>This screen doesn't exist. {pathname}</Text>
      <Link href="/">
        <Text>Go to home screen!</Text>
      </Link>
      <Link href="/_sitemap">
        <Text>Map!</Text>
      </Link>
    </>
  );
}
