import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CalendarDayCell } from "@/components/CalendarDayCell";
import { MealList } from "@/components/MealList";
import { Colors } from "@/constants/colors";
import { createEmptyEntry } from "@/constants/meals";
import { useActiveMealPeriod } from "@/hooks/useActiveMealPeriod";
import { useEditEntry } from "@/hooks/useEditEntry";
import { useExpandedMeals } from "@/hooks/useExpandedMeals";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";
import { useFoodStore } from "@/store/useFoodStore";
import { FoodEntry } from "@/types/food";
import { toLocalISODate } from "@/utils/dates";
import { groupEntriesByMeal } from "@/utils/food";

export default function CalendarScreen() {
  const router = useRouter();
  const { getEntriesForDate, deleteEntry, setTempEntry, getCaloriesPerDate, calorieLimit } =
    useFoodStore();
  const { activeMealType, scaleFactors } = useActiveMealPeriod();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { expandedMeals, toggleMeal } = useExpandedMeals(activeMealType);

  const isWebDesktop = useIsWebDesktop();

  const todayISO = toLocalISODate(new Date());
  const selectedISO = toLocalISODate(selectedDate);
  const caloriesPerDate = getCaloriesPerDate();

  const dateEntries = getEntriesForDate(selectedDate);

  const groupedEntries = groupEntriesByMeal(dateEntries);

  const handleEditEntry = useEditEntry();

  return (
    <View className="flex-1 bg-dark-bg">
      <View
        style={{
          flex: 1,
          ...(isWebDesktop
            ? {
                flexDirection: "row",
                alignSelf: "center",
                width: "100%",
                maxWidth: 1024,
                gap: 24,
              }
            : {}),
        }}
      >
        {/* LEFT: Calendar */}
        <View style={{ flex: 1 }}>
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
        </View>

        {/* RIGHT: Meal sections sidebar (desktop only) */}
        {isWebDesktop && (
          <View className="px-5 pt-4" style={{ width: 300 }}>
            <ScrollView>
              <MealList
                groupedEntries={groupedEntries}
                expandedMeals={expandedMeals}
                toggleMeal={toggleMeal}
                onEmptyHeaderPress={(mealType) => {
                  setTempEntry(createEmptyEntry(mealType as FoodEntry["mealType"]));
                  router.push({ pathname: "/review" });
                }}
                onAddPress={(mealType) => {
                  setTempEntry(createEmptyEntry(mealType as FoodEntry["mealType"]));
                  router.push({ pathname: "/review" });
                }}
                onDeleteEntry={deleteEntry}
                onEditEntry={handleEditEntry}
                scaleFactors={scaleFactors as Record<string, number>}
              />
              <View className="h-6" />
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}
