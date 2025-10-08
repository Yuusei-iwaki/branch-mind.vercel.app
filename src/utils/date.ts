/**
 * 指定された日付文字列を「YYYY/MM/DD HH:mm」形式にフォーマットして返す関数
 * 
 * 例: "2025-10-08T12:34:56.789Z" → "2025/10/08 12:34"
 * 
 * @param dateString - フォーマット対象の日付文字列（ISO 文字列や Date.toString() 形式など）
 * @returns string - "YYYY/MM/DD HH:mm" 形式の文字列
 */
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};