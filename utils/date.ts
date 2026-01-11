/**
 * 日付ユーティリティ関数
 */

/**
 * 今日の日付をYYYY-MM-DD形式で取得
 */
export const getTodayString = (): string => {
  const now = new Date();
  return formatDate(now);
};

/**
 * DateオブジェクトをYYYY-MM-DD形式の文字列に変換
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD形式の文字列からDateオブジェクトを生成
 */
export const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 指定した月の日数を取得
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * 指定した月の最初の曜日を取得（0=日曜日）
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * 月のカレンダー用の日付配列を生成
 */
export const getCalendarDays = (
  year: number,
  month: number
): (number | null)[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days: (number | null)[] = [];

  // 月初めの空白を追加
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // 日付を追加
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};

/**
 * 月を加算/減算
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * 年月を表示用フォーマットに変換
 */
export const formatYearMonth = (year: number, month: number): string => {
  return `${year}年${month + 1}月`;
};
