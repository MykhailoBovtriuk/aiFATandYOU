import { useRouter } from "expo-router";
import { createEmptyEntry } from "@/constants/meals";
import { useFoodStore } from "@/store/useFoodStore";
import type { FoodEntry } from "@/types/food";
import { toLocalISODate } from "@/utils/dates";

export function useAddMeal(source: string, selectedDate: Date) {
  const router = useRouter();
  const { setTempEntry, setNavSource } = useFoodStore();

  const addMeal = (mealType: string) => {
    setTempEntry(createEmptyEntry(mealType as FoodEntry["mealType"]));
    setNavSource(source);
    router.push({
      pathname: "/review",
      params: { date: toLocalISODate(selectedDate) },
    });
  };

  return { onEmptyHeaderPress: addMeal, onAddPress: addMeal };
}
