import { Text, TouchableOpacity, View } from "react-native";
import { impact, notify } from "@/utils/haptics";
import { FoodEntry } from "@/types/food";

interface FoodItemProps {
  item: FoodEntry;
  onDelete: (id: string) => void;
  onPress: (item: FoodEntry) => void;
}

export function FoodItemRow({ item, onDelete, onPress }: FoodItemProps) {
  const totalMacros = item.protein + item.carbs + item.fats;
  const proteinPct = totalMacros > 0 ? Math.round((item.protein / totalMacros) * 100) : 0;
  const carbsPct = totalMacros > 0 ? Math.round((item.carbs / totalMacros) * 100) : 0;
  const fatsPct = totalMacros > 0 ? Math.round((item.fats / totalMacros) * 100) : 0;

  return (
    <TouchableOpacity
      onPress={() => {
        impact();
        onPress(item);
      }}
      onLongPress={() => {
        notify();
        onDelete(item.id);
      }}
      className="bg-dark-surface p-3.5 rounded-xl mb-2"
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-text-primary font-semibold text-base">{item.name}</Text>
          <Text className="text-text-muted text-sm mt-0.5">{item.weight}g</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-text-primary font-bold text-base mr-1.5">
            {Math.round(item.calories)}
          </Text>
          <Text className="text-text-muted text-xs">kcal</Text>
        </View>
      </View>

      <View className="flex-row">
        <Text className="text-text-muted text-xs">
          P: {Math.round(item.protein)}g ({proteinPct}%)
        </Text>
        <Text className="text-text-muted text-xs ml-3">
          C: {Math.round(item.carbs)}g ({carbsPct}%)
        </Text>
        <Text className="text-text-muted text-xs ml-3">
          F: {Math.round(item.fats)}g ({fatsPct}%)
        </Text>
      </View>
    </TouchableOpacity>
  );
}
