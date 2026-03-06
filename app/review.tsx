import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DesktopPageCard } from "@/components/DesktopPageCard";
import { ModalHeader } from "@/components/ModalHeader";
import { ReviewFormFields } from "@/components/review/ReviewFormFields";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";
import { useReviewForm } from "@/hooks/useReviewForm";
import { impact } from "@/utils/haptics";
import { Colors } from "@/constants/colors";
import { useRouter } from "expo-router";

export default function ReviewScreen() {
  const router = useRouter();
  const isWebDesktop = useIsWebDesktop();
  const form = useReviewForm();

  if (!form.tempEntry) return null;

  const headerTitle = form.tempEntry.mealType ?? "Review Food";

  const formContent = (
    <ReviewFormFields
      tempEntry={form.tempEntry}
      isEditMode={form.isEditMode}
      localImageUri={form.localImageUri}
      rawValues={form.rawValues}
      errors={form.errors}
      onSave={form.handleSave}
      onDelete={form.handleDelete}
      updateField={form.updateField}
      updateMacro={form.updateMacro}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {isWebDesktop ? (
          <DesktopPageCard>
            <ModalHeader title={headerTitle} mealType={form.tempEntry.mealType} />
            <ScrollView className="flex-1 p-5">{formContent}</ScrollView>
          </DesktopPageCard>
        ) : (
          <View style={{ flex: 1 }}>
            <ModalHeader
              title={headerTitle}
              mealType={form.tempEntry.mealType}
              leftAction={
                <TouchableOpacity
                  onPress={() => {
                    impact();
                    router.back();
                  }}
                >
                  <Text className="text-red-500 text-lg">Cancel</Text>
                </TouchableOpacity>
              }
              rightAction={
                <TouchableOpacity onPress={form.handleScan} disabled={form.scanning}>
                  {form.scanning ? (
                    <ActivityIndicator color={Colors.textPrimary} />
                  ) : (
                    <Ionicons name="camera" size={26} color={Colors.textPrimary} />
                  )}
                </TouchableOpacity>
              }
            />
            <ScrollView className="flex-1 p-5">{formContent}</ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
