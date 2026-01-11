import { EmotionIcon } from "@/components/emotion-icon";
import { EMOTIONS } from "@/constants/emotions";
import { EmotionType } from "@/types/emotion";
import React from "react";
import { StyleSheet, View } from "react-native";

interface EmotionGridProps {
  onSelect: (emotion: EmotionType) => void;
}

export const EmotionGrid: React.FC<EmotionGridProps> = ({ onSelect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {EMOTIONS.map((emotion) => (
          <View key={emotion.key} style={styles.item}>
            <EmotionIcon
              emotionKey={emotion.key}
              onPress={() => onSelect(emotion.key)}
              size={50}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    maxWidth: 300,
  },
  item: {
    margin: 8,
  },
});
