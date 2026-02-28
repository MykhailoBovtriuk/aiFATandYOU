import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MealSection } from '../../components/MealSection';
import { Colors } from '../../constants/colors';
import { MEAL_ORDER, createEmptyEntry } from '../../constants/meals';
import { useActiveMealPeriod } from '../../hooks/useActiveMealPeriod';
import { useEditEntry } from '../../hooks/useEditEntry';
import { useExpandedMeals } from '../../hooks/useExpandedMeals';
import { useIsWebDesktop } from '../../hooks/useIsWebDesktop';
import { useFoodStore } from '../../store/useFoodStore';
import { FoodEntry } from '../../types/food';
import { toLocalISODate } from '../../utils/dates';
import { getDayBorderColor, groupEntriesByMeal } from '../../utils/food';

export default function CalendarScreen() {
  const router = useRouter();
  const {
    getEntriesForDate,
    deleteEntry,
    setTempEntry,
    getCaloriesPerDate,
    calorieLimit,
  } = useFoodStore();
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
                flexDirection: 'row',
                alignSelf: 'center',
                width: '100%',
                maxWidth: 1024,
                gap: 24,
              }
            : {}),
        }}
      >
        {/* LEFT: Calendar */}
        <View style={{ flex: 1 }}>
          <SafeAreaView className="flex-1" edges={['bottom']}>
            <ScrollView className="px-5 pt-4">
              <Calendar
                style={{ backgroundColor: Colors.darkBg }}
                theme={{
                  backgroundColor: Colors.darkBg,
                  calendarBackground: Colors.darkBg,
                  textSectionTitleColor: Colors.textSecondary,
                  arrowColor: Colors.textMuted,
                  monthTextColor: Colors.textPrimary,
                  textMonthFontWeight: 'bold',
                  textMonthFontSize: 16,
                  textDayHeaderFontWeight: '600',
                  textDayHeaderFontSize: 12,
                }}
                markedDates={{
                  [selectedISO]: { selected: true, selectedColor: Colors.accentGreen },
                }}
                dayComponent={({ date, state, marking }) => {
                  if (!date) return null;

                  const isOtherMonth = state === 'disabled';
                  const isToday = date.dateString === todayISO;
                  const isPast = date.dateString < todayISO;
                  const isSelected = !!(marking as any)?.selected;

                  const calories = caloriesPerDate[date.dateString] ?? 0;
                  const hasData = date.dateString in caloriesPerDate;
                  const isOverLimit = calories > calorieLimit;

                  const borderColor = getDayBorderColor(isPast && !isOtherMonth, isToday && !isOtherMonth, hasData, isOverLimit);
                  const borderWidth = 1;

                  return (
                    <TouchableOpacity
                      onPress={() => !isOtherMonth && setSelectedDate(new Date(date.dateString))}
                      activeOpacity={0.7}
                      style={{ alignItems: 'center', paddingVertical: 6 }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: isOtherMonth ? 0 : borderWidth,
                          borderColor: isOtherMonth ? 'transparent' : borderColor,
                          backgroundColor: isSelected ? Colors.accentGreen : 'transparent',
                        }}
                      >
                        <Text
                          style={{
                            color: isOtherMonth
                              ? Colors.placeholder
                              : isSelected
                                ? Colors.darkBg
                                : Colors.textPrimary,
                            fontSize: 14,
                            fontWeight: '500',
                          }}
                        >
                          {date.day}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: isToday ? Colors.textPrimary : 'transparent',
                          marginTop: 3,
                        }}
                      />
                    </TouchableOpacity>
                  );
                }}
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
                        setTempEntry(createEmptyEntry(mealType as FoodEntry['mealType']));
                        router.push({ pathname: '/review' });
                      }
                    }}
                    onAddPress={() => {
                      setTempEntry(createEmptyEntry(mealType as FoodEntry['mealType']));
                      router.push({ pathname: '/review' });
                    }}
                    onDeleteEntry={deleteEntry}
                    onEditEntry={handleEditEntry}
                  />
                );
              })}
              <View className="h-6" />
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}
