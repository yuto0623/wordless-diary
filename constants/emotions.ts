import { EmotionMaster, EmotionType } from "@/types/emotion";

/**
 * 感情マスタデータ
 * テキストラベルは表示せず、色とアイコンで表現
 */
export const EMOTIONS: EmotionMaster[] = [
  {
    key: "calm",
    label: "おだやか",
    color: "#6BB5A0", // 落ち着いた緑
    icon: "leaf",
  },
  {
    key: "happy",
    label: "うれしい",
    color: "#FFD93D", // 明るい黄色
    icon: "sun.max.fill",
  },
  {
    key: "sad",
    label: "かなしい",
    color: "#6B9AD9", // 静かな青
    icon: "cloud.rain.fill",
  },
  {
    key: "anxiety",
    label: "不安",
    color: "#C490D1", // 紫
    icon: "tornado",
  },
  {
    key: "anger",
    label: "苛立ち",
    color: "#E57373", // 赤
    icon: "flame.fill",
  },
  {
    key: "empty",
    label: "からっぽ",
    color: "#9E9E9E", // グレー
    icon: "circle",
  },
];

/**
 * 感情キーから感情マスタを取得
 */
export const getEmotionByKey = (key: EmotionType): EmotionMaster | undefined => {
  return EMOTIONS.find((emotion) => emotion.key === key);
};

/**
 * 全ての感情キーを取得
 */
export const getAllEmotionKeys = (): EmotionType[] => {
  return EMOTIONS.map((emotion) => emotion.key);
};
