import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MealSection } from "../../components/MealSection";
import { TodayCard } from "../../components/TodayCard";
import { WebSidebar } from "../../components/WebSidebar";
import { MEAL_ORDER, createEmptyEntry } from "../../constants/meals";
import { useActiveMealPeriod } from "../../hooks/useActiveMealPeriod";
import { useEditEntry } from "../../hooks/useEditEntry";
import { useExpandedMeals } from "../../hooks/useExpandedMeals";
import { useIsWebDesktop } from "../../hooks/useIsWebDesktop";
import { useFoodStore } from "../../store/useFoodStore";
import { FoodEntry } from "../../types/food";
import { groupEntriesByMeal } from "../../utils/food";

export default function Dashboard() {
  const router = useRouter();
  const {
    getEntriesForDate,
    getDatesWithEntries,
    deleteEntry,
    setTempEntry,
    getCaloriesPerDate,
    calorieLimit,
  } = useFoodStore();
  const { activeMealType, scaleFactors } = useActiveMealPeriod();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { expandedMeals, toggleMeal } = useExpandedMeals(activeMealType);

  const isWebDesktop = useIsWebDesktop();

  const caloriesPerDate = getCaloriesPerDate();

  const dateEntries = getEntriesForDate(selectedDate);
  const datesWithEntries = getDatesWithEntries();

  const groupedEntries = groupEntriesByMeal(dateEntries);

  const totals = dateEntries.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fats: acc.fats + item.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

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
        <View style={{ flex: 1 }}>
          <SafeAreaView className="flex-1" edges={["bottom"]}>
            <ScrollView className="px-5 pt-4">
              <TodayCard
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                datesWithEntries={datesWithEntries}
                caloriesPerDate={caloriesPerDate}
                {...totals}
              />

              {MEAL_ORDER.map((mealType) => {
                const mealEntries = groupedEntries[mealType] || [];
                const hasEntries = mealEntries.length > 0;

                return (
                  <MealSection
                    key={mealType}
                    mealType={mealType}
                    entries={mealEntries}
                    expanded={hasEntries && (expandedMeals[mealType] ?? true)}
                    scale={scaleFactors[mealType as keyof typeof scaleFactors]}
                    onHeaderPress={() => {
                      if (hasEntries) {
                        toggleMeal(mealType);
                      } else {
                        setTempEntry(
                          createEmptyEntry(mealType as FoodEntry["mealType"]),
                        );
                        router.push({ pathname: "/review" });
                      }
                    }}
                    onAddPress={() => {
                      setTempEntry(
                        createEmptyEntry(mealType as FoodEntry["mealType"]),
                      );
                      router.push({ pathname: "/review" });
                    }}
                    onDeleteEntry={deleteEntry}
                    onEditEntry={handleEditEntry}
                  />
                );
              })}

              <View className="h-6" />
            </ScrollView>
          </SafeAreaView>
        </View>
        {isWebDesktop && (
          <>
            <View className="px-5 pt-4" style={{ width: 300 }}>
              <WebSidebar
                calories={totals.calories}
                protein={totals.protein}
                carbs={totals.carbs}
                fats={totals.fats}
                calorieLimit={calorieLimit}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
