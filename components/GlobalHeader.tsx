import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderMenu } from "@/components/HeaderMenu";
import { Colors } from "@/constants/colors";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";
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
  const phrase = useMotivationalPhrase(todayCalories > calorieLimit, pathname);

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

      {!isWebDesktop && <HeaderMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />}
    </View>
  );
}
