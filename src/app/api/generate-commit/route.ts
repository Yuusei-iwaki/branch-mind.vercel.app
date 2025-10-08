import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { description, historyContext } = body;

    if (!description) {
        return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    try {
        // 履歴コンテキストをプロンプトに自然に組み込む
        const prompt = `これまでの履歴を参考に、ユーザーの命名傾向を考慮してください。\n
        ${historyContext ? `【過去の履歴】\n${historyContext}` : '（履歴なし）'}\n
        【現在のタスク】\n
        内容: ${description}\n
        上記に基づいて、以下のルールでブランチ名を生成してください。\n\n
        ルール:\n
        - 日本語\n
        - 20文字以内\n
        - 出力はコミットメッセージのみ\n`;
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [
                {
                    role: "system",
                    content: 'あなたはGitコミットメッセージを生成する専門AIです。命名規則の一貫性を重視してください。',
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 40,
        });

        const commitMessage = response.choices[0].message.content?.trim() || `commit message`;
        return NextResponse.json({ commitMessage });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate commit message" }, { status: 500 });
    }
}