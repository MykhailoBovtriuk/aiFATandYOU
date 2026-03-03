import { calculateBMR, calculateDailyGoal, calculateTDEE } from "../nutrition";

describe("calculateBMR", () => {
  it("calculates male BMR correctly", () => {
    // 10*80 + 6.25*175 - 5*30 + 5 = 800 + 1093.75 - 150 + 5 = 1748.75
    expect(calculateBMR("male", 80, 175, 30)).toBeCloseTo(1748.75);
  });

  it("calculates female BMR correctly", () => {
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    expect(calculateBMR("female", 60, 165, 25)).toBeCloseTo(1345.25);
  });

  it("female BMR is lower than male for same stats", () => {
    expect(calculateBMR("female", 70, 170, 28)).toBeLessThan(calculateBMR("male", 70, 170, 28));
  });
});

describe("calculateTDEE", () => {
  it("applies light activity multiplier (1.375)", () => {
    expect(calculateTDEE(1000, "light")).toBeCloseTo(1375);
  });

  it("applies moderate activity multiplier (1.55)", () => {
    expect(calculateTDEE(1000, "moderate")).toBeCloseTo(1550);
  });

  it("applies active activity multiplier (1.725)", () => {
    expect(calculateTDEE(1000, "active")).toBeCloseTo(1725);
  });
});

describe("calculateDailyGoal", () => {
  it("reduces calories for lose goal (0.8)", () => {
    expect(calculateDailyGoal(2000, "lose")).toBe(1600);
  });

  it("keeps calories the same for maintain goal (1.0)", () => {
    expect(calculateDailyGoal(2000, "maintain")).toBe(2000);
  });

  it("increases calories for gain goal (1.15)", () => {
    expect(calculateDailyGoal(2000, "gain")).toBe(2300);
  });

  it("rounds result to nearest integer", () => {
    const result = calculateDailyGoal(1999, "maintain");
    expect(Number.isInteger(result)).toBe(true);
  });
});
