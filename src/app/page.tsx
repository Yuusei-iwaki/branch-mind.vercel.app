import { GitBranch } from 'lucide-react';
import BranchGenerator from './components/BranchGenerator'
import CommitGenerator from './components/CommitGenerator'

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <GitBranch className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI Git Name Generator
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            AIでブランチ名とコミットメッセージを簡単生成
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
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="12" x2="9" y2="12" />
              <line x1="15" y1="12" x2="21" y2="12" />
            </svg>
            コミットメッセージ生成
          </h2>
          <CommitGenerator />
        </section>
      </main>

      {/* フッター */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2025 Git Name Generator - 開発効率を向上させるツール</p>
      </footer>
    </div>
  )
}