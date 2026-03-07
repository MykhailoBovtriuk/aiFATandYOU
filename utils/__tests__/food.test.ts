import { getDayBorderColor, groupEntriesByMeal } from "../food";

const GREEN = "#289556";
const RED = "#EF4444";
const DARK_BORDER = "#2C303A";

const makeEntry = (id: string, mealType: "Breakfast" | "Lunch" | "Dinner") => ({
  id,
  name: "Food",
  calories: 100,
  protein: 10,
  carbs: 10,
  fats: 5,
  weight: 100,
  mealType,
  timestamp: Date.now(),
});

describe("groupEntriesByMeal", () => {
  it("groups entries by mealType", () => {
    const entries = [
      makeEntry("1", "Breakfast"),
      makeEntry("2", "Lunch"),
      makeEntry("3", "Breakfast"),
    ];
    const result = groupEntriesByMeal(entries);
    expect(result["Breakfast"]).toHaveLength(2);
    expect(result["Lunch"]).toHaveLength(1);
    expect(result["Dinner"]).toBeUndefined();
  });

  it("returns empty object for no entries", () => {
    expect(groupEntriesByMeal([])).toEqual({});
  });

  it("preserves entry order within a meal group", () => {
    const entries = [makeEntry("a", "Dinner"), makeEntry("b", "Dinner")];
    const result = groupEntriesByMeal(entries);
    expect(result["Dinner"][0].id).toBe("a");
    expect(result["Dinner"][1].id).toBe("b");
  });
});

describe("getDayBorderColor", () => {
  it("returns green for day with data under limit", () => {
    expect(getDayBorderColor(true, false)).toBe(GREEN);
  });

  it("returns red for day with data over limit", () => {
    expect(getDayBorderColor(true, true)).toBe(RED);
  });

  it("returns default color when no data", () => {
    expect(getDayBorderColor(false, false)).toBe(DARK_BORDER);
  });

  it("returns default color when no data even if over limit", () => {
    expect(getDayBorderColor(false, true)).toBe(DARK_BORDER);
  });

  it("accepts custom default color", () => {
    expect(getDayBorderColor(false, false, "#AABBCC")).toBe("#AABBCC");
  });
});
