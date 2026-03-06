import { MealList } from "@/components/MealList";
import { TodayCard } from "@/components/TodayCard";
import { WebSidebar } from "@/components/WebSidebar";
import { DesktopResponsiveRow } from "@/components/layout/DesktopResponsiveRow";
import { useActiveMealPeriod } from "@/hooks/useActiveMealPeriod";
import { useAddMeal } from "@/hooks/useAddMeal";
import { useEditEntry } from "@/hooks/useEditEntry";
import { useExpandedMeals } from "@/hooks/useExpandedMeals";
import { useFoodStore } from "@/store/useFoodStore";
import { groupEntriesByMeal, sumMacros } from "@/utils/food";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const { getEntriesForDate, getDatesWithEntries, deleteEntry, getCaloriesPerDate, calorieLimit } =
    useFoodStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { activeMealType, scaleFactors } = useActiveMealPeriod(selectedDate);
  const { expandedMeals, toggleMeal } = useExpandedMeals(activeMealType);
  const dateEntries = getEntriesForDate(selectedDate);
  const totals = sumMacros(dateEntries);
  const groupedEntries = groupEntriesByMeal(dateEntries);

  const handleEditEntry = useEditEntry("/");
  const { onEmptyHeaderPress, onAddPress } = useAddMeal("/", selectedDate);

  return (
    <DesktopResponsiveRow
      sidebar={
        <View className="px-5 pt-4" style={{ width: 300 }}>
          <WebSidebar {...totals} calorieLimit={calorieLimit} />
        </View>
      }
    >
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <ScrollView className="px-5 pt-4">
          <TodayCard
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            datesWithEntries={getDatesWithEntries()}
            caloriesPerDate={getCaloriesPerDate()}
            {...totals}
          />

          <MealList
            groupedEntries={groupedEntries}
            expandedMeals={expandedMeals}
            toggleMeal={toggleMeal}
            onEmptyHeaderPress={onEmptyHeaderPress}
            onAddPress={onAddPress}
            onDeleteEntry={deleteEntry}
            onEditEntry={handleEditEntry}
            scaleFactors={scaleFactors as Record<string, number>}
          />

          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </DesktopResponsiveRow>
  );
}
