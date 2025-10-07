import BranchGenerator from "@/app/components/BranchGenerator"
import CommitGenerator from "./components/CommitGenerator"

export default function Page() {
  return (
    <main>
      <h1>
        AI Git Name Generator
      </h1>
      <h2>
        AI Branch Name Generator
      </h2>
      <BranchGenerator />
      <h2>
        AI Commit Message Generator
      </h2>
      <CommitGenerator />

    </main>
  )
}