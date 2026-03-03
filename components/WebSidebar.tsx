import { Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface WebSidebarProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  calorieLimit: number;
}

const MACROS = [
  { key: "fats", label: "Fat" },
  { key: "carbs", label: "Carb" },
  { key: "protein", label: "Protein" },
] as const;

export function WebSidebar({ calories, protein, carbs, fats, calorieLimit }: WebSidebarProps) {
  const macroValues = { fats, carbs, protein };
  const maxMacro = Math.max(fats, carbs, protein, 1);

  const progress = Math.min(calories / Math.max(calorieLimit, 1), 1);

  return (
    <View
      className="bg-dark-card rounded-2xl px-6"
      style={{
        width: "100%",
        paddingTop: 35,
        paddingBottom: 105,
        alignSelf: "flex-start",
      }}
    >
      {MACROS.map(({ key, label }) => {
        const value = macroValues[key];
        const fillPct = (value / maxMacro) * 100;
        return (
          <View key={key} className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-text-secondary text-sm">{label}</Text>
              <Text className="text-text-primary text-sm">{Math.round(value)}g</Text>
            </View>
            <ResponsiveContainer width="100%" height={8}>
              <BarChart
                layout="vertical"
                data={[{ value: fillPct }]}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                barSize={8}
                barCategoryGap={0}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" hide />
                <Bar
                  dataKey="value"
                  fill={Colors.accentBlue}
                  radius={4}
                  background={{ fill: Colors.darkSurface, rx: 4, ry: 4 }}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </View>
        );
      })}

      <View className="items-center mt-8" style={{ height: 82 }}>
        <View style={{ position: "relative", width: 200, height: 82 }}>
          <PieChart width={200} height={82}>
            {/* cy=76 → arc crown at 76-70=6px from top, fully visible */}
            <Pie
              data={[{ value: 1 }]}
              cy={76}
              startAngle={180}
              endAngle={0}
              innerRadius={55}
              outerRadius={70}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={Colors.darkSurface} />
            </Pie>
            <Pie
              data={[{ value: progress }, { value: 1 - progress }]}
              cy={76}
              startAngle={180}
              endAngle={0}
              innerRadius={55}
              outerRadius={70}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={Colors.accentBlue} />
              <Cell fill="transparent" />
            </Pie>
          </PieChart>
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 100,
              // bottom: 40,
              right: 0,
              alignItems: "center",
            }}
          >
            <Text className="text-text-primary font-bold text-2xl">{Math.round(calories)}</Text>
            <Text className="text-text-secondary text-xs">{`/ ${calorieLimit} kcal`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
