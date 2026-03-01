import { Colors } from "../constants/colors";
import type { FoodEntry } from "../types/food";

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
