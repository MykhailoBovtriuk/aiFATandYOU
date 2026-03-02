import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DesktopPageCard } from "@/components/DesktopPageCard";
import { AppButton } from "@/components/ui/AppButton";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";
import { FormField } from "@/components/ui/FormField";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Colors } from "@/constants/colors";
import { useFoodStore } from "@/store/useFoodStore";
import {
  type ActivityLevel,
  ACTIVITY_LABELS,
  type Gender,
  type Goal,
  GOAL_LABELS,
  calculateBMR,
  calculateDailyGoal,
  calculateTDEE,
} from "@/utils/nutrition";

export default function CalorieCalculatorScreen() {
  const router = useRouter();
  const { setCalorieLimit } = useFoodStore();
  const isWebDesktop = useIsWebDesktop();

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
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const bmr = calculateBMR(gender, w, h, a);
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

  const formContent = (
    <>
      <SectionLabel>Gender</SectionLabel>
      <SegmentedControl
        options={["male", "female"] as Gender[]}
        value={gender}
        onChange={setGender}
        labels={{ male: "Male", female: "Female" }}
      />

      <View className="flex-row gap-2">
        {[
          { label: "Age", key: "age" as const, unit: "yrs", value: age, setter: setAge },
          { label: "Weight", key: "weight" as const, unit: "kg", value: weight, setter: setWeight },
          { label: "Height", key: "height" as const, unit: "cm", value: height, setter: setHeight },
        ].map(({ label, key, unit, value, setter }) => (
          <View key={label} className="flex-1">
            <SectionLabel>{label}</SectionLabel>
            <FormField
              value={value}
              onChangeText={(v) => {
                setter(v);
                setErrors((prev) => ({ ...prev, [key]: undefined }));
              }}
              keyboardType="numeric"
              suffix={unit}
              placeholder="0"
              fieldClassName="bg-dark-card rounded-[10px] px-3.5 py-3"
              inputClassName="text-base font-normal"
              error={errors[key]}
            />
          </View>
        ))}
      </View>

      <SectionLabel>Activity Level</SectionLabel>
      <SegmentedControl
        options={Object.keys(ACTIVITY_LABELS) as ActivityLevel[]}
        value={activity}
        onChange={setActivity}
        labels={ACTIVITY_LABELS}
      />

      <SectionLabel>Goal</SectionLabel>
      <SegmentedControl
        options={Object.keys(GOAL_LABELS) as Goal[]}
        value={goal}
        onChange={setGoal}
        labels={GOAL_LABELS}
      />

      {result !== null && (
        <View
          className="bg-dark-card rounded-[14px] p-5 items-center mt-4 border"
          style={{ borderColor: Colors.accentGreen + "40" }}
        >
          <Text className="text-text-secondary text-[13px] mb-1">Daily Calorie Goal</Text>
          <TextInput
            className="text-accent-green text-[52px] font-bold"
            style={{ lineHeight: 60 }}
            value={resultText}
            onChangeText={(v) => setResultText(v.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            placeholderTextColor={Colors.textMuted}
          />
          <Text className="text-text-muted text-sm mt-0.5">kcal / day</Text>
        </View>
      )}

      <AppButton
        onPress={result !== null ? handleSave : calculate}
        label={result !== null ? "Save" : "Calculate"}
        icon={result !== null ? "save-outline" : "calculator"}
        className="rounded-xl py-3.5 mt-6"
        textClassName="text-base font-semibold"
      />
    </>
  );

  if (isWebDesktop) {
    return (
      <DesktopPageCard>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
          <View className="w-9" />
          <Text className="text-text-primary text-[17px] font-semibold">Calorie Calculator</Text>
          <View className="w-9" />
        </View>
        <ScrollView
          contentContainerClassName="p-4 pb-10 gap-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {formContent}
        </ScrollView>
      </DesktopPageCard>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full bg-dark-surface items-center justify-center"
          >
            <Ionicons name="close" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text className="text-text-primary text-[17px] font-semibold">Calorie Calculator</Text>
          <View className="w-9" />
        </View>

        <ScrollView
          contentContainerClassName="p-4 pb-10 gap-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {formContent}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
