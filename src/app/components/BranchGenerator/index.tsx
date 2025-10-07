'use client';
import { useState } from "react";

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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="作業内容を入力"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select value={type} onChange={(e) => setType(e.target.value as BranchType)}>
                    {branchTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? '生成中...' : 'ブランチ名生成'}
                </button>
            </form>
            {branchName && !loading && (
                <p>生成したブランチ名: {type}/{branchName}</p>
            )}
        </div>
    )
}