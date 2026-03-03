import React from "react";
import BreakfastIcon from "@/assets/images/img/breakfast.svg";
import DinnerIcon from "@/assets/images/img/dinner.svg";
import LunchIcon from "@/assets/images/img/lunch.svg";
import { FoodEntry } from "@/types/food";

export const MEAL_ICONS: Record<string, React.FC<any>> = {
  Breakfast: BreakfastIcon,
  Lunch: LunchIcon,
  Dinner: DinnerIcon,
};

export const MEAL_ORDER = ["Breakfast", "Lunch", "Dinner"] as const;

export function createEmptyEntry(mealType: FoodEntry["mealType"]): Partial<FoodEntry> {
  return {
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    weight: 0,
    mealType,
  };
}
