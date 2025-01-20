import Card from "@/components/Card";
import RText from "@/components/r/RText";
import UIButton from "@/components/ui/UIButton";
import { router } from "expo-router";
import { View } from "react-native";

export default function Modal() {
  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950 p-4">
      <Card className="gap-4">
        <RText text="Выберите как добавить изображение" />
        <UIButton
          type="secondary"
          text="Сделать фото"
          icon="iCamera"
          onPress={() => {
            router.back();
            router.setParams({ typePicker: "photo" });
          }}
        />
        <UIButton
          type="secondary"
          text="Загрузить из галереи"
          icon="iImage"
          onPress={() => {
            router.back();
            router.setParams({ typePicker: "gallery" });
          }}
        />
        {/* <UIButton
            type="link"
            text="close"
            icon="iClose"
            onPress={() => {
              router.back();
            }}
          /> */}
      </Card>
    </View>
  );
}
