import { NextRequest, NextResponse } from "next/server";
import OpenAi from 'openai';

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    const body = await request.json();
    const{ description } = body;

    if (!description) {
        return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: [
                {
                    role: 'system',
                    content: `あなたはGitブランチ名生成AIです。以下のルールに従ってブランチ名を生成してください。
                        ルール:
                        - 英語で書く
                        - 単語はハイフンでつなぐ
                        - 最大4単語まで
                        - 出力はブランチ名だけ。余計な文章は書かない`,
                },
                {
                    role: 'user',
                    content: `この作業内容からブランチ名を考えてください: ${description}`,
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