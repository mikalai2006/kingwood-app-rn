import { Text, View } from "react-native";
import { useObject } from "@realm/react";
import { useColorScheme } from "nativewind";
import { BSON } from "realm";
import { ObjectsSchema } from "@/schema/ObjectsSchema";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";

export type TaskObjectProps = {
  objectId: string;
};

export function TaskObject({ objectId }: TaskObjectProps) {
  const { colorScheme } = useColorScheme();

  const object = useObject(ObjectsSchema, new BSON.ObjectId(objectId));

  return object ? (
    <UIButton
      type="link"
      className="p-2 flex flex-row items-center"
      onPress={() => {
        router.push({
          pathname: "/modalobject/[id]",
          params: { id: object._id.toString() },
        });
      }}
    >
      <View className="flex-auto">
        <Text className="text-lg font-medium text-s-500 dark:text-s-400 pr-1">
          {object?.name}
        </Text>
      </View>

      <View>
        <SIcon
          path="iChevronRight"
          size={20}
          color={colorScheme === "dark" ? Colors.s[500] : Colors.s[300]}
        />
      </View>
    </UIButton>
  ) : (
    <Text>Not found object</Text>
  );
}
