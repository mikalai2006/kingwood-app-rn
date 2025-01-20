import { View, Text } from "react-native";
import React from "react";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import SIcon from "../ui/SIcon";
import { useObject, useQuery } from "@realm/react";
import { MessageSchema } from "@/schema/MessageSchema";
import { MessageRoomSchema } from "@/schema/MessageRoomSchema";
import UserInfoAvatar from "../user/UserInfoAvatar";
import { Colors } from "@/utils/Colors";
import { BSON } from "realm";
import OrderShortInfo from "../order/OrderShortInfo";

export type MessageRoomButtonProps = {
  roomId: string;
};

const MessageRoomButton = ({ roomId }: MessageRoomButtonProps) => {
  const room = useObject(MessageRoomSchema, new BSON.ObjectId(roomId));

  const messagesByRoom = useQuery(MessageSchema, (items) =>
    items.filtered("roomId == $0 && status == $1", roomId, 1)
  );

  return (
    room && (
      <UIButton
        type="link"
        className="m-0 bg-white dark:bg-s-900 border-t border-s-200 dark:border-s-800"
        onPress={() => {
          router.push({
            pathname: `/modalmessage/[roomId]`,
            params: {
              roomId,
            },
          });
        }}
      >
        <View className="flex items-center gap-4 p-4">
          {/* <Text
          className="text-base text-s-800 dark:text-s-200 leading-5"
          lineBreakMode="tail"
          numberOfLines={2}
        >
          {products[0]?.description}
        </Text> */}
          <View className="flex-auto flex flex-row items-center gap-4">
            <View>
              <UserInfoAvatar
                key={room.userId}
                userId={room.userId}
                borderColor="border-white dark:border-s-800"
              />
            </View>
            <View className="rotate-180">
              <SIcon
                path="iChevronLeftDouble"
                size={20}
                color={Colors.s[400]}
              />
            </View>
            <View className="flex-auto">
              <OrderShortInfo id={room.productId} />
            </View>
            <View className="rotate-180">
              <SIcon
                path="iChevronLeftDouble"
                size={20}
                color={Colors.s[400]}
              />
            </View>
            <View>
              <UserInfoAvatar
                key={room.takeUserId}
                userId={room.takeUserId}
                borderColor="border-white dark:border-s-800"
              />
            </View>
          </View>
          {/* <View>
                  {item.images.slice(1).map((img, index) => (
                    <RImage key={index} className="h-8 w-8" image={img} />
                  ))}
                </View> */}
          {/* <View className="flex-auto flex flex-row items-center gap-4">
          <View className="flex-auto">
            <Text className="text-lg leading-5 text-s-800 dark:text-s-200">
              {product.title}
            </Text>
            <Text className="text-sm text-s-500">
              Добавлен {dayjs(product.createdAt).fromNow()}
            </Text>
          </View>
          <View className="px-2 py-2 relative">
            <SIcon path="iChevronRight" size={20} />
          </View>
        </View> */}
          {messagesByRoom.length ? (
            <View
              className="rounded-lg bg-gr-500 absolute top-0 right-0 border-white dark:border-s-800"
              style={{ borderWidth: 2 }}
            >
              <Text className="px-1.5 py-0.5 text-white dark:text-black leading-4">
                новое
              </Text>
            </View>
          ) : null}
        </View>
      </UIButton>
    )
  );
};

export default MessageRoomButton;
