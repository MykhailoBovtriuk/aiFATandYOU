import { useEffect, useState } from "react";
import { getMealPeriodFromHour } from "@/utils/dates";

const MEAL_BOUNDARIES = {
  BREAKFAST_START: 4,
  BREAKFAST_END: 11,
  LUNCH_END: 17,
};

const SCALE_ACTIVE = 1.0;
const SCALE_INACTIVE = 0.97;

type MealType = "Breakfast" | "Lunch" | "Dinner";

function getMillisecondsUntilNextBoundary(currentHour: number, currentMinutes: number): number {
  const currentTotalMinutes = currentHour * 60 + currentMinutes;

  const boundaries = [
    MEAL_BOUNDARIES.BREAKFAST_START * 60,
    MEAL_BOUNDARIES.BREAKFAST_END * 60,
    MEAL_BOUNDARIES.LUNCH_END * 60,
    (24 + MEAL_BOUNDARIES.BREAKFAST_START) * 60,
  ];

  for (const boundary of boundaries) {
    if (currentTotalMinutes < boundary) {
      const minutesUntil = boundary - currentTotalMinutes;
      return minutesUntil * 60 * 1000;
    }
  }

  const minutesUntilMidnight = 24 * 60 - currentTotalMinutes;
  const minutesUntilNextBoundary = minutesUntilMidnight + MEAL_BOUNDARIES.BREAKFAST_START * 60;
  return minutesUntilNextBoundary * 60 * 1000;
}

interface ScaleFactors {
  [key: string]: number;
  Breakfast: number;
  Lunch: number;
  Dinner: number;
}

interface UseActiveMealPeriodReturn {
  activeMealType: MealType;
  scaleFactors: ScaleFactors;
}

export function useActiveMealPeriod(): UseActiveMealPeriodReturn {
  const [activeMealType, setActiveMealType] = useState<MealType>(() =>
    getMealPeriodFromHour(new Date().getHours()),
  );

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const msUntilNextBoundary = getMillisecondsUntilNextBoundary(currentHour, currentMinutes);

    const timer = setTimeout(() => {
      setActiveMealType(getMealPeriodFromHour(new Date().getHours()));
    }, msUntilNextBoundary);

    return () => clearTimeout(timer);
  }, [activeMealType]);

  const scaleFactors: ScaleFactors = {
    Breakfast: activeMealType === "Breakfast" ? SCALE_ACTIVE : SCALE_INACTIVE,
    Lunch: activeMealType === "Lunch" ? SCALE_ACTIVE : SCALE_INACTIVE,
    Dinner: activeMealType === "Dinner" ? SCALE_ACTIVE : SCALE_INACTIVE,
  };

  return {
    activeMealType,
    scaleFactors,
  };
}
