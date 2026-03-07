import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

interface HeaderMenuProps {
  visible: boolean;
  onClose: () => void;
}

function MenuItem({
  icon,
  label,
  color = Colors.textPrimary,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  onPress?: () => void;
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper className="flex-row items-center px-3.5 py-3" onPress={onPress}>
      <Ionicons name={icon} size={18} color={color} style={{ marginRight: 10 }} />
      <Text className="text-[15px]" style={{ color }}>
        {label}
      </Text>
    </Wrapper>
  );
}

function Divider() {
  return <View className="h-px bg-dark-border mx-3.5" />;
}

export function HeaderMenu({ visible, onClose }: HeaderMenuProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose}>
        <View
          className="absolute right-4 bg-dark-card border border-dark-border rounded-[10px] min-w-[200px]"
          style={{
            top: insets.top + 56,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <MenuItem icon="information-circle-outline" label="Info" color={Colors.textMuted} />
          <Divider />
          <MenuItem
            icon="settings-outline"
            label="Settings"
            onPress={() => {
              onClose();
              router.push("/settings");
            }}
          />
          <Divider />
          <MenuItem icon="log-in-outline" label="Login / Logout" color={Colors.textMuted} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
