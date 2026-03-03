import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { analyzeImage } from "@/services/gemini";
import { useFoodStore } from "@/store/useFoodStore";
import type { FoodEntry } from "@/types/food";

export function useCameraScan() {
  const router = useRouter();
  const { setTempEntry } = useFoodStore();
  const [loading, setLoading] = useState(false);

  const scan = async (mealType?: string, date?: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
        return;
      }
      try {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.5,
        });
      } catch (e: any) {
        if (e?.message?.includes("Camera not available on simulator")) {
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

    if (!result.canceled) {
      setLoading(true);
      try {
        const uri = result.assets[0].uri;
        const data = await analyzeImage(uri);
        setTempEntry({
          ...data,
          mealType: (mealType as FoodEntry["mealType"]) || data.mealType || "Breakfast",
        });
        router.push({ pathname: "/review", params: { imageUri: uri, ...(date && { date }) } });
      } catch (error) {
        router.push({
          pathname: "/error" as any,
          params: {
            message: "Could not analyze food.",
            response: error instanceof Error ? error.message : String(error),
          },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return { scan, loading };
}
