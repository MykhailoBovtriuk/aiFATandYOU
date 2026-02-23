import { Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";

interface FormFieldProps {
  label?: string;
  value: string | number | undefined;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "number-pad";
  suffix?: string;
  placeholder?: string;
  className?: string;
  fieldClassName?: string;
  inputClassName?: string;
  error?: string;
}

export function FormField({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  suffix,
  placeholder,
  className = "",
  fieldClassName,
  inputClassName = "",
  error,
}: FormFieldProps) {
  const input = (
    <TextInput
      className={`text-lg font-semibold text-text-primary ${suffix ? "flex-1" : ""} ${inputClassName}`}
      value={value?.toString()}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor={Colors.placeholder}
    />
  );

  const baseFieldClass = fieldClassName ?? "bg-dark-surface p-4 rounded-2xl";
  const borderClass = error
    ? "border border-red-500"
    : fieldClassName
      ? "border-0"
      : "border border-dark-border";

  return (
    <View className={className}>
      <View className={`${baseFieldClass} ${borderClass}`}>
        {label && (
          <Text className="text-text-muted text-xs font-bold uppercase mb-1">
            {label}
          </Text>
        )}
        {suffix ? (
          <View className="flex-row items-center">
            {input}
            <Text className="text-text-muted text-sm ml-2">{suffix}</Text>
          </View>
        ) : (
          input
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
