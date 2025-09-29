import { View, Text } from "react-native";
import React from "react";

import * as Application from "expo-application";

const AppInfo = () => {
  //   const downloadFile = async (url: string, filename: string) => {
  //     try {
  //       const fileUri = FileSystem.cacheDirectory + filename; // Define local path
  //       const { uri } = await FileSystem.downloadAsync(url, fileUri);
  //       console.log("Finished downloading to:", uri);
  //       return uri; // Return the local URI of the downloaded file
  //     } catch (error) {
  //       console.error("Download error:", error);
  //       return null;
  //     }
  //   };

  //   // Example usage
  //   const [loading, setLoading] = useState(false);
  //   const fileUrl = "https://kingwood-apps.ru/images/app/kw.apk";
  //   const localFileName = "kingwood_app_1.0.11.apk";

  //   // In a component or event handler:
  //   const handleDownload = async () => {
  //     try {
  //       setLoading(true);
  //       const downloadedUri = await downloadFile(fileUrl, localFileName);
  //       if (downloadedUri) {
  //         //   const fileInfo = await FileSystem.getInfoAsync(downloadedUri, {
  //         //     size: false,
  //         //     md5: false,
  //         //   });
  //         // fileInfo.mimeType will contain the MIME type
  //         await saveToDownloadsAndroid(
  //           downloadedUri,
  //           localFileName,
  //           "application/vnd.android.package-archive"
  //         );
  //         // File downloaded successfully, you can now use downloadedUri
  //         // e.g., to open the file, display it, or share it.
  //       }
  //     } catch (e) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const saveToDownloadsAndroid = async (localUri, filename, mimeType) => {
  //     try {
  //       const permissions =
  //         await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  //       if (!permissions.granted) {
  //         Alert.alert(
  //           "Permission Denied",
  //           "Cannot save file without storage access."
  //         );
  //         return;
  //       }

  //       const directoryUri = permissions.directoryUri;
  //       console.log(
  //         "Permission dir: ",
  //         directoryUri,
  //         ", full=",
  //         `${directoryUri}/${filename}`
  //       );

  //       await FileSystem.copyAsync({
  //         from: localUri,
  //         to: `${directoryUri}/${filename}`,
  //       });
  //       //   const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
  //       //     directoryUri,
  //       //     filename,
  //       //     mimeType
  //       //   );

  //       //   // Read the content from the temporary localUri and write to the new fileUri
  //       //   const fileContent = await FileSystem.readAsStringAsync(localUri, {
  //       //     encoding: FileSystem.EncodingType.Base64,
  //       //   });
  //       //   await FileSystem.writeAsStringAsync(fileUri, fileContent, {
  //       //     encoding: FileSystem.EncodingType.Base64,
  //       //   });

  //       Alert.alert("Success", "File saved to downloads!");
  //     } catch (error) {
  //       console.error("Error saving to downloads:", error);
  //       Alert.alert("Error", "Failed to save file.");
  //     }
  //   };

  return (
    <View className="p-6">
      <Text className="text-s-700 dark:text-s-500">
        {Application.applicationName} ver.[
        {Application.nativeApplicationVersion}/{Application.nativeBuildVersion}]
      </Text>

      {/* <UIButton
        type="link"
        text="download"
        loading={loading}
        onPress={() => {
          handleDownload();
        }}
      /> */}
    </View>
  );
};

export default AppInfo;
