import { EmotionGrid } from "@/components/emotion-grid";
import { EmotionIcon } from "@/components/emotion-icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getEmotionByDate, initDatabase, saveEmotion } from "@/database/emotions";
import { EmotionType } from "@/types/emotion";
import { getTodayString } from "@/utils/date";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodayScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [todayEmotion, setTodayEmotion] = useState<EmotionType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadTodayEmotion = useCallback(async () => {
    try {
      await initDatabase();
      const today = getTodayString();
      const record = await getEmotionByDate(today);
      if (record) {
        setTodayEmotion(record.emotion as EmotionType);
      } else {
        setTodayEmotion(null);
      }
    } catch (error) {
      console.error("Failed to load today's emotion:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTodayEmotion();
    }, [loadTodayEmotion])
  );

  const handleSelectEmotion = async (emotion: EmotionType) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const today = getTodayString();
      const success = await saveEmotion(today, emotion);
      if (success) {
        setTodayEmotion(emotion);
      }
    } catch (error) {
      console.error("Failed to save emotion:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ActivityIndicator size="large" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  // 記録済み状態
  if (todayEmotion) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <View style={styles.completedContainer}>
            <ThemedText style={styles.dateText}>
              {getTodayString()}
            </ThemedText>
            <ThemedText type="title" style={styles.completedText}>
              今日の気持ち
            </ThemedText>
            <View style={styles.emotionDisplay}>
              <EmotionIcon
                emotionKey={todayEmotion}
                size={80}
                selected
                disabled
              />
            </View>
            <ThemedText style={styles.recordedText}>
              記録しました
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // 未記録状態 - 感情選択UI
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.selectContainer}>
          <ThemedText style={styles.dateText}>
            {getTodayString()}
          </ThemedText>
          <ThemedText type="title" style={styles.promptText}>
            今日の気持ちは？
          </ThemedText>
          <EmotionGrid onSelect={handleSelectEmotion} />
        </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  selectContainer: {
    alignItems: "center",
    padding: 20,
  },
  completedContainer: {
    alignItems: "center",
    padding: 20,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },
  promptText: {
    marginBottom: 40,
    textAlign: "center",
  },
  completedText: {
    marginBottom: 40,
    textAlign: "center",
  },
  emotionDisplay: {
    marginBottom: 24,
  },
  recordedText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
