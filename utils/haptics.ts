import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export function impact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS !== "web") Haptics.impactAsync(style);
}

export function notify(
  type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success,
) {
  if (Platform.OS !== "web") Haptics.notificationAsync(type);
}
