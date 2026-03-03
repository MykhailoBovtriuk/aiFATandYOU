import { ReactNode } from "react";
import { View } from "react-native";
import { NavSidebar } from "@/components/NavSidebar";

interface DesktopPageCardProps {
  children: ReactNode;
}

export function DesktopPageCard({ children }: DesktopPageCardProps) {
  return (
    <View style={{ flex: 1, flexDirection: "row" }} className="bg-dark-bg">
      <NavSidebar />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{ width: "70%", maxWidth: 1024, maxHeight: "90%", overflow: "hidden" }}
          className="bg-dark-card rounded-2xl border border-dark-border"
        >
          {children}
        </View>
      </View>
    </View>
  );
}
