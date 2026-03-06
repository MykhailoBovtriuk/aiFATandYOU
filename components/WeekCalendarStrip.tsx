import { View } from "react-native";
import { DayItem } from "./DayItem";
import { impact } from "@/utils/haptics";

interface WeekCalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  datesWithEntries: string[];
  caloriesPerDate: Record<string, number>;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(referenceDate: Date): Date[] {
  const day = referenceDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function WeekCalendarStrip({
  selectedDate,
  onSelectDate,
  datesWithEntries,
  caloriesPerDate,
}: WeekCalendarStripProps) {
  const weekDates = getWeekDates(selectedDate);
  const selectedStr = selectedDate.toDateString();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <View className="flex-row justify-between mb-4">
      {weekDates.map((date, index) => {
        const dateStr = date.toDateString();
        const isSelected = dateStr === selectedStr;
        const isToday = dateStr === today.toDateString();
        const isPast = date < today && !isToday;
        const hasData = datesWithEntries.includes(dateStr);
        const calories = caloriesPerDate[dateStr] ?? 0;

        return (
          <DayItem
            key={index}
            label={DAY_LABELS[index]}
            dateNumber={date.getDate()}
            isSelected={isSelected}
            isToday={isToday}
            isPast={isPast}
            hasData={hasData}
            calories={calories}
            onPress={() => {
              impact();
              onSelectDate(date);
            }}
          />
        );
      })}
    </View>
  );
}
