import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";

type Props = {
  error: Error;
  retry: () => void;
};

export function ErrorBoundaryFallback({ error, retry }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <View className="flex-1 items-center justify-center px-8 gap-4">
        <Ionicons name="warning" size={56} color={Colors.error} />
        <Text className="text-xl font-bold text-text-primary text-center">Something went wrong</Text>
        <Text className="text-sm text-text-secondary text-center">{error.message}</Text>
        <TouchableOpacity
          className="mt-2 py-4 px-12 rounded-2xl border border-text-primary items-center"
          onPress={retry}
          activeOpacity={0.85}
        >
          <Text className="text-text-primary text-lg font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
