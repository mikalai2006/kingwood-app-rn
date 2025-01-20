import { View, ActivityIndicator, Platform, Image, Text } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { hostAPI } from "@/utils/global";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTokens, tokens } from "@/store/storeSlice";
// import WebView from "react-native-webview";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";

export default function Page() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();

  return (
    <View className="bg-s-50 dark:bg-s-950 flex-1">
      <View className="flex-auto mb-24">
        <View className="flex-1 pt-8 pb-3 px-0 bg-white dark:bg-s-900">
          Auth
        </View>
      </View>
    </View>
  );
}
