import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton } from "../components/ui/AppButton";
import { Colors } from "../constants/colors";

export default function ErrorScreen() {
  const router = useRouter();
  const { message, response } = useLocalSearchParams<{
    message: string;
    response?: string;
  }>();

  return (
    <View className="flex-1 bg-dark-bg">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1 px-6 pt-8 pb-4 gap-4">
          <View className="items-center gap-3">
            <Ionicons name="warning" size={56} color={Colors.error} />
            <Text className="text-2xl font-bold text-text-primary">
              Something went wrong
            </Text>
            <Text className="text-base text-text-secondary text-center">
              {message}
            </Text>
          </View>

          {response ? (
            <ScrollView className="flex-1 bg-dark-card rounded-xl p-4">
              <Text className="text-xs text-text-muted font-mono">
                {response}
              </Text>
            </ScrollView>
          ) : (
            <View className="flex-1" />
          )}

          <AppButton label="Close" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}
