import { Text, TextInput, View } from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/ui/FormField";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Colors } from "@/constants/colors";
import {
  type ActivityLevel,
  ACTIVITY_LABELS,
  type Gender,
  type Goal,
  GOAL_LABELS,
} from "@/utils/nutrition";

const BODY_FIELDS = [
  { label: "Age", key: "age" as const, unit: "yrs" },
  { label: "Weight", key: "weight" as const, unit: "kg" },
  { label: "Height", key: "height" as const, unit: "cm" },
] as const;

interface CalculatorFormFieldsProps {
  gender: Gender;
  setGender: (v: Gender) => void;
  age: string;
  setAge: (v: string) => void;
  weight: string;
  setWeight: (v: string) => void;
  height: string;
  setHeight: (v: string) => void;
  activity: ActivityLevel;
  setActivity: (v: ActivityLevel) => void;
  goal: Goal;
  setGoal: (v: Goal) => void;
  result: number | null;
  resultText: string;
  setResultText: (v: string) => void;
  errors: { age?: string; weight?: string; height?: string };
  setErrors: (fn: any) => void;
  resetResult: () => void;
  onAction: () => void;
}

export function CalculatorFormFields({
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
  resetResult,
  onAction,
}: CalculatorFormFieldsProps) {
  const fieldValues = { age, weight, height };
  const fieldSetters = { age: setAge, weight: setWeight, height: setHeight };

  return (
    <>
      <SectionLabel>Gender</SectionLabel>
      <SegmentedControl
        options={["male", "female"] as Gender[]}
        value={gender}
        onChange={(v) => {
          setGender(v);
          resetResult();
        }}
        labels={{ male: "Male", female: "Female" }}
      />

      <View className="flex-row gap-2">
        {BODY_FIELDS.map(({ label, key, unit }) => (
          <View key={label} className="flex-1">
            <SectionLabel>{label}</SectionLabel>
            <FormField
              value={fieldValues[key]}
              onChangeText={(v) => {
                fieldSetters[key](v);
                setErrors((prev: any) => ({ ...prev, [key]: undefined }));
                resetResult();
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
        onChange={(v) => {
          setActivity(v);
          resetResult();
        }}
        labels={ACTIVITY_LABELS}
      />

      <SectionLabel>Goal</SectionLabel>
      <SegmentedControl
        options={Object.keys(GOAL_LABELS) as Goal[]}
        value={goal}
        onChange={(v) => {
          setGoal(v);
          resetResult();
        }}
        labels={GOAL_LABELS}
      />

      {result !== null && (
        <View
          className="bg-dark-card rounded-[14px] p-5 items-center mt-4 border"
          style={{ borderColor: Colors.accentGreen + "40" }}
        >
          <Text className="text-text-secondary text-[13px] mb-1">Daily Calorie Goal</Text>
          <TextInput
            className="text-accent-green text-[52px] font-bold text-center"
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
        onPress={onAction}
        label={result !== null ? "Save" : "Calculate"}
        icon={result !== null ? "save-outline" : "calculator"}
        className="rounded-xl py-3.5 mt-6"
        textClassName="text-base font-semibold"
      />
    </>
  );
}
