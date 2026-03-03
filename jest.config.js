module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/**/*.test.ts", "**/*.test.ts", "**/*.test.tsx"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|nativewind|react-native-svg)",
  ],
};
