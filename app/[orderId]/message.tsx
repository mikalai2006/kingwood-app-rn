import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  View,
} from "react-native";

import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useColorScheme } from "nativewind";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { useObject, useQuery } from "@realm/react";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import UserInfoAvatar from "@/components/user/UserInfoAvatar";
import UIButton from "@/components/ui/UIButton";
import SIcon from "@/components/ui/SIcon";
import useMessages from "@/hooks/useMessages";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI, hostSERVER, isWriteConsole } from "@/utils/global";
import { MessageSchema } from "@/schema/MessageSchema";
import dayjs from "@/utils/dayjs";
import { Colors } from "@/utils/Colors";
import { BSON } from "realm";
import { ImagePickerAsset } from "expo-image-picker";
import { IImage } from "@/types";
import UIUpload from "@/components/ui/UIUpload";
import RImage from "@/components/r/RImage";
import { OrderSchema } from "@/schema";
import { useTranslation } from "react-i18next";
// import OrderShortInfo from "@/components/order/OrderShortInfo";

export default function MessageOrderScreen() {
  const dispatch = useAppDispatch();

  const { colorScheme } = useColorScheme();

  const pathname = usePathname();

  const { orderId } = useGlobalSearchParams<{
    orderId: string;
  }>();

  // const room = useObject(MessageRoomSchema, new BSON.ObjectId(roomId));
  // const { productId: productIdGlobal } = useGlobalSearchParams<{
  //   productId: string;
  // }>();
  // if (!productId) {
  //   productId = productIdGlobal;
  // }

  const userFromStore = useAppSelector(user);

  const order = useObject(OrderSchema, new BSON.ObjectId(orderId));

  // const userRoom = useObject(
  //   UserSchema,
  //   new BSON.ObjectId(
  //     room?.userId === userFromStore?.id ? room?.takeUserId : room?.userId
  //   )
  // );

  const messagesByRoom = useQuery(MessageSchema, (items) =>
    items.filtered("orderId == $0", orderId).sorted("createdAt", false)
  );

  const [newMessage, setNewMessage] = useState("");

  const [skip, setSkip] = useState(0);

  const { total, onQuery } = useMessages({
    orderId: [orderId],
    $sort: [{ key: "createdAt", value: -1 }],
    $skip: skip,
  });

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<ImagePickerAsset[] | IImage[]>([]);

  const { onFetchWithAuth } = useFetchWithAuth();

  useEffect(() => {
    if (skip === 0) {
      scrollView.current?.scrollToEnd({ animated: true });
    }
  }, [messagesByRoom]);

  const onRemoveImage = async (
    img: ImagePickerAsset | IImage,
    index: number
  ) => {
    const newValue = images.slice();
    newValue.splice(index, 1);
    // console.log("Remove", img, index, newValue);
    setImages([...newValue]);
  };

  const { t } = useTranslation();

  const onAddMessage = async () => {
    if (newMessage.trim() === "" && !images.length) {
      Alert.alert("Введите текст сообщения ");
      return;
    }

    setLoading(true);

    const data = new FormData();

    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      data.append("images", {
        name: element.fileName,
        type: element.mimeType,
        uri: element.uri,
      });
    }

    data.append("message", newMessage);
    data.append("orderId", orderId);

    return await onFetchWithAuth(`${hostAPI}/message`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin-Type": "*",
      },
      body: data,
      // body: JSON.stringify({
      //   roomId,
      //   message: newMessage,
      // }),
    })
      .then((res) => res.json())
      .then((res: any) => {
        setNewMessage("");
        setImages([]);
      })
      .catch((e) => {
        isWriteConsole && console.log("onAddMessage Error", e);

        Alert.alert(t("error.title"), e.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const scrollView = useRef(null);

  const onZoomImage = (img: IImage) => {
    console.log("Gogo");
    setActiveImg(img);
    setModalVisible(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [activeImg, setActiveImg] = useState<IImage | null>(null);

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
        onRequestClose={() => {}}
      >
        <View className="flex-1 bg-s-100/70 dark:bg-s-800/70 dark: p-6">
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size={30}
              color={colorScheme == "dark" ? Colors.white : Colors.black}
            />
          </View>
        </View>
      </Modal>
      {order && (
        <>
          <View className="flex-auto">
            <View>
              {total > messagesByRoom.length ? (
                <UIButton
                  type="primary"
                  text="more"
                  onPress={() => setSkip(messagesByRoom.length - 1)}
                />
              ) : null}
            </View>
            <ScrollView
              className="flex-1"
              ref={(ref) => {
                scrollView.current = ref;
              }}
            >
              <View className="p-4 flex items-stretch gap-4">
                {/* <View className="flex flex-row gap-2">
                <UserInfoAvatar userId={userId} />
                <View className="bg-s-100 dark:bg-s-500/10 p-4 rounded-lg">
                  <Text className="text-lg text-s-800 dark:text-s-100 leading-5">
                    {productId} {userId}
                  </Text>
                </View>
              </View> */}

                {messagesByRoom.map((x) => (
                  <View
                    key={x._id.toString()}
                    className={`flex flex-row gap-2 ${
                      userFromStore?.id === x.userId ? " self-end" : ""
                    }`}
                  >
                    {userFromStore?.id !== x.userId && (
                      <View>
                        <UserInfoAvatar userId={x.userId} />
                      </View>
                    )}
                    <View className="flex-initial">
                      {/* <Text className="text-lg text-s-800 dark:text-s-100 leading-5">
                      {productId}
                    </Text> */}
                      <View className="bg-white dark:bg-s-800 p-4 rounded-lg">
                        <View
                          className={`absolute top-3 w-4 h-4 bg-white dark:bg-s-800 rotate-45 ${
                            userFromStore?.id !== x.userId
                              ? "-left-1"
                              : "-right-1"
                          } `}
                        ></View>
                        {/* <Text>{JSON.stringify(x.images)}</Text> */}
                        {x.images?.length ? (
                          <View className="flex flex-row flex-wrap gap-2 mb-4">
                            {x.images.map((img, index) => (
                              <TouchableOpacity
                                key={index.toString()}
                                onPress={() => onZoomImage(img)}
                              >
                                <View className="h-20 w-auto aspect-square">
                                  <RImage
                                    image={img}
                                    // uri={`${hostSERVER}/images/${uri}`}
                                    className="w-full h-full object-contain rounded-lg"
                                  />
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                        ) : null}
                        <Text className="text-lg text-s-800 dark:text-s-100 leading-5">
                          {x.message}
                        </Text>
                        <Text className="text-sm text-s-500 text-right">
                          {dayjs(x.createdAt).fromNow()}
                        </Text>
                      </View>
                      {/* <View></View> */}
                    </View>
                    {userFromStore?.id === x.userId && (
                      <View>
                        <UserInfoAvatar userId={x.userId} />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          {images.length > 0 && (
            <View className="flex flex-row gap-2 bg-s-50 dark:bg-s-700 p-2 pb-0">
              {images.map((img, index) => (
                <View className="h-20 w-auto aspect-square" key={index}>
                  <RImage
                    image={img}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <View className="absolute -bottom-3 -right-3">
                    <UIButton
                      type="link"
                      // disabled={disabled}
                      onPress={() => onRemoveImage(img, index)}
                    >
                      <View className="bg-red-300 rounded-lg p-2">
                        <SIcon path="iDelete" size={20} />
                      </View>
                    </UIButton>
                  </View>
                </View>
              ))}
            </View>
          )}
          <View className="flex flex-row flex-nowrap gap-0 items-stretch justify-stretch">
            <View className="flex items-stretch justify-stretch bg-s-50 dark:bg-s-800">
              <UIUpload
                value={images}
                title="Изображения товара"
                setValue={setImages}
                service="message"
                serviceId={undefined}
                disabled={images.length >= 3}
                hideList
                chooseElement={
                  <View className="flex items-stretch justify-stretch">
                    <UIButton
                      type="link"
                      loading={loading}
                      disabled={loading}
                      onPress={() => {
                        router.navigate("/modalpicker");
                      }}
                    >
                      <SIcon path="iClip" size={25} color={Colors.s[500]} />
                    </UIButton>
                  </View>
                }
              />
            </View>
            <View className="flex-auto">
              <TextInput
                className="text-lg bg-s-50 dark:bg-s-800 p-4 text-s-900 dark:text-s-300 placeholder:text-s-500 focus:border-p-500"
                value={newMessage}
                placeholder="Введите сообщение ..."
                onFocus={() => {
                  scrollView.current.scrollToEnd({ animated: true });
                }}
                onTouchStart={() => {
                  scrollView.current.scrollToEnd({ animated: true });
                }}
                onChangeText={(newMessage) => {
                  setNewMessage(newMessage);
                }}
              />
            </View>
            <View className="flex-none">
              <UIButton
                type="link"
                loading={loading}
                disabled={loading}
                icon="iChevronRightDouble"
                className="flex-1 m-0 p-4 bg-s-500"
                onPress={() => {
                  onAddMessage();
                }}
              >
                {/* <SIcon
                  path="iChevronRightDouble"
                  size={25}
                  color={Colors.white}
                /> */}
              </UIButton>
            </View>
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1">
          <View className="flex-1 bg-s-100 dark:bg-s-800">
            <Image
              className={""}
              source={{
                uri: `${hostSERVER}/images/${activeImg?.service}/${activeImg?.serviceId}/${activeImg?.path}${activeImg?.ext}`,
              }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
            {/* <RImage
              image={activeImg}
              className="w-auto h-full object-contain"
            /> */}
            {/* <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable> */}
          </View>
        </View>
      </Modal>
    </View>
  );
}
