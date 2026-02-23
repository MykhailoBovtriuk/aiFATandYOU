import { Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";

interface MacroInputProps {
  label: string;
  unit?: string;
  value: number | undefined;
  onChange: (value: number) => void;
  onChangeText?: (text: string) => void;
  rawValue?: string;
  error?: string;
  className?: string;
}

export function MacroInput({
  label,
  unit = "g",
  value,
  onChange,
  onChangeText,
  rawValue,
  error,
  className = "",
}: MacroInputProps) {
  return (
    <View className={`flex-1 mx-1 ${className}`}>
      <View className={`bg-dark-surface p-3 rounded-xl border items-center ${error ? "border-red-500" : "border-dark-border"}`}>
        <Text className="text-text-muted text-[10px] font-bold uppercase mb-1">
          {label} ({unit})
        </Text>
        <TextInput
          className="text-xl font-bold text-text-primary text-center"
          value={rawValue ?? value?.toString()}
          onChangeText={(text) => {
            onChangeText?.(text);
            onChange(Number(text) || 0);
          }}
          keyboardType="numeric"
          placeholderTextColor={Colors.placeholder}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 text-center">{error}</Text>
      )}
    </View>
  );
}
