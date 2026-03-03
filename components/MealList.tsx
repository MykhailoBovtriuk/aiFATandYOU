import { MealSection } from "@/components/MealSection";
import { MEAL_ORDER } from "@/constants/meals";
import type { FoodEntry } from "@/types/food";

interface MealListProps {
  groupedEntries: Record<string, FoodEntry[]>;
  expandedMeals: Record<string, boolean>;
  toggleMeal: (mealType: string) => void;
  onEmptyHeaderPress: (mealType: string) => void;
  onAddPress: (mealType: string) => void;
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: FoodEntry) => void;
  scaleFactors?: Record<string, number>;
}

export function MealList({
  groupedEntries,
  expandedMeals,
  toggleMeal,
  onEmptyHeaderPress,
  onAddPress,
  onDeleteEntry,
  onEditEntry,
  scaleFactors,
}: MealListProps) {
  return (
    <>
      {MEAL_ORDER.map((mealType) => {
        const mealEntries = groupedEntries[mealType] || [];
        const hasEntries = mealEntries.length > 0;
        return (
          <MealSection
            key={mealType}
            mealType={mealType}
            entries={mealEntries}
            expanded={hasEntries && (expandedMeals[mealType] ?? true)}
            scale={scaleFactors?.[mealType]}
            onHeaderPress={() => {
              if (hasEntries) toggleMeal(mealType);
              else onEmptyHeaderPress(mealType);
            }}
            onAddPress={() => onAddPress(mealType)}
            onDeleteEntry={onDeleteEntry}
            onEditEntry={onEditEntry}
          />
        );
      })}
    </>
  );
}
