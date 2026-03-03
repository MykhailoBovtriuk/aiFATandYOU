import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "@/components/ui/AppButton";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-dark-bg">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <Text className="text-8xl font-bold text-text-primary">404</Text>
          <Text className="text-xl text-text-secondary">Page Not Found</Text>
          <Text className="text-sm text-text-muted text-center">This page doesn't exist.</Text>
          <AppButton label="Go Back" onPress={() => router.back()} className="mt-4 w-full" />
        </View>
      </SafeAreaView>
    </View>
  );
}
