export type Gender = "male" | "female";
export type ActivityLevel = "light" | "moderate" | "active";
export type Goal = "lose" | "maintain" | "gain";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  light: "Light",
  moderate: "Moderate",
  active: "Active",
};

export const GOAL_MULTIPLIERS: Record<Goal, number> = {
  lose: 0.8,
  maintain: 1.0,
  gain: 1.15,
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Lose Weight",
  maintain: "Maintain",
  gain: "Gain Weight",
};

// Mifflin-St Jeor formula
export function calculateBMR(
  gender: Gender,
  weight: number,
  height: number,
  age: number,
): number {
  return gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activity];
}

export function calculateDailyGoal(tdee: number, goal: Goal): number {
  return Math.round(tdee * GOAL_MULTIPLIERS[goal]);
}
