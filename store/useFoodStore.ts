import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DayMeals, FoodEntry } from "@/types/food";
import { isoToLocalDate, toLocalISODate } from "@/utils/dates";

interface FoodStore {
  // State
  entries: Record<string, DayMeals>;
  tempEntry: Partial<FoodEntry> | null;
  calorieLimit: number;
  sidebarCollapsed: boolean;

  // Actions
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updated: Partial<FoodEntry>) => void;
  setTempEntry: (entry: Partial<FoodEntry> | null) => void;
  confirmTempEntry: (dateISO?: string) => void;
  setCalorieLimit: (limit: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Selectors
  getEntriesForDate: (date: Date) => FoodEntry[];
  getDatesWithEntries: () => string[];
  getCaloriesPerDate: () => Record<string, number>;
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set, get) => ({
      entries: {},
      tempEntry: null,
      calorieLimit: 2000,
      sidebarCollapsed: false,

      deleteEntry: (id) => {
        const { entries } = get();
        const updated = { ...entries };
        for (const date of Object.keys(updated)) {
          for (const meal of ["breakfast", "lunch", "dinner"] as (keyof DayMeals)[]) {
            if (updated[date][meal].some((e) => e.id === id)) {
              updated[date] = {
                ...updated[date],
                [meal]: updated[date][meal].filter((e) => e.id !== id),
              };
              set({ entries: updated });
              return;
            }
          }
        }
      },

      updateEntry: (id, updated) => {
        const { entries } = get();
        const newEntries = { ...entries };
        for (const date of Object.keys(newEntries)) {
          for (const meal of ["breakfast", "lunch", "dinner"] as (keyof DayMeals)[]) {
            const idx = newEntries[date][meal].findIndex((e) => e.id === id);
            if (idx !== -1) {
              const merged: FoodEntry = { ...newEntries[date][meal][idx], ...updated };
              const newMealKey = merged.mealType.toLowerCase() as keyof DayMeals;
              newEntries[date] = {
                ...newEntries[date],
                [meal]: newEntries[date][meal].filter((e) => e.id !== id),
              };
              newEntries[date] = {
                ...newEntries[date],
                [newMealKey]: [...newEntries[date][newMealKey], merged],
              };
              set({ entries: newEntries, tempEntry: null });
              return;
            }
          }
        }
      },

      setTempEntry: (entry) => set({ tempEntry: entry }),

      setCalorieLimit: (limit) => set({ calorieLimit: limit }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      confirmTempEntry: (dateISO?: string) => {
        const { tempEntry, entries } = get();
        if (tempEntry && tempEntry.name && tempEntry.calories !== undefined) {
          const newEntry: FoodEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            name: tempEntry.name,
            calories: tempEntry.calories || 0,
            protein: tempEntry.protein || 0,
            carbs: tempEntry.carbs || 0,
            fats: tempEntry.fats || 0,
            weight: tempEntry.weight || 0,
            mealType: tempEntry.mealType || "Breakfast",
          };

          const dateKey = dateISO ?? toLocalISODate(new Date());
          const mealKey = newEntry.mealType.toLowerCase() as keyof DayMeals;
          const existing = entries[dateKey] ?? { breakfast: [], lunch: [], dinner: [] };
          const updatedDay = { ...existing, [mealKey]: [...existing[mealKey], newEntry] };

          set({
            entries: { ...entries, [dateKey]: updatedDay },
            tempEntry: null,
          });
        }
      },

      getEntriesForDate: (date: Date) => {
        const { entries } = get();
        const key = toLocalISODate(date);
        const day = entries[key];
        return day ? [...day.breakfast, ...day.lunch, ...day.dinner] : [];
      },

      getDatesWithEntries: () => {
        const { entries } = get();
        return Object.keys(entries).map((k) => isoToLocalDate(k).toDateString());
      },

      getCaloriesPerDate: () => {
        const { entries } = get();
        return Object.fromEntries(
          Object.entries(entries).map(([k, meals]) => [
            isoToLocalDate(k).toDateString(),
            [...meals.breakfast, ...meals.lunch, ...meals.dinner].reduce(
              (sum, e) => sum + e.calories,
              0,
            ),
          ]),
        );
      },
    }),
    {
      name: "food-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
