'use client';
import { useState } from "react";
import { Copy, Check, Loader2, GitBranch } from 'lucide-react';

const branchTypes = [
  { label: 'Feature', value: 'feature' },
  { label: 'Debug', value: 'debug' },
  { label: 'Add', value: 'add' },
] as const;

type BranchType = (typeof branchTypes)[number]['value'];

export default function BranchGenerator() {
    const [description, setDescription] = useState<string>('');
    const [type, setType] = useState<BranchType>('feature');
    const [branchName, setBranchName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setBranchName(''); 

        try {
            const response = await fetch('/api/generate-branch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, type }),
            });
            const data = await response.json();
            setBranchName(data.branchName || 'Error');
        } catch (err) {
            setBranchName('Error');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const fullBranchName = `${type}/${branchName}`;
        navigator.clipboard.writeText(fullBranchName);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        作業内容
                    </label>
                    <textarea
                        placeholder="例: AI を使ったブランチ名生成機能の追加"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        onChange={(e) => setType(e.target.value as BranchType)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        {branchTypes.map(type => (
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
                            生成中...
                        </>
                    ) : (
                        <>
                            <GitBranch className="w-5 h-5" />
                            ブランチ名生成
                        </>
                    )}
                </button>
            </form>

            {branchName && !loading && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">生成されたブランチ名</p>
                            <code className="font-mono text-sm text-gray-800 break-all">
                                {type}/{branchName}
                            </code>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-all"
                            title="コピー"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <Copy className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}