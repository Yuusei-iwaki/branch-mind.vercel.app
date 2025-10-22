// テストデプロイ
import { Activity, GitBranch, GitCommit, Variable } from 'lucide-react';
import BranchGenerator from '@/components/BranchGenerator';
import CommitGenerator from '@/components/CommitGenerator';
import VariableGenerator from '@/components/VariableGenerator';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI Name Lab
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Gitやコードの命名作業をAIで効率化
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* ブランチ名生成 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-blue-500" />
            ブランチ名生成
          </h2>
          <BranchGenerator />
        </section>

        {/* コミットメッセージ生成 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-blue-500" />
            コミットメッセージ生成
          </h2>
          <CommitGenerator />
        </section>

        {/* 変数名生成 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Variable className="w-6 h-6 text-blue-500" />
            変数名生成
          </h2>
          <VariableGenerator />
        </section>
      </main>

      {/* フッター */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2025 AI Name Lab - 開発効率を向上させるツール</p>
      </footer>
    </div>
  )
}