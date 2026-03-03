import { getMealPeriodFromHour, isoToLocalDate, toLocalISODate } from "../dates";

describe("toLocalISODate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(toLocalISODate(new Date(2024, 0, 5))).toBe("2024-01-05");
  });

  it("zero-pads month and day", () => {
    expect(toLocalISODate(new Date(2024, 8, 9))).toBe("2024-09-09");
  });

  it("handles December (month 11 = 12)", () => {
    expect(toLocalISODate(new Date(2024, 11, 31))).toBe("2024-12-31");
  });
});

describe("isoToLocalDate", () => {
  it("parses an ISO string to a local Date", () => {
    const d = isoToLocalDate("2024-03-15");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(2); // March = 2
    expect(d.getDate()).toBe(15);
  });

  it("round-trips with toLocalISODate", () => {
    const iso = "2025-07-20";
    expect(toLocalISODate(isoToLocalDate(iso))).toBe(iso);
  });
});

describe("getMealPeriodFromHour", () => {
  it("returns Breakfast for hours 4-10", () => {
    expect(getMealPeriodFromHour(4)).toBe("Breakfast");
    expect(getMealPeriodFromHour(7)).toBe("Breakfast");
    expect(getMealPeriodFromHour(10)).toBe("Breakfast");
  });

  it("returns Lunch for hours 11-16", () => {
    expect(getMealPeriodFromHour(11)).toBe("Lunch");
    expect(getMealPeriodFromHour(13)).toBe("Lunch");
    expect(getMealPeriodFromHour(16)).toBe("Lunch");
  });

  it("returns Dinner for hours 17-23 and 0-3", () => {
    expect(getMealPeriodFromHour(17)).toBe("Dinner");
    expect(getMealPeriodFromHour(22)).toBe("Dinner");
    expect(getMealPeriodFromHour(0)).toBe("Dinner");
    expect(getMealPeriodFromHour(3)).toBe("Dinner");
  });
});
