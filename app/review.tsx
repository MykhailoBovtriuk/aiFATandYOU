import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MealIcon } from "../components/MealIcon";
import { AppButton } from "../components/ui/AppButton";
import { FormField } from "../components/ui/FormField";
import { MacroInput } from "../components/ui/MacroInput";
import { useIsWebDesktop } from "../hooks/useIsWebDesktop";
import { analyzeImage } from "../services/gemini";
import { useFoodStore } from "../store/useFoodStore";
import { NavSidebar } from "../components/NavSidebar";
import { ReviewFormSchema } from "../types/food";

export default function ReviewScreen() {
  const router = useRouter();
  const {
    imageUri: imageUriParam,
    entryId,
    date,
  } = useLocalSearchParams<{
    imageUri?: string;
    entryId?: string;
    date?: string;
  }>();
  const {
    tempEntry,
    setTempEntry,
    confirmTempEntry,
    updateEntry,
    deleteEntry,
  } = useFoodStore();
  const isEditMode = !!entryId;
  const isWebDesktop = useIsWebDesktop();
  const [localImageUri, setLocalImageUri] = useState<string | undefined>(
    imageUriParam,
  );
  const [scanning, setScanning] = useState(false);
  const [rawValues, setRawValues] = useState({
    calories: tempEntry?.calories?.toString() ?? "0",
    weight: tempEntry?.weight?.toString() ?? "0",
    protein: tempEntry?.protein?.toString() ?? "0",
    carbs: tempEntry?.carbs?.toString() ?? "0",
    fats: tempEntry?.fats?.toString() ?? "0",
  });
  const [errors, setErrors] = useState<
    Partial<
      Record<
        "name" | "calories" | "weight" | "protein" | "carbs" | "fats",
        string
      >
    >
  >({});

  const handleScan = async () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let result: ImagePicker.ImagePickerResult;
    if (Platform.OS === "web") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
      });
    } else {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission", "Camera access is needed.");
        return;
      }
      try {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.5,
        });
      } catch (e: any) {
        if (e?.message?.includes("Camera not available on simulator")) {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.5,
          });
        } else {
          throw e;
        }
      }
    }

    if (!result.canceled) {
      setScanning(true);
      try {
        const uri = result.assets[0].uri;
        const data = await analyzeImage(uri);
        setTempEntry({
          ...data,
          mealType: tempEntry?.mealType || data.mealType || "Breakfast",
        });
        setRawValues({
          calories: data.calories?.toString() ?? "0",
          weight: data.weight?.toString() ?? "0",
          protein: data.protein?.toString() ?? "0",
          carbs: data.carbs?.toString() ?? "0",
          fats: data.fats?.toString() ?? "0",
        });
        setLocalImageUri(uri);
      } catch (error) {
        router.push({
          pathname: "/error" as any,
          params: {
            message: "Could not analyze food.",
            response: error instanceof Error ? error.message : String(error),
          },
        });
      } finally {
        setScanning(false);
      }
    }
  };

  useEffect(() => {
    if (!tempEntry) {
      router.replace("/");
    }
  }, [tempEntry]);

  if (!tempEntry) {
    return null;
  }

  const validate = () => {
    const result = ReviewFormSchema.safeParse({
      name: tempEntry.name ?? "",
      calories: rawValues.calories,
      weight: rawValues.weight,
      protein: rawValues.protein,
      carbs: rawValues.carbs,
      fats: rawValues.fats,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        calories: fieldErrors.calories?.[0],
        weight: fieldErrors.weight?.[0],
        protein: fieldErrors.protein?.[0],
        carbs: fieldErrors.carbs?.[0],
        fats: fieldErrors.fats?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (Platform.OS !== "web")
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (isEditMode) {
      updateEntry(entryId!, tempEntry);
      router.back();
    } else {
      confirmTempEntry(date);
      if (date) {
        router.dismiss(2);
      } else {
        router.replace("/");
      }
    }
  };

  const formFields = (
    <>
      {localImageUri && (
        <View className="mb-5 rounded-2xl overflow-hidden">
          <Image
            source={{ uri: localImageUri }}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>
      )}

      <FormField
        label="Food Name"
        value={tempEntry.name}
        onChangeText={(t) => {
          setTempEntry({ ...tempEntry, name: t });
          setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        className="mb-4"
        error={errors.name}
      />

      <View className="flex-row gap-2 mb-4">
        <View className="flex-1">
          <FormField
            label="Calories (kcal)"
            value={rawValues.calories}
            onChangeText={(t) => {
              setRawValues((prev) => ({ ...prev, calories: t }));
              setErrors((prev) => ({ ...prev, calories: undefined }));
              setTempEntry({ ...tempEntry, calories: Number(t) || 0 });
            }}
            keyboardType="numeric"
            className="mb-4"
            error={errors.calories}
          />
        </View>
        <View className="flex-1">
          <FormField
            label="Weight (g)"
            value={rawValues.weight}
            onChangeText={(t) => {
              setRawValues((prev) => ({ ...prev, weight: t }));
              setErrors((prev) => ({ ...prev, weight: undefined }));
              setTempEntry({ ...tempEntry, weight: Number(t) || 0 });
            }}
            keyboardType="numeric"
            className="mb-4"
            error={errors.weight}
          />
        </View>
      </View>

      <Text className="text-text-secondary font-bold mb-2 ml-1">Macros</Text>
      <View className="flex-row justify-between mb-6">
        <MacroInput
          label="Protein"
          value={tempEntry.protein}
          rawValue={rawValues.protein}
          onChange={(v) => setTempEntry({ ...tempEntry, protein: v })}
          onChangeText={(t) => {
            setRawValues((prev) => ({ ...prev, protein: t }));
            setErrors((prev) => ({ ...prev, protein: undefined }));
          }}
          error={errors.protein}
        />
        <MacroInput
          label="Carbs"
          value={tempEntry.carbs}
          rawValue={rawValues.carbs}
          onChange={(v) => setTempEntry({ ...tempEntry, carbs: v })}
          onChangeText={(t) => {
            setRawValues((prev) => ({ ...prev, carbs: t }));
            setErrors((prev) => ({ ...prev, carbs: undefined }));
          }}
          error={errors.carbs}
        />
        <MacroInput
          label="Fats"
          value={tempEntry.fats}
          rawValue={rawValues.fats}
          onChange={(v) => setTempEntry({ ...tempEntry, fats: v })}
          onChangeText={(t) => {
            setRawValues((prev) => ({ ...prev, fats: t }));
            setErrors((prev) => ({ ...prev, fats: undefined }));
          }}
          error={errors.fats}
        />
      </View>

      <AppButton
        onPress={handleSave}
        label={isEditMode ? "Save Changes" : "Add"}
      />

      {isEditMode && (
        <AppButton
          onPress={() => {
            if (Platform.OS !== "web")
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            deleteEntry(entryId!);
            router.replace("/");
          }}
          label="Delete"
          variant="danger"
          className="mt-3"
        />
      )}

      <View className="h-10" />
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {isWebDesktop ? (
          // ── Desktop: NavSidebar + vertically-centered card ──
          <View style={{ flex: 1, flexDirection: "row" }}>
            <NavSidebar />
            <View
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <View
                style={{
                  width: "70%",
                  maxWidth: 1024,
                  maxHeight: "90%",
                  overflow: "hidden",
                }}
                className="bg-dark-card rounded-2xl border border-dark-border"
              >
                <View className="flex-row justify-between items-center p-4 border-b border-dark-border">
                  <View style={{ width: 60 }} />
                  <View className="flex-row items-center gap-2">
                    {tempEntry.mealType && (
                      <MealIcon mealType={tempEntry.mealType} size={28} />
                    )}
                    <Text className="text-text-primary text-lg font-bold">
                      {tempEntry.mealType ?? "Review Food"}
                    </Text>
                  </View>
                  <View style={{ width: 26 }} />
                </View>
                <ScrollView className="flex-1 p-5">{formFields}</ScrollView>
              </View>
            </View>
          </View>
        ) : (
          // ── Mobile: unchanged ──
          <View style={{ flex: 1 }}>
            <View className="flex-row justify-between items-center p-4 border-b border-dark-border bg-dark-card">
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== "web")
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
              >
                <Text className="text-red-500 text-lg">Cancel</Text>
              </TouchableOpacity>
              <View className="flex-row items-center gap-2">
                {tempEntry.mealType && (
                  <MealIcon mealType={tempEntry.mealType} size={28} />
                )}
                <Text className="text-text-primary text-lg font-bold">
                  {tempEntry.mealType ?? "Review Food"}
                </Text>
              </View>
              {!isWebDesktop ? (
                <TouchableOpacity onPress={handleScan} disabled={scanning}>
                  {scanning ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Ionicons name="camera" size={26} color="#fff" />
                  )}
                </TouchableOpacity>
              ) : (
                <View style={{ width: 26 }} />
              )}
            </View>
            <ScrollView className="flex-1 p-5">{formFields}</ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
