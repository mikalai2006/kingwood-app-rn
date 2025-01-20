import { Alert, Text, View } from "react-native";

import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalObjectId() {
  return (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        {/* <View className="flex flex-row gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            <UserInfo userId={userRoom?._id.toString()} />
          </View>
        </View> */}
        <View className="flex-1 bg-s-200 dark:bg-s-950"></View>
      </SafeAreaView>
    </View>
  );
}
