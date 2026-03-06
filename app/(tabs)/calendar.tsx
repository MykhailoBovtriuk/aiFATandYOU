import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarDayCell } from "@/components/CalendarDayCell";
import { MealList } from "@/components/MealList";
import { DesktopResponsiveRow } from "@/components/layout/DesktopResponsiveRow";
import { Colors } from "@/constants/colors";
import { useActiveMealPeriod } from "@/hooks/useActiveMealPeriod";
import { useAddMeal } from "@/hooks/useAddMeal";
import { useEditEntry } from "@/hooks/useEditEntry";
import { useExpandedMeals } from "@/hooks/useExpandedMeals";
import { useFoodStore } from "@/store/useFoodStore";
import { toLocalISODate } from "@/utils/dates";
import { groupEntriesByMeal } from "@/utils/food";

export default function CalendarScreen() {
  const { getEntriesForDate, deleteEntry, getCaloriesPerDate, calorieLimit } = useFoodStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { activeMealType, scaleFactors } = useActiveMealPeriod(selectedDate);
  const { expandedMeals, toggleMeal } = useExpandedMeals(activeMealType);

  const todayISO = toLocalISODate(new Date());
  const selectedISO = toLocalISODate(selectedDate);
  const caloriesPerDate = getCaloriesPerDate();
  const dateEntries = getEntriesForDate(selectedDate);
  const groupedEntries = groupEntriesByMeal(dateEntries);

  const handleEditEntry = useEditEntry("/calendar");
  const { onEmptyHeaderPress, onAddPress } = useAddMeal("/calendar", selectedDate);

  return (
    <DesktopResponsiveRow
      sidebar={
        <View className="px-5 pt-4" style={{ width: 300 }}>
          <ScrollView>
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
        </View>
      }
    >
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <ScrollView className="px-5 pt-4">
          <Calendar
            style={{ backgroundColor: Colors.darkBg }}
            theme={{
              backgroundColor: Colors.darkBg,
              calendarBackground: Colors.darkBg,
              textSectionTitleColor: Colors.textSecondary,
              arrowColor: Colors.textMuted,
              monthTextColor: Colors.textPrimary,
              textMonthFontWeight: "bold",
              textMonthFontSize: 16,
              textDayHeaderFontWeight: "600",
              textDayHeaderFontSize: 12,
            }}
            markedDates={{
              [selectedISO]: { selected: true, selectedColor: Colors.accentGreen },
            }}
            dayComponent={({ date, state, marking }) => (
              <CalendarDayCell
                date={date}
                state={state}
                isSelected={!!(marking as any)?.selected}
                todayISO={todayISO}
                caloriesPerDate={caloriesPerDate}
                calorieLimit={calorieLimit}
                onPress={setSelectedDate}
              />
            )}
            firstDay={1}
            onDayPress={(day) => setSelectedDate(new Date(day.dateString))}
          />
          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </DesktopResponsiveRow>
  );
}
