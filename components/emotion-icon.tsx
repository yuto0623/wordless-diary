import { IconSymbol } from "@/components/ui/icon-symbol";
import { getEmotionByKey } from "@/constants/emotions";
import { EmotionType } from "@/types/emotion";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface EmotionIconProps {
  emotionKey: EmotionType;
  size?: number;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
}

export const EmotionIcon: React.FC<EmotionIconProps> = ({
  emotionKey,
  size = 60,
  onPress,
  selected = false,
  disabled = false,
  showLabel = true,
}) => {
  const emotion = getEmotionByKey(emotionKey);

  if (!emotion) return null;

  const handlePress = async () => {
    if (disabled) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const containerSize = size + 24;

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.container,
          {
            width: containerSize,
            height: containerSize,
            backgroundColor: emotion.color,
            opacity: pressed && !disabled ? 0.7 : 1,
            transform: [{ scale: selected ? 1.1 : 1 }],
          },
          selected && styles.selected,
        ]}
      >
        <IconSymbol
          name={emotion.icon as any}
          size={size}
          color="#FFFFFF"
        />
      </Pressable>
      {showLabel && (
        <Text style={styles.label}>{emotion.label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  container: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selected: {
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
});
