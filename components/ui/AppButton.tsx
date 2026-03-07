import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "outline" | "danger";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
}

export function AppButton({
  label,
  onPress,
  icon,
  variant = "outline",
  loading = false,
  disabled = false,
  className = "",
  textClassName = "",
  style,
}: AppButtonProps) {
  const variantClass = variant === "danger" ? "bg-red-600" : "border border-white";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-4 rounded-2xl items-center flex-row justify-center gap-2 ${variantClass} ${className}`}
      activeOpacity={0.85}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textPrimary} />
      ) : icon ? (
        <Ionicons name={icon} size={20} color={Colors.textPrimary} />
      ) : null}
      <Text className={`text-white text-xl font-bold ${textClassName}`}>{label}</Text>
    </TouchableOpacity>
  );
}
