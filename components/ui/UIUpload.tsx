import { Modal, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";

import UIButton from "../ui/UIButton";
import SIcon from "../ui/SIcon";
import RTitle from "@/components/r/RTitle";
import RImage from "@/components/r/RImage";
import { IImage } from "@/types";
import { useAppSelector } from "@/store/hooks";
import { tokens, user } from "@/store/storeSlice";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";

export type UIUploadProps = {
  serviceId: string | undefined;
  service: string;
  title: string;
  disabled?: boolean;
  value: ImagePickerAsset[] | IImage[];
  chooseElement?: React.ReactNode;
  hideList?: boolean;
  setValue: (items: ImagePickerAsset[] | IImage[]) => void;
};

const UIUpload = ({
  value,
  setValue,
  service,
  serviceId,
  disabled,
  title,
  chooseElement,
  hideList,
}: UIUploadProps) => {
  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);

  const { addListener, removeListener } = useNavigation();
  const glob = useGlobalSearchParams<{ typePicker: "photo" | "gallery" }>();
  const onGetRouteParams = () => {
    if (!glob.typePicker) {
      return;
    }

    if (glob.typePicker === "gallery") {
      pickImage();
    } else if (glob.typePicker === "photo") {
      goPhoto();
    }

    router.setParams({ typePicker: undefined });
  };
  useEffect(() => {
    addListener("focus", onGetRouteParams);

    return () => {
      removeListener("focus", onGetRouteParams);
    };
  }, [glob]);

  const onUploadImage = useCallback(async (assets: ImagePickerAsset[]) => {
    // console.log("assets: ", assets, userFromStore, serviceId);
    if (!userFromStore || !serviceId) {
      return;
    }

    const images = assets;
    if (!images?.length) {
      return;
    }

    const data = new FormData();

    for (let index = 0; index < images.length; index++) {
      const img = images[index];

      data.append("images", {
        name: img.fileName,
        type: img.mimeType,
        uri: img.uri,
      });
    }
    data.append("service", service);
    data.append("serviceId", serviceId);

    if (!tokensFromStore) {
      return;
    }

    await fetch(`${hostAPI}/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokensFromStore.access_token}`,
        "Access-Control-Allow-Origin-Type": "*",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        // console.log("response", response);
        // dispatch(setUser({ ...userFromStore, images: [...response] }));
      })
      .catch((error) => {
        isWriteConsole && console.log("error", error);
      });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      selectionLimit: 1,
      quality: 1,
      // allowsMultipleSelection: true,
    });

    // console.log("result: ", result);

    if (!result.canceled) {
      if (serviceId) {
        onUploadImage(result.assets);
      }
      setValue([...value, ...result.assets]);
      // setModalVisible(false);
    }
  };

  const goPhoto = async () => {
    const { assets } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
      // videoQuality: 1,
      // videoMaxDuration: 0,
      // allowsMultipleSelection: true,
    });
    // console.log("assets: ", assets);

    if (assets) {
      // await MediaLibrary.saveToLibraryAsync(assets[0].uri);
      if (serviceId) {
        onUploadImage(assets);
      }
      setValue([...value, ...assets]);
      // setModalVisible(false);
    }
  };

  // const [modalVisible, setModalVisible] = useState(false);

  const { onFetchWithAuth } = useFetchWithAuth();
  const onRemoveImage = async (
    img: ImagePicker.ImagePickerAsset | IImage,
    index: number
  ) => {
    if (img?.id) {
      await onFetchWithAuth(`${hostAPI}/image/${img.id}`, {
        method: "DELETE",
        headers: {
          "Access-Control-Allow-Origin-Type": "*",
        },
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((res: IImage[]) => {})
        .catch((e) => {
          console.log("UIUpload Error", e);
        });
    }

    const newValue = value.slice();
    newValue.splice(index, 1);
    // console.log("Remove", img, index, newValue);
    setValue([...newValue]);
  };

  return (
    <View className="flex">
      {!hideList && (
        <Text className="text-md text-s-500 dark:text-s-400 mb-1.5">
          {title}
        </Text>
      )}
      <View className="flex flex-row flex-wrap">
        {!hideList &&
          value.length > 0 &&
          value.map((img, index) => (
            <View className="w-1/3 h-32 p-1" key={index.toString()}>
              <RImage image={img} className="flex-1 rounded-lg" />
              {!disabled && (
                <View className="absolute bottom-0 right-0">
                  <UIButton
                    type="link"
                    disabled={disabled}
                    onPress={() => onRemoveImage(img, index)}
                  >
                    <View className="bg-red-300 rounded-full p-2">
                      <SIcon path="iDelete" size={20} />
                    </View>
                  </UIButton>
                </View>
              )}
            </View>
          ))}
        {chooseElement || (
          <View className="w-1/3 h-32 p-1">
            <UIButton
              type="link"
              className="w-full h-full"
              disabled={disabled}
              onPress={() => router.navigate("/modalpicker")}
            >
              <View className="flex-1 flex-col items-center align-middle justify-center px-4 py-2 border border-dashed rounded-lg border-s-400 dark:border-s-700">
                <SIcon path="iPlus" size={30} />
                <Text className="text-s-800 dark:text-s-200 text-md">
                  Добавить
                </Text>
              </View>
            </UIButton>
          </View>
        )}
      </View>

      {/* <Modal
        animationType="none"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex-1 p-6 pt-12 relative">
          <View className="flex-1 absolute right-0 left-0 top-0 bottom-0 bg-s-200 dark:bg-s-800 opacity-90"></View>
          <View className="flex gap-4 bg-white dark:bg-s-900 rounded-lg p-4">
            <RTitle className="text-center" text="Добавить изображение" />
            <UIButton
              type="secondary"
              text="goPhoto"
              icon="iCamera"
              onPress={goPhoto}
            />
            <UIButton
              type="secondary"
              text="pickImage"
              icon="iImage"
              onPress={pickImage}
            />
            <UIButton
              type="link"
              text="close"
              icon="iClose"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

export default UIUpload;
