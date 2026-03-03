import { GoogleGenerativeAI } from "@google/generative-ai";
import { EncodingType, readAsStringAsync } from "expo-file-system/legacy";
import { Platform } from "react-native";
import { GeminiResponse, GeminiResponseSchema } from "@/types/food";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) throw new Error("EXPO_PUBLIC_GEMINI_API_KEY is not set. Add it to your .env file.");
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeImage = async (imageUri: string): Promise<GeminiResponse> => {
  try {
    let base64: string;
    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      base64 = await readAsStringAsync(imageUri, {
        encoding: EncodingType.Base64,
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Act as a professional nutritionist. Analyze the food in this image.
      Return ONLY a raw JSON object (no markdown, no backticks) with this structure:
      {
        "name": "Food Name",
        "calories": number,
        "protein": number (grams),
        "carbs": number (grams),
        "fats": number (grams),
        "weight": number (estimated grams),
        "mealType": "Breakfast" | "Lunch" | "Dinner"
      }
      If multiple items are visible, sum the macros. Estimate the weight based on standard portion sizes.
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64, mimeType: "image/jpeg" } },
    ]);

    const responseText = result.response.text();

    // Sometimes Gemini wraps response in ```json ... ```
    const cleanJson = responseText.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleanJson);
    return GeminiResponseSchema.parse(parsed);
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
