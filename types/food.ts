import { z } from 'zod';

export const FoodSchema = z.object({
  id: z.string(),
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  weight: z.number(),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner']),
  timestamp: z.number(),
});

export type FoodEntry = z.infer<typeof FoodSchema>;

export const GeminiResponseSchema = z.object({
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  weight: z.number(),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner']),
});
export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;

const numField = (check: 'positive' | 'non-negative') =>
  z.string()
    .trim()
    .refine((v) => v !== '' && Number.isFinite(Number(v)), 'Please enter a valid number')
    .transform(Number)
    .refine(
      (n) => check === 'positive' ? n > 0 : n >= 0,
      check === 'positive' ? 'Must be greater than 0' : 'Please enter a valid number',
    );

export const ReviewFormSchema = z.object({
  name: z.string().trim().min(1, 'This field cannot be empty'),
  calories: numField('positive'),
  weight: numField('positive'),
  protein: numField('non-negative'),
  carbs: numField('non-negative'),
  fats: numField('non-negative'),
});

export interface DayMeals {
  breakfast: FoodEntry[];
  lunch: FoodEntry[];
  dinner: FoodEntry[];
}
