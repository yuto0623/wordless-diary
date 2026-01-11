import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getEmotionByKey } from "@/constants/emotions";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EmotionRecord, EmotionType } from "@/types/emotion";
import {
    formatDate,
    formatYearMonth,
    getCalendarDays,
} from "@/utils/date";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface CalendarProps {
  year: number;
  month: number;
  emotions: EmotionRecord[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  emotions,
  onPrevMonth,
  onNextMonth,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const days = getCalendarDays(year, month);

  // 日付から感情を取得するマップを作成
  const emotionMap = new Map<string, EmotionType>();
  emotions.forEach((record) => {
    emotionMap.set(record.date, record.emotion as EmotionType);
  });

  const today = formatDate(new Date());

  return (
    <ThemedView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} style={styles.navButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <ThemedText type="subtitle" style={styles.monthTitle}>
          {formatYearMonth(year, month)}
        </ThemedText>
        <Pressable onPress={onNextMonth} style={styles.navButton}>
          <IconSymbol name="chevron.right" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* 曜日ヘッダー */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={day} style={styles.weekdayCell}>
            <ThemedText
              style={[
                styles.weekdayText,
                index === 0 && styles.sundayText,
                index === 6 && styles.saturdayText,
              ]}
            >
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* カレンダーグリッド */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const emotion = emotionMap.get(dateString);
          const emotionData = emotion ? getEmotionByKey(emotion) : null;
          const isToday = dateString === today;

          return (
            <View
              key={dateString}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
              ]}
            >
              <ThemedText style={styles.dayNumber}>{day}</ThemedText>
              {emotionData && (
                <View
                  style={[
                    styles.emotionDot,
                    { backgroundColor: emotionData.color },
                  ]}
                >
                  <IconSymbol
                    name={emotionData.icon as any}
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
              )}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.6,
  },
  sundayText: {
    color: "#E57373",
  },
  saturdayText: {
    color: "#6B9AD9",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  todayCell: {
    backgroundColor: "rgba(107, 181, 160, 0.2)",
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 14,
    marginBottom: 2,
  },
  emotionDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
