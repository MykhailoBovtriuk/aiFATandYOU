import { Colors } from "@/constants/colors";
import type { FoodEntry } from "@/types/food";

export function groupEntriesByMeal(entries: FoodEntry[]): Record<string, FoodEntry[]> {
  return entries.reduce(
    (acc, entry) => {
      if (!acc[entry.mealType]) acc[entry.mealType] = [];
      acc[entry.mealType].push(entry);
      return acc;
    },
    {} as Record<string, FoodEntry[]>,
  );
}

export function sumMacros(entries: FoodEntry[]) {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fats: acc.fats + e.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );
}

export function getDayBorderColor(
  isPast: boolean,
  isToday: boolean,
  hasData: boolean,
  isOverLimit: boolean,
  defaultColor: string = Colors.darkBorder,
): string {
  if (isPast) return !hasData || isOverLimit ? Colors.error : Colors.accentGreen;
  if (isToday) return hasData && isOverLimit ? Colors.error : Colors.accentGreen;
  return defaultColor;
}
