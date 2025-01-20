import { Colors } from "@/utils/Colors";
import { useAppSelector } from "@/store/hooks";
import { tokens } from "@/store/storeSlice";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

export default function RootStack() {
  const { colorScheme } = useColorScheme();

  const tokensFromStore = useAppSelector(tokens);

  return (
    <>
      {tokensFromStore?.access_token ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modalcategory"
            options={{
              title: "Выберите категорию",
              // presentation: "transparentModal",
              // animation: "slide_from_right",
              // headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalpicker"
            options={{
              title: "Добавление изображения",
              // presentation: "transparentModal",
              // animation: "slide_from_right",
              // headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalfilter"
            options={{
              title: "Настройка фильтра",
              // presentation: "transparentModal",
              // animation: "slide_from_right",
              // headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalsort"
            options={{
              title: "Настройка сортировки",
              // presentation: "transparentModal",
              // animation: "slide_from_right",
              // headerShown: false,
            }}
          />
          <Stack.Screen
            name="product"
            options={{
              // presentation: "transparentModal",
              // animation: "slide_from_right",
              headerShown: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="modalauth"
          options={{
            title: "Авторизация",
            // presentation: "transparentModal",
            // animation: "slide_from_right",
            headerShown: false,
          }}
        />
      )}
      {/* <Stack.Screen
                  name="auth"
                  options={{
                    headerShown: false,
                    // presentation: 'transparentModal',
                    // animation: "slide_from_bottom",
                  }}
                /> */}
      <Stack.Screen name="+not-found" />
    </>
  );
}
