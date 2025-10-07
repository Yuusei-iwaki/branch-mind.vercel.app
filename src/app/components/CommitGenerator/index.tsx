'use client';
import { useState } from "react";

const commitTypes = [
  { label: 'Fix', value: 'fix' },
  { label: 'Debug', value: 'debug' },
  { label: 'Add', value: 'add' },
] as const;

type CommitType = (typeof commitTypes)[number]['value'];

export default function CommitGenerator() {
    const [description, setDescription] = useState('');
    const [type, setType] = useState<CommitType>('fix');
    const [commitMessage, setCommitMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCommitMessage('');

        try {
            const res = await fetch('/api/generate-commit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, type }),
            });
            const data = await res.json();
            setCommitMessage(data.commitMessage || 'Error');
        } catch {
            setCommitMessage('Error');
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
                    onChange={e => setDescription(e.target.value)}
                />
                <select value={type} onChange={e => setType(e.target.value as CommitType)}>
                    {commitTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? '生成中...' : 'コミットメッセージ生成'}
                </button>
            </form>
            {commitMessage && !loading && <p>生成されたコミットメッセージ: <br />{type}:{commitMessage}</p>}
        </div>
    )
}
