import { EmotionRecord, EmotionType } from "@/types/emotion";
import * as SQLite from "expo-sqlite";

const DB_NAME = "wordless.db";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * データベースを初期化
 */
export const initDatabase = async (): Promise<void> => {
  db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS emotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      emotion TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
};

/**
 * データベースインスタンスを取得
 */
const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    await initDatabase();
  }
  return db!;
};

/**
 * 感情を記録
 * @param date YYYY-MM-DD形式の日付
 * @param emotion 感情タイプ
 * @returns 成功した場合true、既に記録済みの場合false
 */
export const saveEmotion = async (
  date: string,
  emotion: EmotionType
): Promise<boolean> => {
  const database = await getDb();
  const createdAt = Math.floor(Date.now() / 1000);

  try {
    await database.runAsync(
      "INSERT INTO emotions (date, emotion, created_at) VALUES (?, ?, ?)",
      [date, emotion, createdAt]
    );
    return true;
  } catch {
    // UNIQUE制約違反（既に記録済み）の場合
    console.log("Already recorded for this date:", date);
    return false;
  }
};

/**
 * 指定日の感情を取得
 * @param date YYYY-MM-DD形式の日付
 */
export const getEmotionByDate = async (
  date: string
): Promise<EmotionRecord | null> => {
  const database = await getDb();

  const result = await database.getFirstAsync<EmotionRecord>(
    "SELECT * FROM emotions WHERE date = ?",
    [date]
  );

  return result || null;
};

/**
 * 指定月の感情を全て取得
 * @param year 年
 * @param month 月（0-11）
 */
export const getEmotionsByMonth = async (
  year: number,
  month: number
): Promise<EmotionRecord[]> => {
  const database = await getDb();

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  const results = await database.getAllAsync<EmotionRecord>(
    "SELECT * FROM emotions WHERE date >= ? AND date <= ? ORDER BY date ASC",
    [startDate, endDate]
  );

  return results;
};

/**
 * 全ての感情記録を取得
 */
export const getAllEmotions = async (): Promise<EmotionRecord[]> => {
  const database = await getDb();

  const results = await database.getAllAsync<EmotionRecord>(
    "SELECT * FROM emotions ORDER BY date DESC"
  );

  return results;
};

/**
 * 指定月の感情統計を取得
 */
export const getEmotionStats = async (
  year: number,
  month: number
): Promise<Record<EmotionType, number>> => {
  const emotions = await getEmotionsByMonth(year, month);

  const stats: Record<EmotionType, number> = {
    calm: 0,
    happy: 0,
    sad: 0,
    anxiety: 0,
    anger: 0,
    empty: 0,
  };

  emotions.forEach((record) => {
    stats[record.emotion as EmotionType]++;
  });

  return stats;
};
