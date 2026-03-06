import { useState } from "react";
import { useRouter } from "expo-router";
import { analyzeImage } from "@/services/gemini";
import { useFoodStore } from "@/store/useFoodStore";
import type { FoodEntry } from "@/types/food";
import { navigateToError } from "@/utils/errors";
import { impact } from "@/utils/haptics";
import { pickImage } from "@/utils/imagePicker";

export function useCameraScan() {
  const router = useRouter();
  const { setTempEntry } = useFoodStore();
  const [loading, setLoading] = useState(false);

  const scan = async (mealType?: string, date?: string) => {
    impact();
    const uri = await pickImage();
    if (!uri) return;

    setLoading(true);
    try {
      const data = await analyzeImage(uri);
      setTempEntry({
        ...data,
        mealType: (mealType as FoodEntry["mealType"]) || data.mealType || "Breakfast",
      });
      router.push({ pathname: "/review", params: { imageUri: uri, ...(date && { date }) } });
    } catch (error) {
      navigateToError(router, "Could not analyze food.", error);
    } finally {
      setLoading(false);
    }
  };

  return { scan, loading };
}
