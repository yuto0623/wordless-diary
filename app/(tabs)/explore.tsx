import { Calendar } from "@/components/calendar";
import { EmotionStats } from "@/components/emotion-stats";
import { ThemedView } from "@/components/themed-view";
import { getEmotionsByMonth, getEmotionStats, initDatabase } from "@/database/emotions";
import { EmotionRecord, EmotionType } from "@/types/emotion";
import { addMonths } from "@/utils/date";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LookbackScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [emotions, setEmotions] = useState<EmotionRecord[]>([]);
  const [stats, setStats] = useState<Record<EmotionType, number>>({
    calm: 0,
    happy: 0,
    sad: 0,
    anxiety: 0,
    anger: 0,
    empty: 0,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const loadEmotions = useCallback(async () => {
    try {
      await initDatabase();
      const monthEmotions = await getEmotionsByMonth(year, month);
      setEmotions(monthEmotions);

      const monthStats = await getEmotionStats(year, month);
      setStats(monthStats);
    } catch (error) {
      console.error("Failed to load emotions:", error);
    }
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      loadEmotions();
    }, [loadEmotions])
  );

  const handlePrevMonth = () => {
    setCurrentDate((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Calendar
            year={year}
            month={month}
            emotions={emotions}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <EmotionStats stats={stats} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
