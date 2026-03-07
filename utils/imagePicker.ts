import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";
import { readAsStringAsync, EncodingType } from "expo-file-system/legacy";

export async function pickImage(): Promise<string | null> {
  let result: ImagePicker.ImagePickerResult;

  if (Platform.OS === "web") {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
    });
  } else {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission", "Camera access is needed.");
      return null;
    }
    try {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("Camera not available on simulator")) {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.5,
        });
      } else {
        throw e;
      }
    }
  }

  return result.canceled ? null : result.assets[0].uri;
}

export async function imageToBase64(uri: string): Promise<string> {
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  return readAsStringAsync(uri, { encoding: EncodingType.Base64 });
}
