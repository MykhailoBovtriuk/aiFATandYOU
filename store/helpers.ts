import type { DayMeals } from "@/types/food";

const MEAL_KEYS: (keyof DayMeals)[] = ["breakfast", "lunch", "dinner"];

interface EntryLocation {
  dateKey: string;
  mealKey: keyof DayMeals;
  index: number;
}

export function findEntryLocation(
  entries: Record<string, DayMeals>,
  id: string,
): EntryLocation | null {
  for (const dateKey of Object.keys(entries)) {
    for (const mealKey of MEAL_KEYS) {
      const index = entries[dateKey][mealKey].findIndex((e) => e.id === id);
      if (index !== -1) return { dateKey, mealKey, index };
    }
  }
  return null;
}
