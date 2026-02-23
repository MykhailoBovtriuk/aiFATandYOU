import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GlobalHeader } from "../components/GlobalHeader";
import { ErrorBoundaryFallback } from "../components/ErrorBoundaryFallback";
import { Colors } from "../constants/colors";
import "../global.css";

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return <ErrorBoundaryFallback error={error} retry={retry} />;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: Colors.darkBg }}>
        <GlobalHeader />
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
          <Stack.Screen
            name="settings"
            options={{ headerShown: false, animation: "none" }}
          />
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
