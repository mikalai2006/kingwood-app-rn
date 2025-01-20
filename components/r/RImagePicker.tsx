// import {Platform, PermissionsAndroid, Text} from 'react-native';
// import React, {useCallback, useState} from 'react';

// import * as ImagePicker from 'react-native-image-picker';
// import UIButton from '@/components/ui/UIButton';
// const includeExtra = true;

// export interface IImagePickerAction {
//     title?: string;
//     type: 'capture' | 'library';
//     options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
// }

// // export interface IAsset {
// //     timestamp?: Date;
// //     originalPath: string;
// //     type: string;
// //     height: number;
// //     width: number;
// //     id: string;
// //     fileName: string;
// //     fileSize: string;
// //     uri: string;
// // }

// export interface IRImagePickerProps {
//     action: IImagePickerAction;
//     children?: React.ReactNode;
//     classString?: string;
//     onResponse: (value: ImagePicker.ImagePickerResponse) => void;
//     onPress?: () => void;
// }

// const RImagePicker = (props: IRImagePickerProps) => {
//     const [response, setResponse] = useState<ImagePicker.ImagePickerResponse | null>(null);
//     const {onResponse, children, onPress} = props;

//     const callback = useCallback(
//         (res: ImagePicker.ImagePickerResponse) => {
//             setResponse(res);
//             if (onResponse && res) {
//                 onResponse(res);
//             }
//         },
//         [onResponse],
//     );

//     const onButtonPress = useCallback(async (params: IImagePickerAction) => {
//         try {
//             onPress && onPress();
//             const {type, options} = params;
//             if (type === 'capture') {
//                 const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
//                     title: 'Camera Permission',
//                     message: 'Camera Permission ' + ' are needed to help you',
//                     buttonNeutral: 'Ask Me Later',
//                     buttonNegative: 'Cancel',
//                     buttonPositive: 'OK',
//                 });
//                 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                     //console.log('You can use camera');
//                     ImagePicker.launchCamera(options, callback);
//                 } else {
//                     //console.log('Camera permission denied');
//                 }
//             } else {
//                 ImagePicker.launchImageLibrary(options, callback);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }, []);

//     return (
//         <UIButton
//             type="default"
//             twClass={`w-full flex flex-row items-center ${props.classString}`}
//             onPress={() => onButtonPress(props.action)}>
//             {children ? (
//                 children
//             ) : (
//                 <Text tw="text-base text-black dark:text-white">{props.action.title || 'Upload'}</Text>
//             )}
//         </UIButton>
//         // <TouchableOpacity
//         //     onPress={() => onButtonPress(props.action)}
//         //     activeOpacity={0.8}
//         //     tw={`flex flex-row items-center justify-between p-4 rounded-lg bg-white dark:bg-s-700 border border-s-200 dark:border-s-700 ${props.classString}`}>
//         //     {children ? children : <Text tw="text-black dark:text-white">{props.action.title || 'Upload'}</Text>}
//         // </TouchableOpacity>
//         // <ScrollView>
//         //     <View style={styles.buttonContainer}>
//         //         <Button
//         //             title={props.action.title}
//         //             key={props.action.title}
//         //             onPress={() => onButtonPress(props.action.type, props.action.options)}>
//         //             <Text>{props.action.title}</Text>
//         //         </Button>
//         //     </View>
//         //     <Text>{JSON.stringify(response, null, 2)}</Text>

//         //     {response?.assets &&
//         //         response?.assets.map(({uri}: {uri: string}) => (
//         //             <View key={uri} style={styles.imageContainer}>
//         //                 <Image resizeMode="cover" resizeMethod="scale" style={styles.image} source={{uri: uri}} />
//         //             </View>
//         //         ))}
//         // </ScrollView>
//     );
// };

// export default RImagePicker;

// const actions: IImagePickerAction[] = [
//     {
//         title: 'Take Image',
//         type: 'capture',
//         options: {
//             saveToPhotos: true,
//             mediaType: 'photo',
//             includeBase64: false,
//             includeExtra,
//         },
//     },
//     {
//         title: 'Select Image',
//         type: 'library',
//         options: {
//             selectionLimit: 0,
//             mediaType: 'photo',
//             includeBase64: false,
//             includeExtra,
//         },
//     },
//     {
//         title: 'Take Video',
//         type: 'capture',
//         options: {
//             saveToPhotos: true,
//             formatAsMp4: true,
//             mediaType: 'video',
//             includeExtra,
//         },
//     },
//     {
//         title: 'Select Video',
//         type: 'library',
//         options: {
//             selectionLimit: 0,
//             mediaType: 'video',
//             formatAsMp4: true,
//             includeExtra,
//         },
//     },
//     {
//         title: 'Select Image or Video\n(mixed)',
//         type: 'library',
//         options: {
//             selectionLimit: 0,
//             mediaType: 'mixed',
//             includeExtra,
//         },
//     },
// ];

// if (Platform.OS === 'ios') {
//     actions.push({
//         title: 'Take Image or Video\n(mixed)',
//         type: 'capture',
//         options: {
//             saveToPhotos: true,
//             mediaType: 'mixed',
//             includeExtra,
//             presentationStyle: 'fullScreen',
//         },
//     });
// }
