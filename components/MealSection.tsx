import * as Haptics from "expo-haptics";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";
import { FoodEntry } from "../types/food";
import { FoodItemRow } from "./FoodItemRow";
import { MealIcon } from "./MealIcon";

interface MealSectionProps {
  mealType: string;
  entries: FoodEntry[];
  onAddPress: () => void;
  onHeaderPress: () => void;
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: FoodEntry) => void;
  expanded: boolean;
  scale?: number;
}

export function MealSection({
  mealType,
  entries,
  onAddPress,
  onHeaderPress,
  onDeleteEntry,
  onEditEntry,
  expanded,
  scale = 1,
}: MealSectionProps) {
  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0);
  const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0);
  const totalFats = entries.reduce((sum, e) => sum + e.fats, 0);

  return (
    <View
      className="bg-dark-card rounded-2xl mb-3 border border-dark-border overflow-hidden"
      style={{ transform: [{ scale }] }}
    >
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS !== "web")
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onHeaderPress();
        }}
        className="flex-row items-center justify-between p-4"
      >
        <View className="flex-row items-center flex-1">
          <MealIcon mealType={mealType} size={36} style={{ marginRight: 8 }} />
          <Text className="text-text-secondary font-bold text-base">
            {mealType}
          </Text>
          {entries.length > 0 && (
            <Text className="text-text-secondary text-sm ml-2">
              {Math.round(totalCalories)} kcal
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            if (Platform.OS !== "web")
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onAddPress();
          }}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ borderWidth: 1, borderColor: Colors.textMuted }}
        >
          <Text className="text-white text-lg font-light leading-none">+</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && entries.length > 0 && (
        <View className="px-4 pb-4">
          <View className="flex-row justify-between bg-dark-surface rounded-xl p-3 mb-3">
            <Text className="text-text-muted text-xs">
              P: {Math.round(totalProtein)}g
            </Text>
            <Text className="text-text-muted text-xs">
              C: {Math.round(totalCarbs)}g
            </Text>
            <Text className="text-text-muted text-xs">
              F: {Math.round(totalFats)}g
            </Text>
            <Text className="text-text-muted text-xs">
              {Math.round(totalCalories)} kcal
            </Text>
          </View>

          {entries.map((entry) => (
            <FoodItemRow
              key={entry.id}
              item={entry}
              onDelete={onDeleteEntry}
              onPress={onEditEntry}
            />
          ))}
        </View>
      )}
    </View>
  );
}
