import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExpandedMeals } from "@/hooks/useExpandedMeals";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MealList } from "@/components/MealList";
import { Colors } from "@/constants/colors";
import { useEditEntry } from "@/hooks/useEditEntry";
import { useFoodStore } from "@/store/useFoodStore";
import { formatDate } from "@/utils/dates";
import { groupEntriesByMeal } from "@/utils/food";

export default function DayViewScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getEntriesForDate, deleteEntry } = useFoodStore();

  const dateEntries = date ? getEntriesForDate(new Date(date.replace(/-/g, "/"))) : [];

  const groupedEntries = groupEntriesByMeal(dateEntries);

  const { expandedMeals, toggleMeal } = useExpandedMeals();

  const handleEditEntry = useEditEntry();

  return (
    <View className="flex-1 bg-dark-bg">
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text className="text-text-primary text-lg font-bold flex-1">
            {date ? formatDate(date) : ""}
          </Text>
        </View>

        <ScrollView className="px-5 pt-2">
          <MealList
            groupedEntries={groupedEntries}
            expandedMeals={expandedMeals}
            toggleMeal={toggleMeal}
            onEmptyHeaderPress={(mealType) =>
              router.push({ pathname: "/meal-detail", params: { mealType, date } })
            }
            onAddPress={(mealType) =>
              router.push({ pathname: "/meal-detail", params: { mealType, date } })
            }
            onDeleteEntry={deleteEntry}
            onEditEntry={handleEditEntry}
          />

          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
