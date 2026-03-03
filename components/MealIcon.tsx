import { MEAL_ICONS } from "@/constants/meals";

interface MealIconProps {
  mealType: string;
  size: number;
  style?: object;
}

export function MealIcon({ mealType, size, style }: MealIconProps) {
  const Icon = MEAL_ICONS[mealType];
  if (!Icon) return null;
  return <Icon width={size} height={size} style={style} />;
}
