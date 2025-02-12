import { View, Text, Alert, Modal } from "react-native";
import React, { useCallback, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import { setUser, tokens, user } from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import RImage from "@/components/r/RImage";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import SIcon from "../ui/SIcon";
import { hostAPI, isWriteConsole } from "@/utils/global";
import useAuth from "@/hooks/useAuth";
import RTitle from "../r/RTitle";

const UserSettingAvatar = () => {
  const { t } = useTranslation();

  const { onGetIam } = useAuth();

  const dispatch = useAppDispatch();
  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);

  const handleUploadPhoto = useCallback(async (response: any) => {
    if (!userFromStore) {
      return;
    }

    const images = response.assets;
    if (!images?.length) {
      return;
    }

    const data: any = new FormData();

    data.append("images", {
      name: images[0].fileName,
      type: images[0].mimeType, //.type,
      uri: images[0].uri,
    });
    data.append("service", "user");
    data.append("serviceId", userFromStore.id);

    if (!tokensFromStore) {
      return;
    }
    isWriteConsole && console.log("fetch: ", `${hostAPI}/image`);

    await fetch(`${hostAPI}/user/${userFromStore.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokensFromStore.access_token}`,
        "Access-Control-Allow-Origin-Type": "*",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        isWriteConsole && console.log("response", response);
        // dispatch(setUser({ ...userFromStore, images: [...response] }));
      })
      .catch((error) => {
        isWriteConsole && console.log("error", error);
      });
  }, []);

  // const onResponse = useCallback(
  //   (response) => {
  //     handleUploadPhoto(response);
  //   },
  //   [handleUploadPhoto]
  // );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
    });

    isWriteConsole && console.log("result: ", result);

    await handleUploadPhoto(result);

    if (!result.canceled) {
      onGetIam();
      setModalVisible(false);
    }
  };

  const goPhoto = async () => {
    const { assets } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
      videoQuality: 1,
      videoMaxDuration: 0,
      allowsMultipleSelection: true,
    });
    // console.log("assets: ", assets);

    if (assets) {
      // await MediaLibrary.saveToLibraryAsync(assets[0].uri);
      await handleUploadPhoto({ assets });
      onGetIam();
      setModalVisible(false);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="relative">
      <View className="flex items-center w-48 justify-center mx-auto">
        {
          <RImage
            image={userFromStore?.images ? userFromStore.images[0] : null}
            className="w-48 h-48 rounded-full"
          />
        }
        <View className="absolute bottom-0 right-0 bg-s-200 dark:bg-s-950 rounded-full">
          <UIButton type="link" onPress={() => setModalVisible(true)}>
            <View className="p-2">
              <SIcon path="iCamera" size={25} type="secondary" />
            </View>
          </UIButton>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={false}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View className="bg-s-200 dark:bg-s-950 opacity-90 flex-1 p-6">
          <View className="flex gap-4 bg-white dark:bg-s-800 rounded-lg p-4">
            <RTitle text={t("title.changeAva")} />
            <UIButton
              type="secondary"
              text={t("goPhoto")}
              icon="iCamera"
              onPress={goPhoto}
            />
            <UIButton
              type="secondary"
              text={t("pickImage")}
              icon="iImage"
              onPress={pickImage}
            />
            <UIButton
              type="link"
              text={t("button.cancel")}
              icon="iClose"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserSettingAvatar;
