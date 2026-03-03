import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import { getDayBorderColor } from "@/utils/food";

interface CalendarDayCellProps {
  date?: { dateString: string; day: number };
  state?: string;
  isSelected: boolean;
  todayISO: string;
  caloriesPerDate: Record<string, number>;
  calorieLimit: number;
  onPress: (date: Date) => void;
}

export function CalendarDayCell({
  date,
  state,
  isSelected,
  todayISO,
  caloriesPerDate,
  calorieLimit,
  onPress,
}: CalendarDayCellProps) {
  if (!date) return null;

  const isOtherMonth = state === "disabled";
  const isToday = date.dateString === todayISO;
  const isPast = date.dateString < todayISO;
  const calories = caloriesPerDate[date.dateString] ?? 0;
  const hasData = date.dateString in caloriesPerDate;
  const isOverLimit = calories > calorieLimit;
  const borderColor = getDayBorderColor(
    isPast && !isOtherMonth,
    isToday && !isOtherMonth,
    hasData,
    isOverLimit,
  );

  return (
    <TouchableOpacity
      onPress={() => !isOtherMonth && onPress(new Date(date.dateString))}
      activeOpacity={0.7}
      style={{ alignItems: "center", paddingVertical: 6 }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: isOtherMonth ? 0 : 1,
          borderColor: isOtherMonth ? "transparent" : borderColor,
          backgroundColor: isSelected ? Colors.accentGreen : "transparent",
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
            fontWeight: "500",
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
          backgroundColor: isToday ? Colors.textPrimary : "transparent",
          marginTop: 3,
        }}
      />
    </TouchableOpacity>
  );
}
