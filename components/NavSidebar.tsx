import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

type NavItemConfig = {
  label: string;
  href: string;
  pathnameMatch: string;
  renderIcon: (active: boolean) => React.ReactNode;
};

const NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Home",
    href: "/(tabs)/",
    pathnameMatch: "/",
    renderIcon: (active) => (
      <FontAwesome5
        name="hamburger"
        size={20}
        color={active ? Colors.textPrimary : Colors.textMuted}
      />
    ),
  },
  // {
  //   label: "Scan",
  //   href: "/(tabs)/camera",
  //   pathnameMatch: "/camera",
  //   renderIcon: (active) => (
  //     <Ionicons
  //       name="camera-outline"
  //       size={22}
  //       color={active ? Colors.textPrimary : Colors.textMuted}
  //     />
  //   ),
  // },
  {
    label: "Calendar",
    href: "/(tabs)/calendar",
    pathnameMatch: "/calendar",
    renderIcon: (active) => (
      <Ionicons
        name="calendar-outline"
        size={22}
        color={active ? Colors.textPrimary : Colors.textMuted}
      />
    ),
  },
];

const SETTINGS_ITEM: NavItemConfig = {
  label: "Settings",
  href: "/settings",
  pathnameMatch: "/settings",
  renderIcon: (active) => (
    <Ionicons
      name="settings-outline"
      size={22}
      color={active ? Colors.textPrimary : Colors.textMuted}
    />
  ),
};

type NavItemProps = {
  config: NavItemConfig;
  active: boolean;
  collapsed: boolean;
};

function NavItem({ config, active, collapsed }: NavItemProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.navigate(config.href as any)}
      className={`flex-row items-center py-2.5 rounded-xl ${
        active ? "bg-dark-surface" : ""
      } ${collapsed ? "justify-center" : "gap-3 px-3"}`}
    >
      {config.renderIcon(active)}
      {!collapsed && (
        <Text
          className={`text-[15px] font-medium ${active ? "text-text-primary" : "text-text-muted"}`}
        >
          {config.label}
        </Text>
      )}
    </Pressable>
  );
}

export function NavSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View
      className={`${collapsed ? "w-[64px]" : "w-[220px]"} flex-col bg-dark-card border-r border-dark-border`}
    >
      <View className={`flex-1 pt-4 gap-1 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            config={item}
            active={pathname === item.pathnameMatch}
            collapsed={collapsed}
          />
        ))}
      </View>

      <View className="border-t border-dark-border">
        <Pressable
          onPress={() => setCollapsed(!collapsed)}
          className={`py-3 flex-row items-center ${collapsed ? "justify-center px-2" : "gap-2 px-3"}`}
        >
          <Ionicons
            name={collapsed ? "chevron-forward" : "chevron-back"}
            size={16}
            color={Colors.textMuted}
          />
          {!collapsed && <Text className="text-text-muted text-sm">Hide</Text>}
        </Pressable>

        <View className="h-px bg-dark-border mx-3" />

        <View className={`pb-6 pt-2 ${collapsed ? "px-2" : "px-3"}`}>
          <NavItem
            config={SETTINGS_ITEM}
            active={pathname === SETTINGS_ITEM.pathnameMatch}
            collapsed={collapsed}
          />
        </View>
      </View>
    </View>
  );
}
