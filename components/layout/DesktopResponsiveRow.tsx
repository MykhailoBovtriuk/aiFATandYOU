import { ReactNode } from "react";
import { View } from "react-native";
import { useIsWebDesktop } from "@/hooks/useIsWebDesktop";

interface DesktopResponsiveRowProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function DesktopResponsiveRow({ children, sidebar }: DesktopResponsiveRowProps) {
  const isWebDesktop = useIsWebDesktop();

  return (
    <View className="flex-1 bg-dark-bg">
      <View
        style={{
          flex: 1,
          ...(isWebDesktop
            ? { flexDirection: "row", alignSelf: "center", width: "100%", maxWidth: 1024, gap: 24 }
            : {}),
        }}
      >
        <View className="flex-1">{children}</View>
        {isWebDesktop && sidebar}
      </View>
    </View>
  );
}
