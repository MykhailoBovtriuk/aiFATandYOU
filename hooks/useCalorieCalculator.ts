import { useState } from "react";
import { useRouter } from "expo-router";
import { useFoodStore } from "@/store/useFoodStore";
import {
  type ActivityLevel,
  type Gender,
  type Goal,
  calculateBMR,
  calculateDailyGoal,
  calculateTDEE,
} from "@/utils/nutrition";

export function useCalorieCalculator() {
  const router = useRouter();
  const { setCalorieLimit } = useFoodStore();

  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<number | null>(null);
  const [resultText, setResultText] = useState("");
  const [errors, setErrors] = useState<{ age?: string; weight?: string; height?: string }>({});

  function validate(): boolean {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const next: typeof errors = {};
    if (!age.trim() || !Number.isFinite(a) || a <= 0) next.age = "Enter a valid age";
    if (!weight.trim() || !Number.isFinite(w) || w <= 0) next.weight = "Enter a valid weight";
    if (!height.trim() || !Number.isFinite(h) || h <= 0) next.height = "Enter a valid height";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function calculate() {
    if (!validate()) return;
    const bmr = calculateBMR(gender, parseFloat(weight), parseFloat(height), parseFloat(age));
    const tdee = calculateTDEE(bmr, activity);
    const calculated = calculateDailyGoal(tdee, goal);
    setResult(calculated);
    setResultText(String(calculated));
  }

  function handleSave() {
    const value = parseInt(resultText, 10);
    if (!value || value <= 0) return;
    setCalorieLimit(value);
    router.replace("/(tabs)");
  }

  function resetResult() {
    if (result === null) return;
    setResult(null);
    setResultText("");
  }

  return {
    gender,
    setGender,
    age,
    setAge,
    weight,
    setWeight,
    height,
    setHeight,
    activity,
    setActivity,
    goal,
    setGoal,
    result,
    resultText,
    setResultText,
    errors,
    setErrors,
    calculate,
    handleSave,
    resetResult,
  };
}
