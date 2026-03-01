import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavSidebar } from "../components/NavSidebar";
import { Colors } from "../constants/colors";
import { useIsWebDesktop } from "../hooks/useIsWebDesktop";

export default function SettingsScreen() {
  const router = useRouter();
  const isWebDesktop = useIsWebDesktop();

  if (isWebDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }} className="bg-dark-bg">
        <NavSidebar />
        <View style={{ flex: 1, alignItems: "center", marginTop: 32 }}>
          <View
            style={{ width: "70%", maxWidth: 1024, overflow: "hidden" }}
            className="bg-dark-card rounded-2xl border border-dark-border"
          >
            <View className="px-4 py-4">
              <TouchableOpacity
                className="flex-row items-center bg-dark-card rounded-xl py-3.5 px-4"
                onPress={() => router.push("/calorie-calculator")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="calculator"
                  size={22}
                  color={Colors.textPrimary}
                  style={{ marginRight: 16 }}
                />
                <Text className="flex-1 text-text-primary text-[15px] font-medium">
                  Calorie Calculator
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-dark-bg">
      <View className="flex-1 px-4 pt-4">
        <TouchableOpacity
          className="flex-row items-center bg-dark-card rounded-xl py-3.5 px-4"
          onPress={() => router.push("/calorie-calculator")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="calculator"
            size={22}
            color={Colors.textPrimary}
            style={{ marginRight: 16 }}
          />
          <Text className="flex-1 text-text-primary text-[15px] font-medium">
            Calorie Calculator
          </Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
