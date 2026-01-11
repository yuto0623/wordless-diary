/**
 * 感情タイプの定義
 */
export type EmotionType =
  | "calm"
  | "happy"
  | "sad"
  | "anxiety"
  | "anger"
  | "empty";

/**
 * 感情レコードの型定義
 */
export interface EmotionRecord {
  id: number;
  date: string; // YYYY-MM-DD
  emotion: EmotionType;
  created_at: number; // Unix timestamp
}

/**
 * 感情マスタの型定義
 */
export interface EmotionMaster {
  key: EmotionType;
  label: string;
  color: string;
  icon: string;
}
