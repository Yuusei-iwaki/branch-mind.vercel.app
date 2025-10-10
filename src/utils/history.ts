import { v4 as uuidv4 } from 'uuid';
/**
 * 履歴アイテムの型定義。
 * prompt: ユーザーが入力した内容（例: "ログイン機能追加"）
 * result: AIが生成した結果（例: "feature/101-login"）
 * createdAt: 生成日時（ISO形式の文字列）
 */
export type HistoryItem = {
    id: string;
    prompt: string;
    result: string;
    type: string;
    createdAt: string;
}

/**
 * 指定したキーに対応する履歴を localStorage に保存する関数。
 * 
 * - 同一の (prompt, result) がすでに存在する場合は重複を除外。
 * - 新しい履歴は常に先頭に追加され、古いものから削除される。
 * - デフォルトでは最大10件まで保存。
 * 
 * @param key - 履歴の識別用キー（例: 'branchName' や 'commitMessage'）
 * @param prompt - ユーザーが入力した内容
 * @param result - AIが生成した出力結果
 * @param maxItems - 保存する履歴の最大件数（デフォルト10件）
 */
export const saveHistory = (key: string, prompt: string, result: string, type: string, maxItems: number = 10) => {
    if (typeof window === 'undefined') return; // サーバーサイドでは動作しないようにする
    const historyKey = `history_${key}`;

    // 既存履歴を取得（存在しない場合は空配列）
    const existingHistory: HistoryItem[] = JSON.parse(localStorage.getItem(historyKey) || '[]');

    // 重複を除外（prompt と result の両方が一致する場合）
    const filteredHistory = existingHistory.filter(
        (item) => !(item.prompt === prompt && item.result === result)
    );

    // 新しい履歴を先頭に追加
    const newEntry: HistoryItem = {
        id: uuidv4(),
        prompt,
        result,
        type,
        createdAt: new Date().toISOString(),
    };

    const updatedHistory = [newEntry, ...filteredHistory].slice(0, maxItems);

    // localStorage に保存
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
};


/**
 * 指定したキーに対応する履歴を取得する関数。
 * 
 * - 返却は新しい順（最新の履歴が先頭）。
 * - データが存在しない場合は空配列を返す。
 * 
 * @param key - 履歴の識別用キー
 * @returns HistoryItem[] - 履歴アイテムの配列
 */
export const getHistory = (key: string): HistoryItem[] => {
    if (typeof window === 'undefined') return []; // サーバーサイドでは動作しないようにする
    const historyKey = `history_${key}`;
    return JSON.parse(localStorage.getItem(historyKey) || '[]');
};

/**
 * 指定したキーに対応する履歴を削除する関数。
 * 
 * - localStorage から該当キーの履歴を完全に削除。
 * 
 * @param key - 履歴の識別用キー
 */
export const clearHistory = (key: string) => {
    if (typeof window === 'undefined') return; // サーバーサイドでは動作しないようにする
    const historyKey = `history_${key}`;
    localStorage.removeItem(historyKey);
};