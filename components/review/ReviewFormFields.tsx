import { Image, Text, View } from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { FormField } from "@/components/ui/FormField";
import { MacroInput } from "@/components/ui/MacroInput";
import type { FoodEntry } from "@/types/food";
import type { RawValues, FieldErrors } from "@/hooks/useReviewForm";

type FieldKey = "name" | "calories" | "weight" | "protein" | "carbs" | "fats";

interface ReviewFormFieldsProps {
  tempEntry: Partial<FoodEntry>;
  isEditMode: boolean;
  localImageUri?: string;
  rawValues: RawValues;
  errors: FieldErrors;
  onSave: () => void;
  onDelete: () => void;
  updateField: (field: FieldKey, text: string) => void;
  updateMacro: (field: "protein" | "carbs" | "fats", value: number, text: string) => void;
}

export function ReviewFormFields({
  tempEntry,
  isEditMode,
  localImageUri,
  rawValues,
  errors,
  onSave,
  onDelete,
  updateField,
  updateMacro,
}: ReviewFormFieldsProps) {
  return (
    <>
      {localImageUri && (
        <View className="mb-5 rounded-2xl overflow-hidden">
          <Image source={{ uri: localImageUri }} className="w-full h-48" resizeMode="cover" />
        </View>
      )}

      <FormField
        label="Food Name"
        value={tempEntry.name}
        onChangeText={(t) => updateField("name", t)}
        className="mb-4"
        error={errors.name}
      />

      <View className="flex-row gap-2 mb-4">
        <View className="flex-1">
          <FormField
            label="Calories (kcal)"
            value={rawValues.calories}
            onChangeText={(t) => updateField("calories", t)}
            keyboardType="numeric"
            className="mb-4"
            error={errors.calories}
          />
        </View>
        <View className="flex-1">
          <FormField
            label="Weight (g)"
            value={rawValues.weight}
            onChangeText={(t) => updateField("weight", t)}
            keyboardType="numeric"
            className="mb-4"
            error={errors.weight}
          />
        </View>
      </View>

      <Text className="text-text-secondary font-bold mb-2 ml-1">Macros</Text>
      <View className="flex-row justify-between mb-6">
        <MacroInput
          label="Protein"
          value={tempEntry.protein}
          rawValue={rawValues.protein}
          onChange={(v) => updateMacro("protein", v, v.toString())}
          onChangeText={(t) => updateMacro("protein", Number(t) || 0, t)}
          error={errors.protein}
        />
        <MacroInput
          label="Carbs"
          value={tempEntry.carbs}
          rawValue={rawValues.carbs}
          onChange={(v) => updateMacro("carbs", v, v.toString())}
          onChangeText={(t) => updateMacro("carbs", Number(t) || 0, t)}
          error={errors.carbs}
        />
        <MacroInput
          label="Fats"
          value={tempEntry.fats}
          rawValue={rawValues.fats}
          onChange={(v) => updateMacro("fats", v, v.toString())}
          onChangeText={(t) => updateMacro("fats", Number(t) || 0, t)}
          error={errors.fats}
        />
      </View>

      <AppButton onPress={onSave} label={isEditMode ? "Save Changes" : "Add"} />

      {isEditMode && (
        <AppButton onPress={onDelete} label="Delete" variant="danger" className="mt-3" />
      )}

      <View className="h-10" />
    </>
  );
}
