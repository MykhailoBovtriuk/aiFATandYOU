import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiResponse, GeminiResponseSchema } from "@/types/food";
import { imageToBase64 } from "@/utils/imagePicker";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) throw new Error("EXPO_PUBLIC_GEMINI_API_KEY is not set. Add it to your .env file.");
const genAI = new GoogleGenerativeAI(API_KEY);

const PROMPT = `
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

export async function analyzeImage(imageUri: string): Promise<GeminiResponse> {
  const base64 = await imageToBase64(imageUri);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    PROMPT,
    { inlineData: { data: base64, mimeType: "image/jpeg" } },
  ]);

  const cleanJson = result.response
    .text()
    .replace(/```json|```/g, "")
    .trim();
  return GeminiResponseSchema.parse(JSON.parse(cleanJson));
}
