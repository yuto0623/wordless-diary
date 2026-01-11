import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EMOTIONS } from "@/constants/emotions";
import { EmotionType } from "@/types/emotion";
import React from "react";
import { StyleSheet, View } from "react-native";

interface EmotionStatsProps {
  stats: Record<EmotionType, number>;
}

export const EmotionStats: React.FC<EmotionStatsProps> = ({ stats }) => {
  const totalCount = Object.values(stats).reduce((sum, count) => sum + count, 0);

  if (totalCount === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>
          まだ記録がありません
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        今月の感情
      </ThemedText>
      <View style={styles.statsGrid}>
        {EMOTIONS.map((emotion) => {
          const count = stats[emotion.key];
          const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

          return (
            <View key={emotion.key} style={styles.statItem}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: emotion.color,
                      height: `${Math.max(percentage, 5)}%`,
                    },
                  ]}
                />
              </View>
              <View
                style={[styles.dot, { backgroundColor: emotion.color }]}
              />
              <ThemedText style={styles.countText}>{count}</ThemedText>
              <ThemedText style={styles.labelText}>{emotion.label}</ThemedText>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.5,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100,
    marginTop: 28,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  barContainer: {
    width: 24,
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 12,
    minHeight: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  countText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  labelText: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.6,
  },
});
