import { NextRequest, NextResponse } from "next/server";
import OpenAi from 'openai';

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { description, historyContext } = body;

    if (!description) {
        return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    try {
        // 履歴コンテキストをプロンプトに自然に組み込む
        const prompt = `これまでの履歴を参考に、ユーザーの命名傾向を考慮してください。\n
        ${historyContext ? `【過去の履歴】\n${historyContext}` : '（履歴なし）'}\n
        【現在のタスク】\n
        内容: ${description}\n
        上記に基づいて、以下のルールでブランチ名を生成してください。\n\n
        ルール:\n
        - 英語で書く\n
        - 単語はハイフンでつなぐ\n
        - 最大3単語まで\n
        - 出力はブランチ名のみ（余計な文は書かない）`;

        console.log("Generated Prompt:", prompt); // デバッグ用にプロンプトをログ出力
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: [
                {
                    role: 'system',
                    content: 'あなたはGitブランチ名を生成する専門AIです。命名規則の一貫性を重視してください。',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: 40,
        });
        const branchName = response.choices[0].message.content?.trim() || 'feature/new-branch';
        return NextResponse.json({ branchName });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate branch name' }, { status: 500 });
    }
}