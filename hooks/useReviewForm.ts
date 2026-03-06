import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { analyzeImage } from "@/services/gemini";
import { useFoodStore } from "@/store/useFoodStore";
import { ReviewFormSchema } from "@/types/food";
import type { FoodEntry } from "@/types/food";
import { navigateToError } from "@/utils/errors";
import { impact, notify } from "@/utils/haptics";
import { pickImage } from "@/utils/imagePicker";

type FieldKey = "name" | "calories" | "weight" | "protein" | "carbs" | "fats";
export type RawValues = Record<Exclude<FieldKey, "name">, string>;
export type FieldErrors = Partial<Record<FieldKey, string>>;

function entryToRawValues(entry: Partial<FoodEntry>): RawValues {
  return {
    calories: entry.calories?.toString() ?? "0",
    weight: entry.weight?.toString() ?? "0",
    protein: entry.protein?.toString() ?? "0",
    carbs: entry.carbs?.toString() ?? "0",
    fats: entry.fats?.toString() ?? "0",
  };
}

export function useReviewForm() {
  const router = useRouter();
  const {
    imageUri: imageUriParam,
    entryId,
    date,
    via,
  } = useLocalSearchParams<{
    imageUri?: string;
    entryId?: string;
    date?: string;
    via?: string;
  }>();

  const { tempEntry, setTempEntry, confirmTempEntry, updateEntry, deleteEntry } = useFoodStore();
  const isEditMode = !!entryId;
  const hasSaved = useRef(false);

  const [localImageUri, setLocalImageUri] = useState<string | undefined>(imageUriParam);
  const [scanning, setScanning] = useState(false);
  const [rawValues, setRawValues] = useState<RawValues>(() => entryToRawValues(tempEntry ?? {}));
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!tempEntry && !hasSaved.current) {
      router.replace("/");
    }
  }, [tempEntry]);

  const handleScan = async () => {
    impact();
    const uri = await pickImage();
    if (!uri) return;

    setScanning(true);
    try {
      const data = await analyzeImage(uri);
      setTempEntry({
        ...data,
        mealType: tempEntry?.mealType || data.mealType || "Breakfast",
      });
      setRawValues(entryToRawValues(data));
      setLocalImageUri(uri);
    } catch (error) {
      navigateToError(router, "Could not analyze food.", error);
    } finally {
      setScanning(false);
    }
  };

  const validate = () => {
    const result = ReviewFormSchema.safeParse({
      name: tempEntry?.name ?? "",
      calories: rawValues.calories,
      weight: rawValues.weight,
      protein: rawValues.protein,
      carbs: rawValues.carbs,
      fats: rawValues.fats,
    });

    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors({
        name: fe.name?.[0],
        calories: fe.calories?.[0],
        weight: fe.weight?.[0],
        protein: fe.protein?.[0],
        carbs: fe.carbs?.[0],
        fats: fe.fats?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    notify();
    hasSaved.current = true;

    if (isEditMode) {
      updateEntry(entryId!, tempEntry!);
      router.back();
    } else {
      confirmTempEntry(date);
      via === "meal-detail" ? router.dismiss(2) : router.back();
    }
  };

  const handleDelete = () => {
    notify();
    deleteEntry(entryId!);
    router.replace("/");
  };

  const updateField = (field: FieldKey, text: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "name") {
      setTempEntry({ ...tempEntry, name: text });
    } else {
      setRawValues((prev) => ({ ...prev, [field]: text }));
      setTempEntry({ ...tempEntry, [field]: Number(text) || 0 });
    }
  };

  const updateMacro = (field: "protein" | "carbs" | "fats", value: number, text: string) => {
    setRawValues((prev) => ({ ...prev, [field]: text }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setTempEntry({ ...tempEntry, [field]: value });
  };

  return {
    tempEntry,
    isEditMode,
    localImageUri,
    scanning,
    rawValues,
    errors,
    handleScan,
    handleSave,
    handleDelete,
    updateField,
    updateMacro,
  };
}
