import { NextRequest, NextResponse } from "next/server";
import OpenAi from 'openai';

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { type, description, historyContext } = body;

    if (!description) {
        return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    try {
        // 履歴コンテキストをプロンプトに自然に組み込む
        const prompt = `これまでの履歴を参考に、ユーザーの命名傾向を考慮してください。\n
        ${historyContext ? `【過去の履歴】\n${historyContext}` : '（履歴なし）'}\n
        【現在のタスク】\n
        内容: ${description}\n
        上記に基づいて、以下のルールで**3つの異なるブランチ名**を生成してください。\n\n
        ルール:\n
        - 英語で書く\n
        - 単語はハイフンでつなぐ\n
        - 最大3単語まで\n
        - 出力はブランチ名のみ（余計な文は書かない）\n
        - 先頭には必ず${type}/を付与する\n
        - 各案は改行で区切って出力する`;


        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                {
                    role: 'system',
                    content: 'あなたはGitブランチ名を生成する専門AIです。命名規則の一貫性を保ちながらも重複を避け、バリエーションを出してください。',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: 40,
        });

        // モデルが1つのmessage内で3案を返す想定
        const content = response.choices[0].message?.content || '';
        const names = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('-')); // 空行・説明文除去

        // 重複を削除して、最大3件に絞る
        const unique = Array.from(new Set(names)).slice(0, 3);

        // オブジェクト配列化
        const branchNames = unique.map((name, index) => ({
            id: index + 1,
            name,
        }));

        return NextResponse.json({ branchNames });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate branch name' }, { status: 500 });
    }
}
