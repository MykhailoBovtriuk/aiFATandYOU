import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalHeader } from "@/components/ModalHeader";
import { AppButton } from "@/components/ui/AppButton";
import { Colors } from "@/constants/colors";
import { createEmptyEntry } from "@/constants/meals";
import { useCameraScan } from "@/hooks/useCameraScan";
import { FoodEntry } from "@/types/food";
import { useFoodStore } from "@/store/useFoodStore";

export default function MealDetailScreen() {
  const router = useRouter();
  const { mealType, date } = useLocalSearchParams<{
    mealType: string;
    date?: string;
  }>();
  const meal = mealType || "Breakfast";
  const { scan, loading } = useCameraScan();
  const { setTempEntry } = useFoodStore();

  const handleManualAdd = () => {
    setTempEntry(createEmptyEntry(meal as FoodEntry["mealType"]));
    router.push({ pathname: "/review", params: { via: "meal-detail", ...(date && { date }) } });
  };

  return (
    <View className="flex-1 bg-dark-bg">
      <SafeAreaView className="flex-1" edges={["bottom"]}>
        <ModalHeader
          title={meal}
          mealType={meal}
          rightAction={
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-red-500 text-lg">Cancel</Text>
            </TouchableOpacity>
          }
        />

        <View className="flex-1 items-center justify-center gap-4">
          <AppButton
            onPress={() => scan(meal as any, date)}
            disabled={loading}
            loading={loading}
            icon="camera"
            label={loading ? "Analyzing..." : "Scan Food"}
            className="border-dark-border"
            textClassName="text-lg"
            style={{ width: 220 }}
          />
          <AppButton
            onPress={handleManualAdd}
            disabled={loading}
            icon="add"
            label="Add Manually"
            className="border-dark-border"
            textClassName="text-lg"
            style={{ width: 220 }}
          />
        </View>
      </SafeAreaView>

      {loading && (
        <View className="absolute inset-0 items-center justify-center z-10 bg-dark-bg/85">
          <ActivityIndicator size="large" color={Colors.accentGreen} />
          <Text className="text-text-primary mt-4 text-base font-semibold">Analyzing food...</Text>
        </View>
      )}
    </View>
  );
}
