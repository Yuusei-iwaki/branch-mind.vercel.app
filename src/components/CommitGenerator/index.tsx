'use client';
import { useEffect, useState } from "react";
import { Copy, Check, Loader2, GitCommit, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { getHistory, HistoryItem, saveHistory } from "@/utils/history";
import { formatDate } from "@/utils/date";

const commitTypes = [
  { label: 'Fix', value: 'fix' },
  { label: 'Debug', value: 'debug' },
  { label: 'Add', value: 'add' },
] as const;

type CommitType = (typeof commitTypes)[number]['value'];

const KEY = 'commitMessage';

export default function CommitGenerator() {
    const [description, setDescription] = useState<string>('');
    const [type, setType] = useState<CommitType>('fix');
    const [results, setResults] = useState<{id: number, name: string}[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [histories, setHistories] = useState<HistoryItem[]>(getHistory(KEY))
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [selectedResult, setSelectedResult] = useState<{id: number, name: string}>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);
        const existingHistories = getHistory(KEY);
        const historyContext = existingHistories.map(history => `ユーザーの入力： ${history.prompt}\nAIの出力： ${history.result}`).join('\n\n');

        try {
            const response = await fetch('/api/generate-commit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, type, historyContext }),
            });
            const data = await response.json();
            setResults(data.commitMessages);
        } catch (err) {
            console.error(err);
            setResults([]);
            alert('コミットメッセージの生成に失敗しました。時間をおいて再試行してください。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            if (!copied) return;
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
    }, [copied]);

    const decideResult = () => {
        if (selectedResult) {
            saveHistory(KEY, description, selectedResult.name, type)
            setHistories(getHistory(KEY));
            navigator.clipboard.writeText(selectedResult.name);
            setCopied(true);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        作業内容
                    </label>
                    <textarea
                        placeholder="例: API エンドポイントに認証機能を追加"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        タイプ
                    </label>
                    <select 
                        value={type} 
                        onChange={e => setType(e.target.value as CommitType)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        {commitTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !description.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AIがコミットメッセージを考えています...
                        </>
                    ) : (
                        <>
                            <GitCommit className="w-5 h-5" />
                            コミットメッセージ生成
                        </>
                    )}
                </button>
            </form>

            {results.length > 0 && !loading && (
                <div className="space-y-4 mt-4">
                    <p className="text-sm font-medium text-gray-700">生成された候補（クリックして選択）</p>
                    {results.map((result) => (
                        <div
                            key={result.id}
                            onClick={() => setSelectedResult(result)}
                            className={`relative bg-gray-50 rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                selectedResult?.id === result.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1">
                                    <code className="font-mono text-sm text-gray-800 break-all">
                                        {result.name}
                                    </code>
                                </div>
                                {selectedResult?.id === result.id && (
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                )}
                            </div>
                        </div>
                    ))}
                    {selectedResult && (
                        <button
                            onClick={decideResult}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                        {copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                    コピーしました！
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                    選択してコピー
                            </>
                        )}
                        </button>
                    )}
                </div>
            )}

            {histories.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-6">
                    <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                        <summary className="cursor-pointer flex items-center justify-between text-sm font-medium">
                            <span>過去の履歴を見る ({histories.length}件)</span>
                            {showHistory ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                        </summary>
                    </button>

                    {showHistory && (
                        <div className="mt-4 space-y-3">
                            {histories.map((history,index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 mb-1">
                                                {formatDate(history.createdAt)}
                                            </p>
                                            <p className="text-sm text-gray-700 mb-1 truncate">
                                                <span className="font-medium">プロンプト:</span> {history.prompt}
                                            </p>
                                            <code className="text-xs font-mono text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 inline-block">
                                                {history.result}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}