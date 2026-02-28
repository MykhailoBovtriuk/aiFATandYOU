import { Text, View } from "react-native";
import { useIsWebDesktop } from "../hooks/useIsWebDesktop";
import { WeekCalendarStrip } from "./WeekCalendarStrip";

interface TodayCardProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  datesWithEntries: string[];
  caloriesPerDate: Record<string, number>;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

function MacroItem({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-text-muted text-xs mb-1">{label}</Text>
      <Text className="text-white text-base font-bold">
        {value % 1 === 0 ? value : value.toFixed(2)}
      </Text>
    </View>
  );
}

function VerticalDivider() {
  return <View className="w-px h-8 bg-dark-border" />;
}

export function TodayCard({
  selectedDate,
  onSelectDate,
  datesWithEntries,
  caloriesPerDate,
  calories,
  protein,
  carbs,
  fats,
}: TodayCardProps) {
  const hideMacros = useIsWebDesktop();

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const title = isToday
    ? "Today"
    : selectedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
      });

  return (
    <View
      className="bg-dark-card rounded-2xl p-4 mb-5"
      style={{ transform: [{ scale: 0.97 }] }}
    >
      <Text className="text-white text-2xl font-bold mb-4">{title}</Text>

      <WeekCalendarStrip
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        datesWithEntries={datesWithEntries}
        caloriesPerDate={caloriesPerDate}
      />

      {!hideMacros && (
        <>
          <View className="h-px bg-dark-border mb-3" />
          <View className="flex-row items-center">
            <MacroItem label="Fats" value={fats} />
            <VerticalDivider />
            <MacroItem label="Carbs" value={carbs} />
            <VerticalDivider />
            <MacroItem label="Protein" value={protein} />
            <VerticalDivider />
            <MacroItem label="Calories" value={calories} />
          </View>
        </>
      )}
    </View>
  );
}
