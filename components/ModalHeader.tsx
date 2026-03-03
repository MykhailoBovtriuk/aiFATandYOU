import { ReactNode } from "react";
import { Text, View } from "react-native";
import { MealIcon } from "@/components/MealIcon";

interface ModalHeaderProps {
  title: string;
  mealType?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}

export function ModalHeader({ title, mealType, leftAction, rightAction }: ModalHeaderProps) {
  return (
    <View className="flex-row items-center p-4 border-b border-dark-border bg-dark-card">
      <View className="flex-1 items-start">{leftAction ?? null}</View>
      <View className="flex-row items-center gap-2">
        {mealType && <MealIcon mealType={mealType} size={28} />}
        <Text className="text-text-primary text-lg font-bold">{title}</Text>
      </View>
      <View className="flex-1 items-end">{rightAction ?? null}</View>
    </View>
  );
}
