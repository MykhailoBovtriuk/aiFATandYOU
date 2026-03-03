import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useLayoutEffect } from "react";
import { Platform, View } from "react-native";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";
import { GlobalHeader } from "@/components/GlobalHeader";
import { ErrorBoundaryFallback } from "@/components/ErrorBoundaryFallback";
import { Colors } from "@/constants/colors";
import "../global.css";

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return <ErrorBoundaryFallback error={error} retry={retry} />;
}

export default function RootLayout() {
  const isWebDesktop = useIsWebDesktop();
  const [isWebReady, setIsWebReady] = useState(Platform.OS !== "web");

  useLayoutEffect(() => {
    if (Platform.OS === "web") setIsWebReady(true);
  }, []);

  if (!isWebReady) {
    return <View style={{ flex: 1, backgroundColor: Colors.darkBg }} />;
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: Colors.darkBg }}>
        {!isWebDesktop && <GlobalHeader />}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.darkBg },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen
            name="review"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="meal-detail"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen name="day-view" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen
            name="calorie-calculator"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="error"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
        </Stack>
      </View>
    </>
  );
}
