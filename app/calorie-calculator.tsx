import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DesktopPageCard } from "@/components/DesktopPageCard";
import { CalculatorFormFields } from "@/components/calculator/CalculatorFormFields";
import { Colors } from "@/constants/colors";
import { useCalorieCalculator } from "@/hooks/useCalorieCalculator";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";

export default function CalorieCalculatorScreen() {
  const router = useRouter();
  const isWebDesktop = useIsWebDesktop();
  const calc = useCalorieCalculator();

  const onAction = calc.result !== null ? calc.handleSave : calc.calculate;

  const header = (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
      {isWebDesktop ? (
        <View className="w-9" />
      ) : (
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-dark-surface items-center justify-center"
        >
          <Ionicons name="close" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      )}
      <Text className="text-text-primary text-[17px] font-semibold">Calorie Calculator</Text>
      <View className="w-9" />
    </View>
  );

  const formContent = (
    <ScrollView
      contentContainerClassName="p-4 pb-10 gap-2"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <CalculatorFormFields {...calc} onAction={onAction} />
    </ScrollView>
  );

  if (isWebDesktop) {
    return (
      <DesktopPageCard>
        {header}
        {formContent}
      </DesktopPageCard>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {header}
        {formContent}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
