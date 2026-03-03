import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useMotivationalPhrase } from "@/hooks/useMotivationalPhrase";
import { useFoodStore } from "@/store/useFoodStore";

export function GlobalHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const isSettings = pathname === "/settings";
  const [menuVisible, setMenuVisible] = useState(false);
  const isWebDesktop = useIsWebDesktop();

  const getCaloriesPerDate = useFoodStore((s) => s.getCaloriesPerDate);
  const calorieLimit = useFoodStore((s) => s.calorieLimit);
  const todayKey = new Date().toDateString();
  const todayCalories = getCaloriesPerDate()[todayKey] ?? 0;
  const isOverLimit = todayCalories > calorieLimit;
  const phrase = useMotivationalPhrase(isOverLimit, pathname);

  return (
    <View
      className="bg-dark-bg border-b border-dark-border"
      style={{ paddingTop: insets.top, paddingBottom: 10 }}
    >
      <View className="h-14 px-5 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => (isSettings ? router.back() : router.navigate("/(tabs)/calendar"))}
          hitSlop={8}
        >
          <Ionicons
            name={isSettings ? "chevron-back" : "calendar-outline"}
            size={isSettings ? 28 : 24}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>

        <Text
          className={`flex-1 text-sm text-text-primary text-center px-2.5 ${
            isSettings ? "font-semibold text-[17px] opacity-100" : "opacity-90"
          }`}
          numberOfLines={1}
        >
          {isSettings ? "Settings" : phrase}
        </Text>

        {isWebDesktop ? (
          <View className="w-8 h-8" />
        ) : (
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            className="w-8 h-8 rounded-full border border-dark-border items-center justify-center"
            hitSlop={8}
          >
            <Ionicons name="person" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      {!isWebDesktop && (
        <Modal
          visible={menuVisible}
          transparent
          animationType="none"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          >
            <View
              className="absolute right-4 bg-dark-card border border-dark-border rounded-[10px] min-w-[200px]"
              style={{
                top: insets.top + 56,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center px-3.5 py-3">
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={Colors.textMuted}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-[15px]" style={{ color: Colors.textMuted }}>
                  Info
                </Text>
              </View>

              <View className="h-px bg-dark-border mx-3.5" />

              <TouchableOpacity
                className="flex-row items-center px-3.5 py-3"
                onPress={() => {
                  setMenuVisible(false);
                  router.push("/settings");
                }}
              >
                <Ionicons
                  name="settings-outline"
                  size={18}
                  color={Colors.textPrimary}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-[15px]" style={{ color: Colors.textPrimary }}>
                  Settings
                </Text>
              </TouchableOpacity>

              <View className="h-px bg-dark-border mx-3.5" />

              <View className="flex-row items-center px-3.5 py-3">
                <Ionicons
                  name="log-in-outline"
                  size={18}
                  color={Colors.textMuted}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-[15px]" style={{ color: Colors.textMuted }}>
                  Login / Logout
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}
